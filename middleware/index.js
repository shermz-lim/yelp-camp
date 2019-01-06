var Comment = require("../models/comment.js"),
    Campground = require("../models/campground.js")
    
// Defining middleware object and including functions in it
var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("/login");
    };
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, comment) {
        if (err || !comment) {
            req.flash("error", "Comment does not exist anymore.");
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            if (comment.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash("error", "You do not have permission to do that.");
                res.redirect("/campgrounds/" + req.params.id);
            };
        };
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    };
};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {    
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, campground) {
        if (err || !campground) {
            console.log(err)
            req.flash("error", "Campground does not exist.");
            res.redirect("/campgrounds");
        } else {
            if (campground.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash("error", "You do not have permission to do that.");
                res.redirect("/campgrounds/" + req.params.id);
            };
        };
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    };
};

// Checks whether user has already left a review for that campground 
middlewareObj.checkUserReviewed = function (req, res, next) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground) {
        if (err || !campground) {
            console.log(err);
            req.flash("error", "Campground does not exist anymore.");
            res.redirect("/campgrounds");
        } else {
            campground.comments.forEach(function(comment){
                if (comment.author.id.equals(req.user._id)) {
                    req.flash("error", "You can only leave 1 review per campground.")
                    res.redirect("/campgrounds/" + req.params.id)
                }
            });
            return next();
        };
    });
};
    
module.exports = middlewareObj