var express = require('express'),
    router = express.Router(),
    Campground = require('../models/campground.js'),
    User = require("../models/user.js"),
    middleware = require("../middleware")


// INDEX Show all campgrounds 
router.get("/", function(req, res){
    var match = null
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({"name": regex}, function(err, campgrounds){
            if (err) {
                console.log(err);
                req.flash("error", "Error searching for campgrounds. Please try again.")
                res.redirect("/campgrounds")
            } else {
                if (campgrounds.length < 1) {
                    match = "There are no campgrounds with that name."
                }
                res.render("campgrounds/index", {campgrounds: campgrounds, match: match})
            }
        })
    } else {
    match = "Viewing All Campgrounds"
    // Retrieving all campgrounds from database and storing it in var campgroundsArray
    Campground.find({}, function(err, retrieved_data){
        if (err) {
            console.log("Something went wrong with retrieving campground from database.");
        } else {
            res.render('campgrounds/index', {campgrounds: retrieved_data, match: match}); 
        };
    });
    }
});

// NEW Form for creating new campground 
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

// CREATE Post route for adding new campground to database 
router.post("/", middleware.isLoggedIn, function(req, res){
    var new_campground = {name: req.body["name"], price: String(req.body["price"]), location: req.body["location"], img: req.body["image-url"], description: req.body["description"]};
    // Creating new campground instance and storing in database
    Campground.create(new_campground, function(err, new_data){
        if (err) {
            console.log(err);
            req.flash("error", "Campground not created successfully.");
            res.redirect("/campgrounds")
        }  else {
            new_data.author.id = req.user._id;
            new_data.author.username = req.user.username;
            new_data.save(function(err, campground){
                if (err) {
                    console.log(err);
                    req.flash("error", "You cannot create a campground.");
                    res.redirect("/campgrounds")
                } else {
                    req.flash("success", "Campground created successfully.")
                    res.redirect("/campgrounds");
                };
            });
        };      
    });
}); 

// SHOW page for campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if (err || !foundCampground) {
            console.log(err);
            req.flash("error", "Campground does not exist.")
            res.redirect("/campgrounds")
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        };
    });
});

// EDIT route: page to edit campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err);
            req.flash("error", "You cannot edit the campground.")
            res.redirect("/campgrounds/" + req.params.id)
        } else {
            res.render("campgrounds/edit", {campground: campground})
        }
    })
})

// UPDATE route: updates campground in db
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    var campground = req.body.campground;
    Campground.findByIdAndUpdate(req.params.id, campground, function(err, campground){
        if (err) {
            console.log(err);
            req.flash("error", "Failed to edit campground.")
        } else {
            req.flash("success", "Campground updated successfully.")
            res.redirect("/campgrounds/" + req.params.id)
        };
    });
});

// DELETE route: deletes campground 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            console.log(err);
            req.flash("error", "Failed to delete campground.")
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted successfully.")
            res.redirect("/campgrounds");
        };
    });
});

// fuzzy search REGEX
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;

