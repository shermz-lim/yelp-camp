var express = require('express'),
    router = express.Router(),
    User = require("../models/user.js"),
    passport = require("passport")



// Landing page route
router.get("/", function(req, res){
    res.render('landing');        
});


// ============ AUTHENTICATION ===================
// SIGN UP
router.get("/signup", function(req, res) {
    res.render("signup");
});

router.post("/signup", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message)
            res.redirect("/signup")
        }  else  {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "You have signed up successfully. Welcome to YelpCamp, " + user.username)
                res.redirect("/campgrounds");
            })
        };
    });
});

// LOG IN 
router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
})

// LOG OUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have successfully logged out.")
    res.redirect("/campgrounds");
})



module.exports = router;