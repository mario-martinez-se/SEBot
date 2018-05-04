const juration = require('juration');
const commons = require('../commons');
module.exports = (robot) => {
  robot.respond(/don't repeat for (.*)/i, [], (res)=> {
    const secs = juration.parse(res.match[1]);

    if (!isNaN(secs)) {
      robot.brain.set(`SILENT_FOR:${res.message.room}`, secs);
      res.send(`Ok! I won't repeat myself for at least ${res.match[1]} (${secs} secs) in this channel`);
    } else {
      res.send(`Sorry, I don't understand`);
    }
  });

  robot.respond(/(.*)(?:config|configuration)(.*)/i, [], (res) => {
    res.send(`I have been told not to repeat myself for ${robot.brain.get("SILENT_FOR:"+res.message.room)||commons.DEFAULT_MUTE_PERIOD} secs in this channel`);
  });

  robot.respond(/help/i, [], (res) => {
    res.send(`Hey, I can get information about jira tickets and github pull requests when I see you are talking about them, but if I repeat myself too much, you can just let me know ("@sebot don't repeat for X minutes").\nAlso, if you want to know for how long I won't repeat myself in this channel, you can just ask "@sebot what's your config?"`);
  });

  robot.respond(/(?:hi|hello)/i, [], (res) => {
    res.send(`:wave:Hello! I am SEBot. I can provide extended information about Jira tickets and GitHub Pull Requests whenever I detect you are talking about them. I won't repeat the same for at least ${robot.brain.get("SILENT_FOR:"+res.message.room)||commons.DEFAULT_MUTE_PERIOD} seconds, but if I get too much repetitive, you can just ask me "@sebot don't repeat for X minutes".`)
  });

  robot.error((error, res) => {
    res.send(`:nauseated_face: I am not feeling too well...\n${error}`);
  });
};
