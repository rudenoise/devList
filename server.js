var express = require('express'),
    app = express(),
    server,
    devDB = require('./devDB.js'),
    homeRender = require('./webApp/pages/home.js');
    devRender = require('./webApp/pages/dev.js');

devDB(function (err, data) {
    if (err) {
        //res.send('Error.</h1>');
    }

    app.use(express.static('./webApp/static'));
    app.use(express.bodyParser());
    
    app.get('/', function (req, res) {
        data.fetchAll(function (err, result) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.send(homeRender(result));
        });
    });

    app.get('/dev/:id', function (req, res) {
        var id = req.params.id;
        data.findById(id, function (err, result) {
            res.send(devRender(result));
        });

    });

    app.get('/api/dev/:id', function (req, res) {
        var id = req.params.id;
        data.findById(id, function (err, result) {
            res.send(JSON.stringify(result));
        });
    });

    app.put('/api/dev/:id', function (req, res) {
        var id = req.params.id;
        delete req.body._id;
        data.addToUser(req.body.login, req.body, function(err, result) {
            if (err) {
                res.send(400, err);
            }
            res.json(200, result);
        });

    });

    
    server = app.listen(3000, function () {
        console.log('listening on port %d', server.address().port);
    });
});

