var parser = require('moment-parser');

module.exports = (robot) => {
  const regex = /be quiet for (.*)/gi;
  robot.respond(regex, [], (res)=> {
    res.send(`Ok: ${res.match}`)
  });
};
