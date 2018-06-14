var express = require("express");
var router = express.Router({ mergeParams: true });
var Post = require("../models/post");
var Comment = require("../models/comment");

router.get("/new", isLoggedIn, function (req, res) {
    console.log(req.params.id);
    Post.findById(req.params.id, function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { post: foundPost });
        }
    });
});

router.post("/", function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    foundPost.comments.push(comment);
                    foundPost.save();
                    res.redirect("/posts/" + foundPost._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;