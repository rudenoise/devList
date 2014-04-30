var lm = require('lms');

module.exports = function (data) {
    return lm([
        ['h1', data.login],
        ['img', { src: data.avatar_url }]
    ]);
};
