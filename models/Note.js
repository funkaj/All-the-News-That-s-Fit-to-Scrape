const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: String,
  body: String
});

let Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
