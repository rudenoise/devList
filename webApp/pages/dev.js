var container = require('./container.js');

module.exports = function (data) {
    return container([
        ['h1', data.login],
        ['img', { src: data.avatar_url }]
    ]);
};
