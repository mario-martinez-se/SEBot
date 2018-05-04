
module.exports = (robot) => {
  const regex = /be quiet for (.*)/i;
  robot.respond(regex, [], (res)=> {

    const secs = res.match[1];
    robot.brain.set(`SILENT_FOR:${res.message.room}`, secs);
    res.send(`Ok! I won't repeat myself for at least ${secs} secs in this channel`);
  });
};
