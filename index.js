const express = require("express");

const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;

const client = new MongoClient(process.env.MONGO_URI);

const port = process.env.PORT || 3000;


app.use(express.json());

/*
"nome": "Maria",
"email": "maria@example.com",
"dataNascimento": "2000-01-01",
"matricula": "20251234"
*/

app.post("/aluno/cadastrar-db", async (req, res) => {
  const { nome, email, dataNascimento, matricula } = req.body;

  if (!nome || !email || !dataNascimento || !matricula) {
    return res.status(400).json({
      error: "nome, email, dataNascimento and matricula are required.",
    });
  }

  const database = client.db("cluster0");
  const collection = database.collection("alunos");

  const existing = await collection.findOne({ matricula });

  if (existing) {
    return res
      .status(409)
      .json({ error: "Aluno com esta matrícula já existe." });
  }

  const aluno = { nome, email, dataNascimento, matricula };
  await collection.insertOne(aluno);

  res.status(201).json({ message: "Aluno criado com sucesso!", aluno });
});

app.get("/aluno/listar-db", async (req, res) => {
  const database = client.db("cluster0");
  const collection = database.collection("alunos");

  if (!collection) {
    return res.status(500).json({ error: "Sem alunos cadastrados." });
  }

  const alunos = await collection.find({}).toArray();

  res.json(alunos);
});


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
