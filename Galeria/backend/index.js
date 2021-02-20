const express = require("express");
const app = express();
const api = require("./api");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/uploads/");
  },
  filename: (req, file, cb) => {
    // cb(null, `${Date.now()}_${file.originalname}`)
    cb(null, `${file.originalname}`);
  },
});
const upload = multer({ storage });

app.route("/categorias")
    .post(api.setCategoria())
    .get(api.getCategorias());

app.post("/upload", upload.single("loadImg"), api.setImagensDB());

app.route("/imagens")
    .get(api.getImagens());

app.listen(3003, () => console.log("Servidor rodando!"));
