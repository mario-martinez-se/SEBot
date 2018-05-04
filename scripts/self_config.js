var parser = require('moment-parser');

module.exports = (robot) => {
  const regex = /be quiet for (.*)/i;
  robot.respond(regex, [], (res)=> {
    res.send(`Ok: ${res.match[1]}`)
  });
};
