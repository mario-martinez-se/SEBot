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

    const attachment = (data) => ({
      "fallback": `${data.title}`,
      "color": "#36a64f",
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
      "ts": new Date().getTime()
    });

    // robot.adapter.client.web.chat.postMessage(res.message.room, "This is a message!", {as_user: true, unfurl_links: false, attachments: [test]});

    if (owner && repo && number) {
      rp({
        method: "GET",
        uri: `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`,
        headers: {
          "Authorization": `token ${GITHUB_TOKEN}`,
          "User-Agent": "SEBOT"
        }
      }).then(data => robot.adapter.client.web.chat.postMessage(res.message.room, "Hey! I found this Pull Request", {as_user: true, unfurl_links: false, attachments: [attachment(JSON.parse(data))]}))
    }
  });

};
