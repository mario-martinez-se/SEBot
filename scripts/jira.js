const rp = require('request-promise');
const encode = require('nodejs-base64-encode');
const {promisify} = require('util');
const client = require('redis').createClient(process.env.REDISCLOUD_URL);
const mgetAsync = promisify(client.mget).bind(client);
const _ = require("underscore");

require('dotenv').config();

const JIRA_TOKEN = process.env.JIRA_TOKEN;
const JIRA_USERNAME = process.env.JIRA_USERNAME;
const MUTE_PERIOD_IN_SECS = 30;

module.exports = (robot) => {
  const regex = /DEV-\d+/g;
  robot.hear(regex, [], (res)=> {

    filterByExpirity(res.match)
      .then(issueIds => Promise.all(issueIds.map(issueId => rp(jiraRequest(issueId)))))
      .then(values => values.length > 0 ? robot.adapter.client.web.chat.postMessage(res.message.room, message(values), {as_user: true, unfurl_links: false, attachments: attachments(values)}) : null);
  });
};

const filterByExpirity = (allKeys) => mgetAsync(allKeys.map(key => `${key}:${res.message.room}`))
//Match keys with issueIds [[DEV-123, null],[DEV-456, "OK"]]
  .then(values => _.zip(allKeys, values))
  //Get issueIds that have no key in redis [DEV-123]
  .then(pairs => pairs.filter(pair => pair[1] == null).map(pair => pair[0]))
  .then(keys => {
    //Store new key in redis with expirity
    keys.map(key => client.set(`${key}:${res.message.room}`, "OK", "EX", MUTE_PERIOD_IN_SECS));
    return keys;
  });

const jiraRequest = (issueId) => ({
  method: "GET",
  uri: `https://secretescapes.atlassian.net/rest/api/2/issue/${issueId}?fields=summary,assignee,description,created,status,issuetype,aggregateprogress`,
  headers: {
    "Authorization": `Basic ${encode.encode(JIRA_USERNAME+":"+JIRA_TOKEN, 'base64')}`,
    "User-Agent": "SEBOT",
    "Content-Type": "application/json"
  }
});

const message = (responses) => `Hey! Are you talking about ${responses.length < 2 ? 'this' : 'these'} JIRA ticket${responses.length < 2 ? '' : 's'}: ${responses.map(response => JSON.parse(response).key).join(', ')}?`;

const attachments = (responses) => responses.map(response => attachment(JSON.parse(response)));

const attachment = (data) => ({
  "fallback": `${data.fields.summary}`,
  "title": `${data.fields.summary}`,
  "color": getColour(data.fields.status.statusCategory.colorName),
  "author_name": `${data.fields.assignee ? data.fields.assignee.displayName : 'Unassigned'}`,
  // Avatar url is protected :(
  // "author_icon": `${data.fields.assignee ? data.fields.assignee.avatarUrls["16x16"]: ''}`,
  "title_link": `${convertApiUrl(data.self, data.key)}`,
  "text": `${data.fields.description}`,
  "fields": [
    {
      "title": "Status",
      "value": `${data.fields.status.name}`,
      "short": true
    },
    {
      "title": "Type",
      "value": `${data.fields.issuetype.name}`,
      "short": true
    },
    data.fields.aggregateprogress.total > 0 ? {
      "title": "Progress",
      "value": `Remaining ${(data.fields.aggregateprogress.total - data.fields.aggregateprogress.progress)/60/60} hours of ${data.fields.aggregateprogress.total/60/60} hours`,
      "short": true} : {}
  ],
  "thumb_url": "https://luna1.co/5ad265.png",
  "ts": Date.parse(data.fields.created)/1000
});

const convertApiUrl = (url, key) => url.replace(/\/rest\/api\/2\/issue\/(?:\d)+(?:\/)?/, `/browse/${key}`);

const getColour = (stringColor) => {
  switch(stringColor) {
    case 'blue-gray':
      return "#687681";
      break;
    case 'yellow':
      return "#F7DC6F";
      break;
    case 'green':
      return "#2ECC71";
      break;
    default:
      return "#D3D3D3";
  }
};
