/**
 * Created by veenadali on 4/5/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restSchema = new Schema({
    term: String, //search term inputted by user in search field
    location: String, //location inputted by user
    data: String //data retrieved from Yelp API call is saved in same format to ensure consistency
});

module.exports = mongoose.model('restaurant', restSchema); //don't forget to export