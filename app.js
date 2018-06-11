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

var posts = [
    { title: "Just lying on the ground", image: "https://cdn.stocksnap.io/img-thumbs/960w/GGQVLCTSWI.jpg" },
    { title: "Foot in sand", image: "https://cdn.stocksnap.io/img-thumbs/960w/YRI8K6RLX2.jpg" },
    { title: "Make it happen", image: "https://cdn.stocksnap.io/img-thumbs/960w/YEW4VFXSIG.jpg" }
];

app.get("/posts", function (req, res) {
    res.render("posts", { posts: posts });
});

app.listen(3000, function () {
    console.log("Server is running...");
});