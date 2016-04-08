/**
 * Created by veenadali on 4/5/16.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nomnom');

mongoose.connection.on('open', function () {
    console.log('Connected to mongo server.');
});

mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
<<<<<<< HEAD
});
=======
});
>>>>>>> master
