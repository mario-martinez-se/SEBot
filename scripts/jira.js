const rp = require('request-promise');
const encode = require('nodejs-base64-encode');
require('dotenv').config();

const JIRA_TOKEN = process.env.JIRA_TOKEN;
const JIRA_USERNAME = process.env.JIRA_USERNAME;

module.exports = (robot) => {
  const regex = /DEV-\d+/g;
  robot.hear(regex, [], (res)=> {

    Promise.all(
      res.match.map(issueId => rp(jiraRequest(issueId)))
    )
    .then(values => robot.adapter.client.web.chat.postMessage(res.message.room, message(values), {as_user: true, unfurl_links: false, attachments: attachments(values)}));

  });
};


const jiraRequest = (issueId) => ({
  method: "GET",
  uri: `https://secretescapes.atlassian.net/rest/api/2/issue/${issueId}?fields=summary,assignee`,
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
  "color": "#2cbe4e",
  "author_name": `${data.fields.assignee.displayName}`,
  // "author_link": `${data.user.html_url}`,
  "author_icon": `${data.fields.assignee.avatarUrls["16x16"]}`,
  // "title_link": `${data.html_url}`,
  "text": `${data.fields.description}`,
  // "fields": [
  //   {
  //     "title": "Status",
  //     "value": `${data.state}`,
  //     "short": true
  //   },
  //   {
  //     "title": "Lines changed",
  //     "value": `+${data.additions} -${data.deletions}`,
  //     "short": true
  //   }
  // ],
  "thumb_url": "https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png",
  "ts": Date.parse(data.created_at)/1000
});
