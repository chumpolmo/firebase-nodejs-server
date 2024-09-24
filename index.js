import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import admin from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import serviceAccount from './config/react-app-khaeg-firebase.json' with  
{ 
    type : "json"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//การรียกใช้งานบริการ Firebase Admin SDK
const db = admin.firestore();
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Example app listening on port ${port}.`)
});

// ตัวอย่าง การเพิ่มข้อมูลใน Firestore
async function addBook(bookData) {
    const newBookRef = db.collection('Books').doc();
    const docRef = db.collection('Books').doc(newBookRef.id);
    let myJson = {
        "bookCode": newBookRef.id,
        "bookTitle": bookData.bookTitle,
        "bookDesc": bookData.bookDesc,
        "bookCate": bookData.bookCate
    };
    //const myJson = bookData;
    await docRef.set(myJson);
    console.log('Book added!');
}

app.post('/api/bookInsert', (req, res) => {
    console.log("xxx", req.body);
    const { bookTitle, bookDesc, bookCate } = req.body;
    console.log('Received from data: ', { bookTitle, bookDesc, bookCate });
    const myForm = { bookTitle, bookDesc, bookCate };
    addBook(myForm);
    const myRes = { message: "[INFO] บันทึกข้อมูลหนังสือใหม่สำเร็จ"};
    res.status(200).json(myRes);  // res.end('xxx');
});

// อ่านข้อมูลจากฐานข้อมูล app.get('...', () => { () => { ... } });
async function fetchBook(){
    const result = [];
    const booksRef = db.collection('Books');
    const docsRef = await booksRef.get();
    docsRef.forEach(doc => {
        result.push({
            id: doc.id,
            ...doc.data()
        });
    });
    return result;
}

app.get('/api/getBooks', (req, res) => {
    res.set('Content-Type', 'application/json');
    fetchBook().then((jsonData) => {
        res.status(200).json(jsonData);
    }).catch((error) => {
        res.send(error);
    });
});

app.get('/addBook', (req, res) => {
    addBook();
    res.end('Added new book.');
});

app.get('/', (req, res) => {
    res.send('Hi, Aj.Khaeg server.');
});
