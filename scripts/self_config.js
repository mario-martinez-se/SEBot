var juration = require('juration');

module.exports = (robot) => {
  const regex = /be quiet for (.*)/i;
  robot.respond(regex, [], (res)=> {
    const secs = juration.parse(res.match[1]);

    if (!isNaN(secs)) {
      robot.brain.set(`SILENT_FOR:${res.message.room}`, secs);
      res.send(`Ok! I won't repeat myself for at least ${res.match[1]} (${secs} secs) in this channel`);
    } else {
      res.send(`Sorry, I don't understand`);
    }
  });
};
