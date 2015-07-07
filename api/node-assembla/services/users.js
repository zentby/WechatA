var logger = require("bole")('assembla-users');

(function() {
    var _ = require('lodash');

    var Users = function(Inherits, config) {
        this.config = config;

        Inherits(this);

        var fields = [
            'id', 'name', 'login',
            'phone', 'organization', 'im'
        ];

        this.user = function(callback) {
            logger.debug('getting user...');
            this.createCall('GET', 'user', callback)(this.config);
        };

        this.userById = function(userid, callback) {
            logger.debug('getting user by id...');
            this.createCall('GET', 'user/' + userid, callback)(this.config);
        };

        return this;
    }.bind(this);

    module.exports = Users;
}).call(this);