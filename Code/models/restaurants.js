/**
 * Created by veenadali on 4/5/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restSchema = new Schema({
    name: String,
    location: String,
    data : String
});

mongoose.model('restaurant', restSchema);