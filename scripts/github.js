const rp = require('request-promise');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
module.exports = (robot) => {


  robot.hear(/hello/, [], (res)=>{
    // robot.adapter.client.web.chat.postMessage({ channel: res.message.room, text: 'Hello there', attachments: []});
    res.send("Hello to you!")
  });

  const regex = /https:\/\/github.com\/([^\/]*)\/([^\/]*)\/pull\/(\d+)\/?/g;
  robot.hear(regex, [], (res)=> {
    const match = regex.exec(res.match[0]);
    const owner = match[1];
    const  repo = match[2];
    const number = match[3];
    if (owner && repo && number) {
      rp({
        method: "GET",
        uri: `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`,
        headers: {
          "Authorization": `token ${GITHUB_TOKEN}`,
          "User-Agent": "SEBOT"
        }
      }).then(data => robot.adapter.client.web.chat.postMessage(res.message.room, message(data), {as_user: true, unfurl_links: false, attachments: [attachment(JSON.parse(data))]}))
    }
  });

};


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

const message = (data) => `Hey! I found this Pull Request (${data.number})`;

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
