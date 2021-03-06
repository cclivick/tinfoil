//Require in dependencies for server
var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/tinfoil";
//Set up port for localhost
var PORT = process.env.PORT || 8080;

//Initialize Express
var app = express();

//Set up middleware
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Set up handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Connect to MongoDB database
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Require in routes with express
require("./public/routes/apiRoutes")(app);
require("./public/routes/htmlRoutes")(app);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });

module.exports = app;
//module.exports = db;