var express = require('express'),
    app = express(),
    server,
    devDB = require('devDB');

app.get('/', function (req, res) {
    devDB(function (err, data) {
        if (err) {
            res.send('Error.</h1>');
        } 
        data.count(function (err, result) {
            res.send('<h1>We have ' + result + ' developers listed.</h1>');
        });
    });
    
});

server = app.listen(3000, function () {
    console.log('listening on port %d', server.address().port);
});
