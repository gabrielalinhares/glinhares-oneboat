//declaring  dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express(); // setting up Express 
const PORT = process.env.PORT || 3001; // defininyg PORT 
const { v4: uuidv4 } = require('uuid')
const util = require("util");



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);


const db_FILE = path.join(__dirname, "db", "db.json");


app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});


app.get("/api/notes", (req, res) => {
  readFileAsync(db_FILE, "utf8").then((notes) => {
    return res.json(JSON.parse(notes));
  });
});

app.post("/api/notes", (req, res) => {
  readFileAsync(db_FILE, "utf8").then((data) => {
    const nNote = req.body;
    nNote.id = uuidv4();
    let notesArray = JSON.parse(data);
    notesArray.push(nNote);
    writeFileAsync(db_FILE, JSON.stringify(notesArray)).then(() => {
      return res.json(notesArray);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => { // delete notes 
  readFileAsync(db_FILE, "utf8").then((data) => {
    let notesArray = JSON.parse(data);
    notesArray = notesArray.filter((note) => note.id !== req.params.id);
    writeFileAsync(db_FILE, JSON.stringify(notesArray)).then(() => {
      return res.json(notesArray);
    });
  });
});


app.listen(PORT, function () {
  console.log(`Listening PORT ${PORT}`);
});
