var express = require("express"),
    bodyParser = require("body-parser");

var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.send("Home Page");
});

app.listen(3000, function () {
    console.log("Server is running...");
});