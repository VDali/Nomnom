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
    yelp.search({term: term, location: loc, sort: '1'})
        .then(function (data) {
            var s = JSON.stringify(data);
            var obj = JSON.parse(s);
            var result = obj.businesses;
            res.render('search', { title: 'NomNom', result: result, term: term, location: loc});
        })
        .catch(function (err) {
            res.render('search', { title: 'NomNom', result: "None", term: term, location: loc});
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

function searchYelp(term, loc, yelp) {
    // See http://www.yelp.com/developers/documentation/v2/search_api
    yelp.search({term: term, location: loc, sort: '1'})
        .then(function (data) {
            var s = JSON.stringify(data);
            var obj = JSON.parse(s);
            var result = obj['businesses'];
            for (var i =0; i < result.length; i++) {
                result[i].mobile_url = res[i].mobile_url.substring(0, result[i].mobile_url.indexOf("?"));
                result[i].url = result[i].url.substring(0, result[i].url.indexOf("?"));
                for (var j = 0; j < result[i].categories.length; j++) {
                    result[i].categories[j].splice(0,1);
                }
            }
            console.log(result[0]);
            res.render('index', { title: 'NomNom', resultName: "" });
        })
        .catch(function (err) {
            res.render('index', { title: 'NomNom', resultName: "" });
        });
}

module.exports = router;