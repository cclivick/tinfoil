//Require in mongoose on each page it's used
var mongoose = require("mongoose");

//Reference the Schema constructor
var Schema = mongoose.Schema;

var ArtSchema = new Schema({
    title: {
        type: String
    },
    link: {
        type: String
    },
    image: {
        type: String
    }
})

var Article = mongoose.model("Article", ArtSchema)

module.exports = Article;