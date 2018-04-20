const rp = require('request-promise');
require('dotenv').config();

module.exports = (robot) => {
  const regexGeneral = /DEV-(\d+)/g;
  robot.hear(regexGeneral, [], (res)=> {
    res.send("Hello")
  });
};
