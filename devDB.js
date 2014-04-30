var MongoClient = require('mongodb').MongoClient;

module.exports = function devDB(cb) {
    MongoClient.connect('mongodb://127.0.0.1:27017/developers', function(err, db) {
        if (err) {
            cb(err);
        }

        var brisDevs = db.collection('bristol');

        process.on('exit', function () {
            db.close();
        });
        
        cb(null, {
            fetchAll: function (cb) {
                brisDevs.find().sort({login: 1}).toArray(cb);
            },
            count: function (cb) {
                brisDevs.count(cb);
            },
            findByLogin: function (loginString, cb) {
                brisDevs.findOne({
                    login: loginString
                }, cb);
            },
            findById: function (id, cb) {
                brisDevs.findOne({
                    id: Number(id)
                }, cb);
            },
            findByLoginLike: function (loginLike, cb) {
                brisDevs.find({
                    login: new RegExp('.*' + loginLike + '.*')
                }).toArray(cb);
            },
            addToUser: function (loginString, newData, cb) {
                brisDevs.findAndModify({
                    login: loginString
                }, ['login', loginString], {
                    $set: newData
                }, {
                    new: true
                }, cb);
            }
        });
    });
}
