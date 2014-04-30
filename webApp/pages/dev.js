var container = require('./container.js');

module.exports = function (data) {
    return container([
        ['h1', data.login],
        ['img', { src: data.avatar_url.replace('avatars', 'avatars0') }],
        //['img', { src: '/img/placeHolder.jpg' }],
        ['div', { id: 'app'}],
        ['script', {
            type: 'text/javascript',
            src: '/lib/lms.js'
        }],
        ['script', {
            type: 'text/javascript',
            src: '/lib/jph.js'
        }],
        ['script', {
            type: 'text/javascript',
            src: '/lib/jquery.js'
        }],
        ['script', {
            type: 'text/javascript',
            src: '/lib/lodash.js'
        }],
        ['script', {
            type: 'text/javascript',
            src: '/lib/backbone.js'
        }],
        ['script', {
            type: 'text/javascript',
            src: '/app.js'
        }]
    ]);
};
