var https = require('https'),
    doneRE = new RegExp('first'),
    MongoClient = require('mongodb').MongoClient,
    format = require('util').format,
    developers = [];

function inspectHeaders(headers, nextPage) {
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
            getDeveloperData(inspectHeaders, collectData, nextPage);
        }, (reset - now) * 1000);
    } else {
        if (doneRE.test(headers.link.split(',')[0])) {
            allDone();
        } else {
            getDeveloperData(inspectHeaders, collectData, nextPage);
        }
    }

}

function collectData(data) {
    var l = data.items.length;
    developers = developers.concat(data.items);
    console.log('developers this payload: ', data.items.length);
    console.log('developers so far: ', developers.length);
}

function allDone() {
    console.log("FINNISHED!!!");
    console.log("Do mongo..");
    MongoClient.connect('mongodb://127.0.0.1:27017/developers', function(err, db) {
        if(err) {
            throw err;
        }
        var collection = db.collection('bristol'),
            total = developers.length,
            l = total - 1;
        while (l >= 0) {
            collection.update(
                {login: developers[l].login},
                developers[l],
                {upsert: true},
                function (err, docs) {
                    if (err) {
                        throw err;
                    }
                    total = total - 1;
                    if (total === 0) {
                        collection.count(function(err, count) {
                            console.log(format("%s records added/updated", count));
                            db.close();
                        });
                    }

                }
            );
            l = l - 1;
        }
    });
}

function getDeveloperData(
    inspectHeadersCB,
    collectDataCB,
    page
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
            inspectHeadersCB(res.headers, page + 1);
            collectDataCB(
                JSON.parse(buffer.join(''))
            );
        });

    }).on('error', function(e) {
        console.error(e);
    });


}

getDeveloperData(inspectHeaders, collectData, 1);
