var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NomNom' });
});

// Request API access: http://www.yelp.com/developers/getting_started/api_access
router.post('/',function(req,res) {
  var Yelp = require('yelp');

  var yelp = new Yelp({
    consumer_key: 'hJgRm9Q_D4gP23TXRJclCQ',
    consumer_secret: 'd-lZbjjHFOQ_L406KVy5uUOcgGQ',
    token: 'vRpKS3MAec5o6_p0QLqeDVDni5xlufS0',
    token_secret: 'H84Kky-s3iPJs_v-x2PIl4qoQAQ',
  });

  // See http://www.yelp.com/developers/documentation/v2/search_api
  yelp.search({ term: 'Restaurants', location: 'Boston' })
    .then(function (data) {
      res.send(data);
    })
    .catch(function (err) {
      res.send(err);
    });
});

module.exports = router;