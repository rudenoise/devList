var lm = require('lms');

module.exports = function (content) {
    return lm(['html',
        ['head',
            ['title', 'devList'],
            //<link rel="stylesheet" type="text/css" href="theme.css">
            ['link', {
                rel: 'stylesheet',
                type: 'text/css',
                href: '/css/main.css'
            }]
        ],
        ['body', content]
    ]);
};
