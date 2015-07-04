
(function() {
    var _ = require('lodash');

    var Spaces = function(Inherits, config) {
        this.config = config;

        Inherits(this);

        var fields = [
            'id', 'name', 'login',
            'phone', 'organization', 'im'
        ];

        this.spaces = function(callback) {
            this.createCall('GET', 'spaces', callback)(this.config);
        };

        this.space = function(space_id, callback) {
            this.createCall('GET', 'spaces/' + space_id , callback)(this.config);
        };

        return this;
    }.bind(this);

    module.exports = Spaces;
}).call(this);
