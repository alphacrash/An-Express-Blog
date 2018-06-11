var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/an-express-blog");

var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

var postSchema = new mongoose.Schema({
    title: String,
    image: String,
    content: String,
    created: {
        type: Date,
        default: Date.now
    }
});

var Post = mongoose.model("Post", postSchema);

// Index Page
app.get("/", function (req, res) {
    res.render("index");
});

// Archives
app.get("/posts", function (req, res) {
    Post.find({}, function (err, allPosts) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("posts", { posts: allPosts });
        }
    });
});

// Create new post
app.get("/posts/new", function (req, res) {
    res.render("posts/new");
});

app.post("/posts", function (req, res) {
    var newPost = req.body.post;

    Post.create(newPost, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/posts");
        }
    });
});

app.listen(3000, function () {
    console.log("Server is running...");
});