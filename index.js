const express = require("express");

const app = express();
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs").promises;
const path = require("path");

const client = new MongoClient(process.env.MONGO_URI);

const port = process.env.PORT || 3000;

const ALUNOS_JSON = path.join(__dirname, "alunos.json");

app.use(express.json());

/*
"nome": "Maria",
"email": "maria@example.com",
"dataNascimento": "2000-01-01",
"matricula": "20251234"
*/

async function readAlunos() {
  try {
    const data = await fs.readFile(ALUNOS_JSON, "utf8");

    if (!data.trim()) {
      console.warn("Arquivo de alunos está vazio.");
      return [];
    }

    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    console.error("Erro ao ler arquivo de alunos:", error);
    throw error;
  }
}

async function writeAlunos(alunos) {
  await fs.writeFile(ALUNOS_JSON, JSON.stringify(alunos, null, 2), "utf8");
}

app.post("/aluno/cadastrar", async (req, res) => {
  try {
    const { nome, email, dataNascimento, matricula } = req.body;

    if (!nome || !email || !dataNascimento || !matricula) {
      return res.status(400).json({
        error: "nome, email, dataNascimento e matricula são necessários.",
      });
    }

    const alunos = await readAlunos();

    const existing = alunos.find((aluno) => aluno.matricula === matricula);
    if (existing) {
      return res
        .status(409)
        .json({ error: "Aluno com esta matrícula já existe." });
    }

    const novoAluno = { nome, email, dataNascimento, matricula };
    alunos.push(novoAluno);

    await writeAlunos(alunos);

    res
      .status(201)
      .json({ message: "Aluno criado com sucesso!", aluno: novoAluno });
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);

    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/aluno/listar", async (req, res) => {
  try {
    const alunos = await readAlunos();

    res.json(alunos);
  } catch (error) {
    console.error("Erro ao listar alunos:", error);

    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.post("/aluno/cadastrar-db", async (req, res) => {
  const { nome, email, dataNascimento, matricula } = req.body;

  if (!nome || !email || !dataNascimento || !matricula) {
    return res.status(400).json({
      error: "nome, email, dataNascimento e matricula são necessários.",
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
