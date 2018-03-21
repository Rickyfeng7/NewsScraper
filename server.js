var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");
var models = require("./models");
var index = require("./routes/index");

var PORT = 3000;

// Initialize Express
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.use("/", index);
// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/HomeworkNewsScraper");
  // useMongoClient: true


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});