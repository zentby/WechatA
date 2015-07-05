(function() {
    var _ = require('lodash');

    var Tickets = function(Inherits, config) {
        this.config = config;

        Inherits(this);

        var fields = [
            'id', 'number', 'custom_fields',
            'total_estimate', 'priority', 'component_id',
            'story_importance', 'space_id', 'reporter_id',
            'milestone_id', 'status', 'is_story',
            'notification_list', 'permission_type', 'description',
            'completed_date', 'importance', 'created_on',
            'total_invested_hours', 'updated_at', 'summary',
            'total_working_hours', 'estimate', 'assigned_to_id',
            'status_name', 'working_hours'
        ];

        this.assigned = function(space_id, callback) {
            this.createCall('GET', 'spaces/' + space_id + '/tickets/my_active', callback)(this.config);
        };

        this.followed = function(space_id, callback) {
            this.createCall('GET', 'spaces/' + space_id + '/tickets/my_followed', callback)(this.config);
        };

        this.ticket = function(space_id, number, callback) {
            this.createCall('GET', 'spaces/' + space_id + '/tickets/' + number, callback)(this.config);
        };

        this.comments = function(space_id, number, callback) {
            this.createCall('GET', 'spaces/' + space_id + '/tickets/' + number + '/ticket_comments', callback)(this.config);
        };


        return this;
    }.bind(this);

    module.exports = Tickets;
}).call(this);