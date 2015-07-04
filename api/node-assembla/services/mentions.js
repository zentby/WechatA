
(function() {
    var _ = require('lodash');

    var Mentions = function(Inherits, config) {
        this.config = config;

        Inherits(this);

        var fields = [
            'id', 'author_id', 'link',
            'message', 'read', 'created_at'
        ];

        this.mentions = function(callback) {
            this.createCall('GET', 'user/mentions', callback)(this.config);
        };

        this.mark = function(id, callback) {
            this.createCall('PUT', 'user/mention/' + id + '/mark_as_read', callback)(this.config);
        };

        return this;
    }.bind(this);

    module.exports = Mentions;
}).call(this);
