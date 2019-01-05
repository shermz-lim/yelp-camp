var mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment   = require("./models/comment");

var data = 
[
{ name : "Mountain Side ", location : "California", img : "https://images.unsplash.com/photo-1465418138967-67a3d24f8085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80", description : "Bacon ipsum dolor amet alcatra tail andouille doner cow corned beef shoulder pork venison. Brisket alcatra chicken, capicola beef fatback kielbasa short loin ham hock. Ground round filet mignon tail fatback. Short ribs ham leberkas pork cupim buffalo hamburger turducken capicola ball tip andouille fatback filet mignon tenderloin shank. Biltong swine pork, venison jowl bacon burgdoggen brisket flank shank t-bone ball tip. Shank burgdoggen ball tip tongue pig, capicola t-bone jerky."},
{ name : "Park", location : "Amazon", img : "https://images.unsplash.com/photo-1465158753229-aa725fff85a1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1352&q=80", description : "Bacon ipsum dolor amet alcatra tail andouille doner cow corned beef shoulder pork venison. Brisket alcatra chicken, capicola beef fatback kielbasa short loin ham hock. Ground round filet mignon tail fatback. Short ribs ham leberkas pork cupim buffalo hamburger turducken capicola ball tip andouille fatback filet mignon tenderloin shank. Biltong swine pork, venison jowl bacon burgdoggen brisket flank shank t-bone ball tip. Shank burgdoggen ball tip tongue pig, capicola t-bone jerky."},
{ name : "Jungle", location : "Beach Land", img : "https://images.unsplash.com/photo-1467357689433-255655dbce4d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1956&q=80", description :"Bacon ipsum dolor amet alcatra tail andouille doner cow corned beef shoulder pork venison. Brisket alcatra chicken, capicola beef fatback kielbasa short loin ham hock. Ground round filet mignon tail fatback. Short ribs ham leberkas pork cupim buffalo hamburger turducken capicola ball tip andouille fatback filet mignon tenderloin shank. Biltong swine pork, venison jowl bacon burgdoggen brisket flank shank t-bone ball tip. Shank burgdoggen ball tip tongue pig, capicola t-bone jerky."},
{ name : "River Safari", location : "Mandai", img : "https://images.unsplash.com/photo-1532690913001-11d5e03af4a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80", description : "Bacon ipsum dolor amet alcatra tail andouille doner cow corned beef shoulder pork venison. Brisket alcatra chicken, capicola beef fatback kielbasa short loin ham hock. Ground round filet mignon tail fatback. Short ribs ham leberkas pork cupim buffalo hamburger turducken capicola ball tip andouille fatback filet mignon tenderloin shank. Biltong swine pork, venison jowl bacon burgdoggen brisket flank shank t-bone ball tip. Shank burgdoggen ball tip tongue pig, capicola t-bone jerky."},
{ name : "Flowers", location : "Garden Park", img : "https://images.unsplash.com/photo-1455158967412-bad272ceee73?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80", description : "Bacon ipsum dolor amet alcatra tail andouille doner cow corned beef shoulder pork venison. Brisket alcatra chicken, capicola beef fatback kielbasa short loin ham hock. Ground round filet mignon tail fatback. Short ribs ham leberkas pork cupim buffalo hamburger turducken capicola ball tip andouille fatback filet mignon tenderloin shank. Biltong swine pork, venison jowl bacon burgdoggen brisket flank shank t-bone ball tip. Shank burgdoggen ball tip tongue pig, capicola t-bone jerky."},
{ name : "Food Paradise", location : "Riverside", img : "https://images.unsplash.com/photo-1474984815137-e129646c7c9a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80", description : "Bacon ipsum dolor amet alcatra tail andouille doner cow corned beef shoulder pork venison. Brisket alcatra chicken, capicola beef fatback kielbasa short loin ham hock. Ground round filet mignon tail fatback. Short ribs ham leberkas pork cupim buffalo hamburger turducken capicola ball tip andouille fatback filet mignon tenderloin shank. Biltong swine pork, venison jowl bacon burgdoggen brisket flank shank t-bone ball tip. Shank burgdoggen ball tip tongue pig, capicola t-bone jerky."}
]

function seedDB(){
   Campground.remove({}, function(err){
       if (err) {
           console.log(err);
       } else {
           console.log("Campgrounds removed.")
           Comment.remove({}, function(err){
               if (err) {
                   console.log(err);
               } else {
                   console.log("Comments removed.");
                   data.forEach(function(seed){
                       Campground.create(seed, function(err, newCampground){
                           if (err) {
                               console.log(err)
                           } else {
                               console.log("Campground added!")
                               Comment.create({
                                   text: "Wow this place is so awesome!",
                                   author: "Sherman Lim"
                               }, function(err, comment){
                                   if (err) {
                                       console.log(err)
                                   } else {
                                       console.log("Comment created!")
                                       newCampground.comments.push(comment);
                                       newCampground.save(function(err, data){
                                           if (err) {
                                               console.log(err);
                                           } else {
                                               console.log("Saved!");
                                               console.log(data);
                                           };
                                       });
                                   };
                               });
                           };
                       });
                   });
               };
           });
       };
   });
};





module.exports = seedDB;

