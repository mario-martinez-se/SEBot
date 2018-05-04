const juration = require('juration');
const commons = require('../commons');
module.exports = (robot) => {
  robot.respond(/be quiet for (.*)/i, [], (res)=> {
    const secs = juration.parse(res.match[1]);

    if (!isNaN(secs)) {
      robot.brain.set(`SILENT_FOR:${res.message.room}`, secs);
      res.send(`Ok! I won't repeat myself for at least ${res.match[1]} (${secs} secs) in this channel`);
    } else {
      res.send(`Sorry, I don't understand`);
    }
  });

  robot.respond(/config/i, [], (res) => {
    res.send(`I won't repeat myself for ${robot.brain.get("SILENT_FOR:"+res.message.room)||commons.DEFAULT_MUTE_PERIOD} secs in this channel`);
  });
};
