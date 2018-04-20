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
    robot.emit('slack.attachment', {message: 'Hello!!!', content: {text: "Attachement text", fallback: "Attachment fallback", fields: [{title: "Field title", value: "Field Value"}]}})
    // robot.adapter.client.web.chat.postMessage({ channel: res.message.room, text: 'Hello there', attachments: []});
   /* const match = regex.exec(res.match[0]);
    const owner = match[1];
    const  repo = match[2];
    const number = match[3];

    const test = {
      "attachments": [
        {
          "fallback": "adding booking with flights to await payment job",
          "color": "#36a64f",
          "author_name": "Nelson Gallardo",
          "author_link": "https://github.com/nelson687se",
          "author_icon": "https://avatars2.githubusercontent.com/u/15727269?v=4",
          "title": "adding booking with flights to await payment job",
          "title_link": "https://github.com/secretescapes/secret-escapes/pull/2004",
          "text": "Optional text that appears within the attachment",
          "fields": [
            {
              "title": "Status",
              "value": "Open",
              "short": true
            },
            {
              "title": "Lines changed",
              "value": "+1234 -3123",
              "short": true
            }
          ],
          "image_url": "http://my-website.com/path/to/image.jpg",
          "thumb_url": "https://assets-cdn.github.com/images/modules/logos_page/GitHub-Mark.png",
          "ts": 123456789
        }
      ]
    };

    msgData = {
      channel: msg.message.room,
      text: "Latest changes",
      attachments: [
        {
          fallback: "Comparing #{latestRelease.name}...#{latestRelease.target_commitish} - #{compare.html_url}",
          title: "Comparing #{latestRelease.name}...#{latestRelease.target_commitish}",
          text: "commits_summary"
        }
      ]
    };

    robot.adapter.client.web.chat.postMessage(res.message.room, "This is a message!", {as_user: true, unfurl_links: false})

*/
    // if (owner && repo && number) {
    //   rp({
    //     method: "GET",
    //     uri: `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`,
    //     headers: {
    //       "Authorization": `token ${GITHUB_TOKEN}`,
    //       "User-Agent": "SEBOT"
    //     }
    //   }).then(data=> res.emit('slack-attachment', test))
    // }
  });

};
