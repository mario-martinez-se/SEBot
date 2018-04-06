const rp = require('request-promise');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
module.exports = (robot) => {

  const regex = /https:\/\/github.com\/([^\/]*)\/([^\/]*)\/pull\/(\d+)\/.*/g;
  robot.hear(regex, [], (res)=> {
    const match = regex.exec(res.match[0]);
    const owner = match[1];
    const  repo = match[2];
    const number = match[3];
    if (owner && repo && number) {
      rp({
        method: "GET",
        uri: "https://api.github.com/repos/secretescapes/secret-escapes/pulls/2004",
        headers: {
          "Authorization": `token ${GITHUB_TOKEN}`,
          "User-Agent": "SEBOT"
        }
      }).then(data=> res.reply(data))
    }
    // res.reply(`${owner} - ${repo} - ${number}`);
  });

};
