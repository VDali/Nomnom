var express = require('express');
var router = express.Router();

/////////////////////////////////////////////



/////////////////////////////////////////////

/* GET home page. */
router.get('/', function(request, response, next) {
  response.render('index', { title: 'NomNom' });
});

// POST method route
router.post('/', function (req, resp) {
  var request = require("request");
  var apiResponse;
  var options = { method: 'GET',
    url: 'http://api.yelp.com/search/v2',
    qs: 
    { oauth_consumer_key: 'hJgRm9Q_D4gP23TXRJclCQ',
      oauth_token: 'vRpKS3MAec5o6_p0QLqeDVDni5xlufS0',
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: '1458523583',
      oauth_nonce: 'WIEaTt',
      oauth_version: '1.0',
      oauth_signature: 'amxZwLP5bCB3YoHwJCHxzk2uJ0M%3D' },
    headers: 
    { 'postman-token': '8ab2675f-8afa-2fdc-dec4-5d6229658117',
      'cache-control': 'no-cache' } };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    console.log(body);
    resp.json(body);
    apiResponse = response;

  });
//  resp.json(apiResponse);
});

module.exports = router;
