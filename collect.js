var https = require('https'),
    doneRE = new RegExp('first'),
    MongoClient = require('mongodb').MongoClient,
    format = require('util').format;

function inspectHeaders(headers, nextPage, mongoCollection) {
    var now = Number((Date.now() + '').slice(0, -3),
        remaining = Number(headers['x-ratelimit-remaining'])),
        reset = Number(headers['x-ratelimit-reset']);
    console.log("link: ", headers.link);
    console.log("ratelimit: ", headers.ratelimit);
    console.log("reset: ", reset);
    console.log("remaining: ", remaining);
    if (remaining === 1) {
        console.log('At request limit wait ' + (reset - now) + 'seconds');
        setTimeout(function () {
            getDeveloperData(inspectHeaders, collectData, nextPage, mongoCollection);
        }, (reset - now) * 1000);
    } else {
        if (doneRE.test(headers.link.split(',')[0])) {
            allDone();
        } else {
            getDeveloperData(inspectHeaders, collectData, nextPage, mongoCollection);
        }
    }

}

function collectData(data, mongoCollection) {
    var l = data.items.length, i = 0, dev;
    console.log('developers this payload', l);
    while (i < l) {
        dev = data.items[i];
        mongoCollection.insert(dev, function (err, docs) {
            if (err) {
                throw err;
            }
        
        });
        i += 1;
    }
    console.log('records added');
    mongoCollection.count(function(err, count) {
        console.log(format("count = %s", count));
    });
}

function allDone() {
    console.log("FINNISHED!!!");
}

function getDeveloperData(
    inspectHeadersCB,
    collectDataCB,
    page,
    mongoCollection
) {
    page = page || 1;
    var buffer = [],
        options = {
            hostname: 'api.github.com',
            port: 443,
            path: '/search/users?q=location:bristol,uk&page=' + page,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
            }
        };
    https.get(options, function(res) {
        console.log("statusCode: ", res.statusCode);
        res.on('data', function (d) {
            buffer.push(d);
        });
        res.on('end', function () {
            inspectHeadersCB(res.headers, page + 1, mongoCollection);
            collectDataCB(
                JSON.parse(buffer.join('')),
                mongoCollection
            );
        });

    }).on('error', function(e) {
        console.error(e);
    });


}

MongoClient.connect('mongodb://127.0.0.1:27017/developers', function(err, db) {
    if(err) {
        throw err;
    }
    var collection = db.collection('bristol');
    getDeveloperData(inspectHeaders, collectData, 1, collection);
});
