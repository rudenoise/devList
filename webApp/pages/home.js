var container = require('./container.js');

module.exports = function (data) {
    return container([
        ['h1', 'We have ' + data.length + ' developers listed.'],
        ['ul', (function (devs) {
            var rtn = [], i = 0, l = devs.length, dev;
            while (i < l) {
                dev = devs[i];
                rtn.push(['li',
                    ['a', {
                        href: '/dev/' + dev.id
                    }, dev.login],
                    !dev.hasOwnProperty('hireable') ?
                        [] :
                        dev.hireable === true ?
                            ['em', {style: 'color: green'}, 'open to offers'] :
                            ['em', {style: 'color: red'}, 'staying put']
                ]);
                i += 1;
            }
            return rtn;
        }(data))]
    ]);
};
