var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    body: {
        type: String,
        trim: true
    },
    saved: {
        type: Boolean,
        default: true
    }
})

var Note = mongoose.model("Note", NoteSchema)

module.exports = Note;