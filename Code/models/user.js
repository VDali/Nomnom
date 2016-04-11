/**
 * Created by veenadali on 4/11/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var restSchema = new Schema({
    name: String,
    id: String,
    password: String
});

module.exports = mongoose.model('user', restSchema); //don't forget to export