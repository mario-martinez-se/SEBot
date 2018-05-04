const {promisify} = require('util');
const client = require('redis').createClient(process.env.REDISCLOUD_URL);
const mgetAsync = promisify(client.mget).bind(client);
const _ = require("underscore");

const MUTE_PERIOD_IN_SECS = 30;

module.exports = {
  filterByExpirity: (allKeys, appendix, mute_period) =>
  mgetAsync(allKeys.map(key => `${key}:${appendix}`))
  .then(values => _.zip(allKeys, values))
  .then(pairs => pairs.filter(pair => pair[1] == null).map(pair => pair[0]))
  .then(keys => {
    keys.map(key => client.set(`${key}:${appendix}`, "OK", "EX", mute_period));
    return keys;
  })
};
