import express from 'express';

const app = express();
const port = 3000;

app.get('/api/MyTest', (req, res) => {
    res.send('Hi, DBI.');
});

app.listen(port, () => {
    console.log(`App listening on port ${port}.`);
});
