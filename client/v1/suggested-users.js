var Request = require('./request');
var _ = require('lodash');
var Account = require('./account');

module.exports = function(session, userId) {
    return new Request(session)
        .setMethod('GET')
        .setResource('suggestedUsers', {
          target_id: userId
        })
        .send()
        .then(function(json) {
            return _.map(json.users, function(user) {
              return new Account(session, user)
            })
        })
};
