var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var database = require('../config/database');
var Restaurant = require('../models/restaurants');

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

function getFactual(id, country, factual) {
    var Factual = require('factual-api');
    var factual = new Factual('LSCM3IwVY4QaENnrM4tIsHXQodwp3ROQaJ0zADjX', 'Rcw2Z89qHfZBmKYQjEuBoyvHsAUKtk0ZvvayjDqT');
    if (country === "us" || country === "fr" || country === "gb" || country === "de" || country === "au") {
        var database = '/t/restaurants-' + country;
        var cross = '/t/crosswalk?filters={"url": "http://www.yelp.com/biz/' + id + '"}';
        factual.get(cross)
            .then(function (result) {
                //console.log(res.data[0]);
                factual.get(database, {filters: {"factual_id": result.data[0].factual_id}})
                    .then(function (res) {
                        //console.log("result: ", res.data[0]);
                        $(id).append(res.data[0]);
                    })
                    .catch(function (err) {
                        console.log('error_factual_restaurants');
                    });
            })
            .catch(function (error) {
                console.log('error_factual_id');
            });
    }
}

function initGoogle(loc) {
    var GoogleMapsAPI = require('googlemaps');
    var publicConfig = {key: 'AIzaSyBOi5Nu5k9NCoyNLv2wjK-TvlDYu_33vc8'};
    var gmAPI = new GoogleMapsAPI(publicConfig);
    return gmAPI;
}
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

    //See if request is already in db
    //todo return results from db rather than hitting API
    Restaurant.find({term: term, location: loc}, function (err, result) {
        if (result.length > 0) {
            console.log('found ' + term + " in db");
        }
    });
    
    parameters['title'] = "NomNom";
    parameters['location'] = loc;
    parameters['term'] = term;
    var geocodeParams = {"address": loc};
    var gmAPI = initGoogle(loc);
    gmAPI.geocode(geocodeParams, function (err, result) {
        if (result) {
            parameters['google'] = result.results[0].geometry.location;
            yelp.search({term: term, location: loc, sort: '1', radius_filter: '1610'})
                .then(function (data) {
                    var s = JSON.stringify(data);
                    var obj = JSON.parse(s);
                    var yelpRes = obj.businesses;
                    var restaurant = new Restaurant();
                    parameters['result'] = yelpRes;
                    res.render('search', parameters);

                    restaurant.term = term;
                    restaurant.location = loc;
                    restaurant.data = s;

                    restaurant.save(function (err) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('saved')
                        }
                    });


                })
                .catch(function (err) {
                    console.log('error_yelp');
                    parameters['result'] = "None";
                    res.render('search', parameters);
                });
        }
    });

});

module.exports = router;