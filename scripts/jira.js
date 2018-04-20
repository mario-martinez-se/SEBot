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
    .then(values => res.send(`${values}`));

  });
};


const jiraRequest = (issueId) => ({
  method: "GET",
  uri: `https://secretescapes.atlassian.net/rest/api/2/issue/${issueId}?fields=summary`,
  headers: {
    "Authorization": `Basic ${encode.encode(JIRA_USERNAME+":"+JIRA_TOKEN), 'base64'}`,
    "User-Agent": "SEBOT",
    "Content-Type": "application/json"
  }
});
