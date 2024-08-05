// Npm 라이브러리 불러오기
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//model 불러오기
const Product = require('./models/Product.model.js');

// Express App 설정
const app = express();
const port = 5000;

// Express 미들웨어 설정
app.use(express.static(path.join(__dirname + '/templates')));
app.use(express.json());

// GET : 렌더링
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/templates/html/main.html'));
});


app.get('/:id', (req, res) => {
    let getID = req.params.id;
    console.log(getID);

    let File;

    if (getID === "Esetimate&view") {
        File = '/templates/html/List-Estimate/view.html';
    } else if (getID === "Esetimate&write") {
        File = '/templates/html/List-Estimate/write.html';
    } else if (getID === "Esetimate&edit") {
        File = '/templates/html/List-Estimate/edit.html';
    } else if (getID === "Inquiry&edit") {
        File = '/templates/html/List-Inquiry/edit.html';
    } else if (getID === "Inquiry&write") {
        File = '/templates/html/List-Inquiry/write.html';
    } else if (getID === "Inquiry&view") {
        File = '/templates/html/List-Inquiry/view.html';
    } else {
        File = `/templates/html/${getID}.html`;
    }

    res.sendFile(path.join(__dirname + File));
});


//CREATE API
app.post('/api/products', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//READ API
app.get('/api/products', async (req, res) => {
    try {
        const product = await Product.find({});
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.get('/api/Search', async(req, res) => {
    try {
        const { keyword } = req.params;

        const product = Product.FindByID(keyword);
        console.log(product);

        res.sendFile(path.join(__dirname + '/templates/html/Search/tracking.html'))
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})


mongoose.connect("mongodb+srv://rkdtjrgh124:AOxDsBMgg8cP0Gih@webtable.g2ha8vc.mongodb.net/Node-API?retryWrites=true&w=majority&appName=WebTable")
    .then(() => {
        console.log('MongoDB 연결 성공');
        app.listen(port, () => {
            console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
        });
    })
    .catch((err) => {
        console.error('MongoDB 연결 실패:', err.message);
    });