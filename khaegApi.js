import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import admin from "firebase-admin";

import serviceAccount from "./config/react-app-khaeg-firebase.json" with { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.listen(port, ()=>{
    console.log(`Web application listening on port ${port}.`);
});

function addBook(){
    const bookRef = db.collection('Books').doc();
    const docRef = db.collection('Books').doc(bookRef.id);
    docRef.set(
        // JSON Document
        {
            id: 'B1004',
            title: "Title B1004",
            description: "Desc. B1004"
        }
    );
    console.log('Book added.');
}

app.get('/addBook', (req, res) => {
    addBook();
    res.end('Added new book.');
})

async function addBookNew(tmpBookData){
    const bookRef = db.collection('Books').doc();
    const docRef = db.collection('Books').doc(bookRef.id);
    await docRef.set(tmpBookData);
    console.log('Book added.');
}

app.post('/api/addBook', (req, res) => {
    const { bookTitle, bookDesc, bookCate } = req.body;
    const tmpData = { bookTitle, bookDesc, bookCate };
    addBookNew(tmpData);
    res.status(200).json({ message: 'บันทึกข้อมูลหนังสือใหม่สำเร็จ' });
})

async function fetchBook(){
    const result = [];
    const booksRef = db.collection('Books');
    const docRef = await booksRef.get();
    docRef.forEach(doc => {
       result.push({
        id: doc.id,
        ...doc.data()
       });
    });
    return JSON.stringify(result);
}

app.get('/api/getBooks', (req, res) => {
    res.set('Content-type', 'application/json');
    fetchBook().then((jsonData) => {
        res.send(jsonData);
    }).catch((error) => {
        res.send(error);
    });
});
