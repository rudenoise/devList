$(function () {
    
    function renderAvailable(d) {
        return !d.hasOwnProperty('hireable') ?
            ['button', 'check availability'] :
            d.hireable === true ?
                ['h2', 'This developer is available for hire.'] :
                ['h2', 'This developer is off limits.']
    }

    var Dev = Backbone.Model.extend({
        urlRoot: '/api/dev/',
        defaults: {},
        initialize: function (arguments) {
            this.fetch();
        }
    });

    var AppView = Backbone.View.extend({
        el: $('#app'),
        initialize: function () {
            this.listenTo(this.model, "change", this.render);
            this.render();
        },
        render: function () {
            this.$el.html(lms(renderAvailable(this.model.toJSON())));
        },
        events: {
            'click button': 'getMoreData'
        },
        getMoreData: function () {
            console.log();
            var that = this;
            jph('https://api.github.com/users/', true)(
                [this.model.get('login')],
                function (d) {
                    that.model.save(d.data);
                },
                function () {
                    console.log('error');
                }
            );
        }

    });

    var App = new AppView({
        model: (new Dev({
            id: _.findLast(window.location.href.split('/'))
        }))
    });
});
