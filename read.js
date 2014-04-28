var MongoClient = require('mongodb').MongoClient,
    format = require('util').format;

MongoClient.connect('mongodb://127.0.0.1:27017/developers', function(err, db) {
    if(err) {
        throw err;
    }

    var brisDevs = db.collection('bristol');

    brisDevs.find().toArray(function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(data);
        db.close();
        process.exit(0);
    });
});
