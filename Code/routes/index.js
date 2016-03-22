var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NomNom' });
});

// Request API access: http://www.yelp.com/developers/getting_started/api_access
router.post('/',function(req,res, next) {
    var term = req.body.term;
    var loc = req.body.location;
  var Yelp = require('yelp');

  var yelp = new Yelp({
    consumer_key: 'hJgRm9Q_D4gP23TXRJclCQ',
    consumer_secret: 'd-lZbjjHFOQ_L406KVy5uUOcgGQ',
    token: 'vRpKS3MAec5o6_p0QLqeDVDni5xlufS0',
    token_secret: 'H84Kky-s3iPJs_v-x2PIl4qoQAQ',
  });

  // See http://www.yelp.com/developers/documentation/v2/search_api
  yelp.search({ term: term, location: loc})
    .then(function (data) {
        var s = JSON.stringify(data);
        var obj = JSON.parse(s);
        var arrayLen = obj.businesses.length;
        res.write("Restaurant Name \t Rating \t Address \t Phone Number \t Open?\n");
        for (var i = 0; i < arrayLen; i++) {
            var temp = obj.businesses[i];
            res.write(temp.name +"\t");
            res.write(temp.rating + "\\5" +"\t");
            var tempaddr = temp.location.address;
            for (var j = 0; j < tempaddr.length; j++) {
                res.write(tempaddr[j]);
                if (j < (tempaddr.length - 1)) {
                    res.write(",");
                }
            }
            res.write("\t" + temp.display_phone);
            if (temp.is_closed == false){
                res.write("\tYes");
            } else {
                res.write("\tNo");
            }
            res.write("\n\n");
        }
        res.end()
    })
    .catch(function (err) {
      res.send(err);
    });
});

module.exports = router;