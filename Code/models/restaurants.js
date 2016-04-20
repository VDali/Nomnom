/**
 * Created by veenadali on 4/5/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restSchema = new Schema({
    term: String,
    location: String,
    data: String
});

module.exports = mongoose.model('restaurant', restSchema); //don't forget to export