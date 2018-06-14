var express = require("express");
var router = express.Router();
var Post = require("../models/post");

// Archives
router.get("/", function (req, res) {
    Post.find({}, function (err, allPosts) {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("posts/posts", { posts: allPosts });
        }
    });
});

// Create new post
router.get("/new", isLoggedIn, function (req, res) {
    res.render("posts/new");
});

router.post("/", isLoggedIn, function (req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPost = { title: req.body.title, image: req.body.image, content: req.body.content, author: author }

    Post.create(newPost, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/posts");
        }
    });
});

// Show post
router.get("/:id", function (req, res) {
    Post.findById(req.params.id).populate("comments").exec(function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("posts/show", { post: foundPost });
        }
    });
});

// Edit
router.get("/:id/edit", checkPostOwnership, function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        res.render("posts/edit", { post: foundPost });
    })
});

router.put("/:id", checkPostOwnership, function (req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body.post, function (err, foundPost) {
        if (err) {
            res.redirect("/posts");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

// Delete
router.delete("/:id", checkPostOwnership, function (req, res) {
    Post.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    });
});

// Middleware

function checkPostOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Post.findById(req.params.id, function (err, foundPost) {
            if (err) {
                res.redirect("/posts");
            } else {
                if (foundPost.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;