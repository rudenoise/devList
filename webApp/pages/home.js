var container = require('./container.js');

module.exports = function (data) {
    return container([
        ['h1', 'We have ' + data.length + ' developers listed.'],
        ['ul', (function (devs) {
            var rtn = [], i = 0, l = devs.length;
            while (i < l) {
                rtn.push(['li',
                    ['a', {
                        href: '/dev/' + devs[i].login
                    }, devs[i].login]
                ]);
                i += 1;
            }
            return rtn;
        }(data))]
    ]);
};
