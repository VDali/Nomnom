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
    var yelp = initYelp();
    var parameters = {};
    parameters['title'] = "NomNom";
    parameters['location'] = loc;
    parameters['term'] = term;
    yelp.search({term: term, location: loc, sort: '1'})
        .then(function (data) {
            var s = JSON.stringify(data);
            var obj = JSON.parse(s);
            var result = obj.businesses;
            parameters['result'] = result;
            res.render('search',parameters);
        })
        .catch(function (err) {
            console('error');
            parameters['result'] = "None";
            res.render('search',parameters);
        });
});

function initYelp() {
    var Yelp = require('yelp');

    var yelp = new Yelp({
        consumer_key: 'hJgRm9Q_D4gP23TXRJclCQ',
        consumer_secret: 'd-lZbjjHFOQ_L406KVy5uUOcgGQ',
        token: 'vRpKS3MAec5o6_p0QLqeDVDni5xlufS0',
        token_secret: 'H84Kky-s3iPJs_v-x2PIl4qoQAQ',
    });
    return yelp;
}

module.exports = router;