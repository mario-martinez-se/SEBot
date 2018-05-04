const rp = require('request-promise');
require('dotenv').config();
const commons = require('../commons');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
module.exports = (robot) => {

  const regexGeneral = /https:\/\/github.com\/([^\/]*)\/([^\/]*)\/pull\/(\d+)\/?/g;
  const regex = /https:\/\/github.com\/([^\/]*)\/([^\/]*)\/pull\/(\d+)\/?/;
  robot.hear(regexGeneral, [], (res)=> {

    commons.filterByExpirity(res.match, res.message.room,  robot.brain.get(`SILENT_FOR:${res.message.room}`) || commons.DEFAULT_MUTE_PERIOD)
      .then(urls => urls.map(url => regex.exec(url)))
      .then(matches => matches.map (m => ({owner: m[1], repo: m[2], number: m[3]})))
      .then(data => data.filter(elem => elem.owner && elem.repo && elem.number))
      .then(urlData => Promise.all(urlData.map(d => rp(githubRequest(d)))))
      .then(values => values.length > 0 ? robot.adapter.client.web.chat.postMessage(res.message.room, message(values), {as_user: true, unfurl_links: false, attachments: attachments(values)}): null)
  });
};

const githubRequest = (data) => ({
  method: "GET",
  uri: `https://api.github.com/repos/${data.owner}/${data.repo}/pulls/${data.number}`,
  headers: {
    "Authorization": `token ${GITHUB_TOKEN}`,
    "User-Agent": "SEBOT"
  }
});

const getColour = (state) => {
  switch (state) {
    case 'open':
      return '#2cbe4e';
      break;
    case 'closed':
      return "#6f42c1";
      break;
    default:
      return "#a3a3a3"
  }
};

const message = (responses) => `Hey! Are you talking about ${responses.length < 2 ? 'this' : 'these'} Pull Request${responses.length < 2 ? '' : 's'}: ${responses.map(response => JSON.parse(response).number).join(', ')}?`;

const attachments = (responses) => responses.map(response => attachment(JSON.parse(response)));

const attachment = (data) => ({
  "fallback": `${data.title}`,
  "color": getColour(data.state),
  "author_name": `${data.user.login}`,
  "author_link": `${data.user.html_url}`,
  "author_icon": `${data.user.avatar_url}`,
  "title": `${data.title}`,
  "title_link": `${data.html_url}`,
  "text": `${data.body}`,
  "fields": [
    {
      "title": "Status",
      "value": `${data.state}`,
      "short": true
    },
    {
      "title": "Lines changed",
      "value": `+${data.additions} -${data.deletions}`,
      "short": true
    }
  ],
  "thumb_url": "https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png",
  "ts": Date.parse(data.created_at)/1000
});
