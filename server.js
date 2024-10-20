// Npm 라이브러리 불러오기
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");

// model 불러오기
const Product = require("./models/Product.model.js");

// Express App 설정
const app = express();
const port = 5000;

// Multer 설정 (최상위에 위치)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // 원본 파일명으로 저장
  },
});
const upload = multer({ storage: storage });

// 전역변수
let FileData;
let JsonData;
let finallyjson;

// Express 미들웨어 설정
app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: true,
}));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname + "/templates")));
app.use(express.json());

// GET : 렌더링
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/templates/html/main.html"));
});

app.get("/:id", (req, res) => {
  let getID = req.params.id;
  console.log(getID);

  let File = `/templates/html/${getID}.html`;
  res.sendFile(path.join(__dirname + File));
});

// 사용자 정보 양식 요청
app.get("/api/writeform/user", (req, res) => {
  res.sendFile(path.join(__dirname + "/templates/html/Ask/InfoForm.html"));
});

// 신청 양식 요청
app.get("/api/writeform/ask", (req, res) => {
  res.sendFile(path.join(__dirname, "/templates/html/Ask/AskForm.html"));
});

app.get("/api/writeform/result", (req, res) => {
  res.sendFile(path.join(__dirname, "/templates/html/Ask/OrderInfo.html"));
});

// 파일 업로드 여부 및 데이터 전송 처리
app.post("/api/writeform/ask", (req, res) => {
  FileData = req.body;
  console.log("Received JSON data: ", FileData);

  // 클라이언트에서 받은 데이터로 다음 페이지로 이동
  res.json({
    message: "Data received successfully",
    nextPage: "/api/writeform/ask",
  });
});

// 파일 업로드 처리
app.post("/api/writeform/user", upload.single("file"), (req, res) => {
  const { fileName, count, color, detail } = req.body;
  const file = req.file; // req.file로 업로드된 파일 접근 가능
  
  // 파일 존재 여부 확인
  if (!file) {
    return res.status(400).json({ message: "파일이 업로드되지 않았습니다." });
  }

  // JSON 데이터 생성
  JsonData = {
    file: file, // 업로드된 파일 정보
    fileName: fileName, // 파일명
    count: count, // 카운트
    color: color, // 색상
    detail: detail, // 상세 정보
    blueprint: FileData, // 이전에 수집된 파일 데이터 (가능한 경우)
  };

  console.log(JsonData); // 수집된 데이터 로그

  // 클라이언트에게 응답
  res.json({
    message: "Data received successfully",
    nextPage: "/api/writeform/user",
    filePath: `/uploads/${file.filename}`, // 업로드된 파일 경로 포함
  });
});

app.post("/api/writeform/result", async (req, res) => {
  const { name, email, deliveryDate, address } = req.body;

  finallyjson = {
    username: name,
    useremail: email,
    deliveryDate: deliveryDate,
    address: address,
    product: JsonData,
  }

  console.log(finallyjson);

  try {
    // Product 모델을 사용하여 데이터베이스에 저장
    const productEntry = await Product.create(finallyjson);

    // 클라이언트에게 응답
    res.status(200).json({
      message: "Data received and saved successfully",
      product: productEntry,
      nextPage: "/api/writeform/result",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/getjson", (req, res) => {
  res.json(finallyjson); // 전역 변수 finallyjson의 내용을 응답
});


// CREATE API (제품 생성)
app.post("/api/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ API (모든 제품 조회)
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 특정 제품 검색 API
app.get("/api/search/:keyword", async (req, res) => {
  try {
    const { keyword } = req.params;
    const product = await Product.findById(keyword); // ID로 검색
    console.log(product);

    if (product) {
      res.status(200).json(product); // 검색된 제품 반환
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MongoDB 연결 및 서버 실행
mongoose
  .connect(
    "mongodb+srv://rkdtjrgh124:AOxDsBMgg8cP0Gih@webtable.g2ha8vc.mongodb.net/Node-API?retryWrites=true&w=majority&appName=WebTable"
  )
  .then(() => {
    console.log("MongoDB 연결 성공");
    app.listen(port, () => {
      console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
    });
  })
  .catch((err) => {
    console.error("MongoDB 연결 실패:", err.message);
  });
