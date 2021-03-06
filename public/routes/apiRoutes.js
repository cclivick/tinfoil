const cheerio = require("cheerio");
const axios = require("axios");

var Article = require("../../models/Article.js")
var Note = require("../../models/Note.js")

console.log("Grabbing articles from Metal Injection's homepage")

module.exports = function(app) {
    //ROUTE FOR SCRAPING DATA FROM METAL INJECTION AND SAVING RESULTS TO ARTICLE COLLECTION
    app.get("/scrape", function(req,res) {
        axios.get("https://metalinjection.net/").then(function(response) {
            var $ = cheerio.load(response.data);
            $("article.post").each(function(index, element) {
                var result = {};
                result.title = $(element).find("div.content").find("h2.title").find("a").text();
                result.link = $(element).children().attr("href");
                result.image = $(element).find("img").attr("src");
                Article.create(result)
                .then(function(dbArticle) {
                    //console.log(dbArticle);
                }).catch(function(err) {
                    console.log(err);
                })
            });
        }).then(function() {
            res.end();  
        })
    });
    
    //ROUTE FOR GRABBING ARTICLES FROM ARTICLE COLLECTION
    app.get("/articles", function(req, res) {
        Article.find({})
          .then(function(dbArticle) {
            res.json(dbArticle);
          })
          .catch(function(err) {
            res.json(err);
          });
      });

    //ROUTE FOR SAVING ARTICLES
    app.post("/articles/save/:id", function(req, res) {
    Article.findOneAndUpdate({ _id : req.params.id }, { saved : true })
    .then(function(dbArticle) {
        res.json(dbArticle);
        })
    })

    //ROUTE FOR PURGING ALL UNSAVED ARTICLES FROM ARTICLES COLLECTION
    app.post("/purge", function(req,res) {
    Article.deleteMany({ saved : false })
    .then(function(dbArticle) {
        //console.log(dbArticle);
        res.end();
        }).catch(function(err) {
            console.log(err)
        })
    })

    //ROUTE FOR DELETING SAVED ARTICLES
    app.post("/articles/unsave/:id", function(req, res) {
    Article.findOneAndDelete({ _id : req.params.id })
    .then(function(dbArticle) {
        res.json(dbArticle);
        })
    })

    //ROUTE FOR DISPLAYING ARTICLE'S EXISTING NOTES IN MODAL
    app.get("/articles/:id", function(req, res) {
        Article.findOne({ _id : req.params.id })
        .populate("note")
        .then(function(dbArticle) {
            //console.log(dbArticle);
            if(dbArticle.note) {
                res.json(dbArticle.note);
            }
        })
        .catch(function(err) {
            console.log(err);
        })
    })

    //ROUTE FOR ASSOCIATING A NEW NOTE TO AN ARTICLE
    app.post("/articles/savenote/:id", function(req, res) {
        Note.create(req.body)
        .then(function(dbNote) {
            return Article.findOneAndUpdate({ _id : req.params.id }, { $push : { note : dbNote._id }}, { new : true })
        })
        .then(function(dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err)
        })
    })

    //ROUTE FOR DELETING AN EXISTING NOTE
    app.post("/articles/delnote/:id/:note", function(req, res) {
        let noteID = req.params.note;
        Note.findOneAndDelete({ _id : noteID })
        .then(function(dbNote) {
            res.json(dbNote);
        })
        .catch(function(err) {
            res.json(err);
        })
    })
};

