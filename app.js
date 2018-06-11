var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/an-express-blog");

var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/posts", function (req, res) {
    res.render("posts");
});

app.listen(3000, function () {
    console.log("Server is running...");
});