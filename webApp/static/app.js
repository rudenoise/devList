$(function () {
    console.log('!!!');
    var Dev = Backbone.Model.extend({
        urlRoot: '/dev/:login',
        defaults: {
            login: 'Empty user...',
            avatar_url: 'img/placeHolder.jpg',
            availableForHire: null
        },
        checkAvailable: function () {
            console.log('check goes here');
            this.save({availableForHire: true});
        }
    });
    var AppView = Backbone.View.extend({
        el: $('#app'),
        initialize: function () {
            console.log('----initialize');
            this.listenTo(this.model, "change", this.render);
            this.model.checkAvailable();
            this.render();
        },
        render: function () {
            console.log('----render', this.model);
            this.$el.html('<button>' + this.model.toJSON() + '</button>');
        }

    });
    var App = new AppView({model: (new Dev({login: 'rudenoise'}))});
});
