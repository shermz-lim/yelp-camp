var express = require('express'),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground.js"),
    Comment = require("../models/comment.js"),
    User = require("../models/user.js"),
    middleware = require("../middleware")


// ============================
//       COMMENTS ROUTES
// ============================

// NEW
router.get("/new", middleware.isLoggedIn, middleware.checkUserReviewed, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if (!campground || err) {
            console.log(err);
            req.flash("error", "Comment does not exist anymore.")
            res.redirect("/campgrounds/" + req.params.id)
        } else {
            res.render("comments/new", {campground:campground});
        }
    })
});

// CREATE
router.post("/", middleware.isLoggedIn, middleware.checkUserReviewed, function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (!foundCampground || err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, newComment){
                if (!newComment || err) {
                    console.log(err);
                    req.flash('error', 'Fail to create comment.')
                    res.redirect("/campgrounds/" + req.params.id)
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    foundCampground.comments.push(newComment);
                    foundCampground.rating = calculateAverage(foundCampground.comments)
                    foundCampground.save(function(err){
                        if (err) {
                            console.log(err);
                            req.flash('error', 'Fail to create comment.')
                            res.redirect("/campgrounds/" + req.params.id)
                        } else {
                            req.flash("success", "Comment created.")
                            res.redirect("/campgrounds/" + req.params.id)
                        }
                    })
                }
            })
        }
    })
});

// EDIT 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (!campground || err) {
            console.log(err);
            req.flash("Campground does not exist anymore.");
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            Comment.findById(req.params.comment_id, function(err, comment){
                if (!comment || err) {
                    console.log(err);
                    req.flash("error", "Comment does not exist anymore.")
                    res.redirect("back");
                } else {
                    res.render("comments/edit", {comment:comment, campground:campground});
                };
            });
        };
    });
});

// UPDATE route 
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if (!comment || err) {
            console.log(err);
            req.flash('error', 'Fail to create comment.')
            res.redirect("back")
        } else {
            Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
                if (!campground || err) {
                    console.log(err);
                    req.flash("error", "Fail to update campground's rating.")
                    res.redirect("/campgrounds")
                } else {
                    campground.rating = calculateAverage(campground.comments)
                    campground.save()
                    req.flash("success", "Comment updated.")
                    res.redirect("/campgrounds/" + req.params.id);
                }
            })
        };
    });
});

// DELETE route 
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            console.log(err);
            req.flash('error', 'Fail to delete comment.')
            res.redirect("back")
        } else {
            Campground.findByIdAndUpdate(req.params.id, {$pull: {comments: req.params.comment_id}}, {new: true}).populate("comments").exec(function (err, campground) {
                if (err) {
                    console.log(err);
                    req.flash("error", "An error occured.");
                    res.redirect("back");
                } else {
                    campground.rating = calculateAverage(campground.comments)
                    campground.save()
                    req.flash("success", "Comment deleted successfully.")
                    res.redirect("/campgrounds/" + req.params.id);
                };
            });
        };
    });
});


// function for calculating campground's average rating 
function calculateAverage(comments) {
    if (comments.length === 0) {
        return 0;
    }
    var sum = 0;
    comments.forEach(function (element) {
        sum += element.rating;
    });
    return sum / comments.length;
}


module.exports = router;