const rp = require('request-promise');
require('dotenv').config();

module.exports = (robot) => {
  const regexGeneral = /DEV-(\d+)/g;
  const regex = /DEV-(\d+)/;
  robot.hear(regexGeneral, [], (res)=> {

    res.send(res.match
      .map(issueId => regex.exec(issueId)))
  });
};
