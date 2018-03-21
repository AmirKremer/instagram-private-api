var _ = require('lodash');
var util = require('util');
var FeedBase = require('./feed-base');

function TaggedFeed(session, accountId, limit) {
  this.session = session;
  this.accountId = accountId;
  this.limit = parseInt(limit) || null;
  FeedBase.apply(this, arguments);
}
util.inherits(TaggedFeed, FeedBase);

module.exports = TaggedFeed;
var Media = require('../media');
var Request = require('../request');

TaggedFeed.prototype.get = function () {
  var that = this;
  return new Request(that.session)
    .setMethod('GET')
    .setResource('taggedFeed', {
      id: that.accountId,
      maxId: that.getCursor()
    })
    .send()
    .then(function(data) {
      var nextMaxId = data.next_max_id ? data.next_max_id.toString() : data.next_max_id;
      that.moreAvailable = data.more_available && !!nextMaxId;
      if (that.moreAvailable)
        that.setCursor(nextMaxId);
      return _.map(data.items, function (medium) {
        return new Media(that.session, medium);
      });
    })
};
