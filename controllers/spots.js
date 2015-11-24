// Require resource's model(s).
var User = require("../models/user");

//Show Results from Search Function (finding tags embedded in spots and returning those spots to view)
var index = function (req, res, next) {

  User.find({}, function(error, users){
    var tagSearch = 'cat'; //route our search parameters to here
    var spots = [];
    users.forEach(function(user) {
      spots = spots.concat(user.spots);
    });
    spots = spots.filter(function(spot) {
      var found = false;
      spot.tags.forEach(function(tag) {
        if (tag.tag_name === tagSearch) found = true;
      });
      return found;
    });
    res.render('spots/index', {spots: spots});
  });
};

var show = function(req, res, next) {
  User.find({"spots._id":req.params.id}, function(err,spot){
    var spot = spot[0].spots.filter(function(s){
      return s._id == req.params.id;
    });
      res.render('spots/show', {spot: spot});
  }).select('spots');
};

var create = function(req, res, next) {
  console.log('got to POST');
  User.findById("5653e1e953d4e09f25b9a37f", function(err, user){
  console.log(user.name);
    user.spots.push({
      title: "Kihei Boat Launch",
      description: "A place for photos",
      image_url: "https://farm6.staticflickr.com/5466/7059902227_bdea03c7a9_k.jpg",
      address: "Kihei, HI",
      rating: 4,
      tags:[{tag_name:"beach"},{tag_name:"nature"}]
    });
    user.save(function(err) {
      res.render('spots/new');
    });
  });
};

module.exports = {
  index: index,
  show: show,
  create: create
}
