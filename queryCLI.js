var devDB = require('./devDB.js'),
    args = process.argv.slice(2);

function handleErr(err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
};

function handleResults(err, results) {
    handleErr(err);
    console.log(results);
    process.exit(0);

}

devDB(function (err, data) {
    'use strict';
    var action = args[0],
        dataArgs = args.slice(1);
    handleErr(err);
    if (action === 'addToUser') {
        data.addToUser(dataArgs[0], { updated: Date.now() }, handleResults);
    } else if (data.hasOwnProperty(action)){
        data[action].apply(null, dataArgs.concat([handleResults]));
    }
    //data.count(handleResults);
    //data.fetchAll(handleResults);
    //data.findByLogin("ichinaski", handleResults);
    //data.findByLoginLike('ichinaski', handleResults);
});
