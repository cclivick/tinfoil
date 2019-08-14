const cheerio = require("cheerio");
const axios = require("axios");

var Article = require("../../models/Article.js")

console.log("Grabbing articles from Metal Injection's homepage")

module.exports = function(app) {
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
                    console.log(dbArticle);
                }).catch(function(err) {
                    console.log(err);
                })
            });
        }); 
        res.send("Scrape done")
    });    
};

