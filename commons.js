const {promisify} = require('util');
const client = require('redis').createClient(process.env.REDISCLOUD_URL);
const mgetAsync = promisify(client.mget).bind(client);
const _ = require("underscore");

module.exports = {
  filterByExpirity: (allKeys, channel, brain) =>
  mgetAsync(allKeys.map(key => `${key}:${channel}`))
  .then(values => _.zip(allKeys, values))
  .then(pairs => pairs.filter(pair => pair[1] == null).map(pair => pair[0]))
  .then(keys => {
    keys.map(key => client.set(`${key}:${channel}`, "OK", "EX", brain.get(`SILENT_FOR:${channel}`)||this.DEFAULT_MUTE_PERIOD));
    return keys;
  }),
  getMutePeriod: (brain) => brain.get(`SILENT_FOR:${channel}`)||this.DEFAULT_MUTE_PERIOD,
  DEFAULT_MUTE_PERIOD: 30
};
