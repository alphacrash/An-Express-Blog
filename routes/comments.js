var express = require("express");
var router = express.Router({ mergeParams: true });
var Post = require("../models/post");
var Comment = require("../models/comment");
var middlewareObj = require("../middleware"); 

router.get("/new", middlewareObj.isLoggedIn, function (req, res) {
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

// Edit
router.get("/:comment_id/edit", middlewareObj.checkCommentOwnership, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { post_id: req.params.id, comment: foundComment });
        }
    });
});

router.put("/:comment_id", middlewareObj.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middlewareObj.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("back");
        }
    })
});

module.exports = router;