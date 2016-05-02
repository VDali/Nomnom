//File needs database and restaurant model to it can connect to database

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var sanitizer = require('sanitizer');
var database = require('../config/database');
var Restaurant = require('../models/restaurants');

//creates yelp object with credentials
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

//creates factual object with credentials
function initFactual() {
    var Factual = require('factual-api');
    var factual = new Factual('LSCM3IwVY4QaENnrM4tIsHXQodwp3ROQaJ0zADjX', 'Rcw2Z89qHfZBmKYQjEuBoyvHsAUKtk0ZvvayjDqT');
    return factual;
}

//Not used; calls factual based on yelp id to fill in information
function getFactual(id, country) {
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

//creates google geocode object with credentials
function initGoogle(loc) {
    var GoogleMapsAPI = require('googlemaps');
    var publicConfig = {key: 'AIzaSyBOi5Nu5k9NCoyNLv2wjK-TvlDYu_33vc8'};
    var gmAPI = new GoogleMapsAPI(publicConfig);
    return gmAPI;
}
/* GET home page. */
router.get('/', function(req, res, next) {
    // if (typeof req.user != 'undefined') {
    //     console.log(req.user.name);
    // }
    //res.locals.user = req.user;
    res.render('index', { title: 'NomNom' });
});

// Request API access: http://www.yelp.com/developers/getting_started/api_access
router.post('/',function(req,res, next) {
    var term = sanitizer.sanitize(req.body.term);
    term = term.charAt(0).toUpperCase() + term.slice(1);
    if (term === "") {
        term = "Food"
    }
    var loc = sanitizer.sanitize(req.body.location);
    var yelp = initYelp(); //
    var parameters = {};
    var usedb;
    var found = 0; //used to determine if request is in database or not

    //to see if request is already in the database; Veena uses this later in the code too
    Restaurant.findOne({term: term, location: loc}, function (err, result) {
        if (result) {
            //console.log(result.data);
            usedb = result; //only saved to variable to use later cause result is used often
            found = 1; //changed to 1 if request is already in the database
            if (result.length > 0) {
                console.log('found ' + term + " in db");
            }
        }
    });

    parameters['title'] = "NomNom";
    parameters['location'] = loc; //puts location in return parameters for POST
    parameters['term'] = term; //puts term in return parameters for POST
    var geocodeParams = {"address": loc};
    var gmAPI = initGoogle(loc);
    gmAPI.geocode(geocodeParams, function(err, result) {
        if (result) { //if google result works
            parameters['google'] = result.results[0].geometry.location; //puts google location in return parameters for POST
            var lat = result.results[0].geometry.location.lat;
            var lng = result.results[0].geometry.location.lng;
            var coor = lat + ',' + lng;

            if (found == 0) { //NOT in database
                yelp.search({term: term, ll: coor, sort: '1', radius_filter: '1610', category_filter: 'restaurants'})
                    .then(function (data) {
                        var s = JSON.stringify(data);
                        var obj = JSON.parse(s);
                        var yelpRes = obj.businesses;
                        var restaurant = new Restaurant();
                        parameters['result'] = yelpRes; //puts yelp result in return parameters for POST
                        res.render('search', parameters);

                        restaurant.term = term;
                        restaurant.location = loc;
                        restaurant.data = s;

                        //saves request into restaurant database
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

            } else {  //found in database so prints from database instead of making API call
                var s = usedb.data;
                var obj = JSON.parse(s);
                var yelpRes = obj.businesses;

                console.log('printing from database');

                parameters['result'] = yelpRes;
                res.render('search', parameters);

                found = 0; //to prepare for next request
            }
        } else { 
            if (found == 0) { //NOT in database
                yelp.search({term: term, location: loc, sort: '1', radius_filter: '1610', category_filter: 'restaurants'})
                    .then(function (data) {
                        var s = JSON.stringify(data);
                        var obj = JSON.parse(s);
                        var yelpRes = obj.businesses;
                        parameters['result'] = yelpRes;
                        res.render('search', parameters);

                    })
                    .catch(function (err) {
                        console.log('error_yelp_no_google');
                        parameters['result'] = "None";
                        res.render('search', parameters);
                    });

            } else { //found in database
                var s = usedb.data;
                var obj = JSON.parse(s);
                var yelpRes = obj.businesses;

                console.log('printing from database');

                parameters['result'] = yelpRes;
                res.render('search', parameters);

                found = 0;
            }
        }
    });
});

module.exports = router;