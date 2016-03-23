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
  yelp.search({ term: term, location: loc, sort: '1'})
    .then(function (data) {
        //res.send(data);
        var s = JSON.stringify(data);
        var obj = JSON.parse(s);
        var arrayLen = obj.businesses.length;
        res.write(term + " in " + loc +":\n");
        res.write("Name \t Rating \t Address \t Categories \t Phone\n");
        for (var i = 0; i < arrayLen; i++) {
            var busin = obj.businesses[i];
            if (busin.location.address != "") {
                res.write(busin.name + " \t ");
                res.write(busin.rating + "\\5 \t ");
                res.write(busin.location.address + ", ");
                res.write(busin.location.city + " \t ");
                //res.write(busin.categories[0][0]);
                for (var j = 0; j < busin.categories.length; j++) {
                    res.write(busin.categories[j][0]);
                    if (j < (busin.categories.length - 1)) {
                        res.write(", ");
                    }
                }
                res.write(" \t ");
                res.write(busin.display_phone +" \t ");
                res.write("\n");
            }
        }
        res.end()
    })
    .catch(function (err) {
        res.send(err);
    });
});

module.exports = router;