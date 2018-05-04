var juration = require('juration');

module.exports = (robot) => {
  const regex = /be quiet for (.*)/i;
  robot.respond(regex, [], (res)=> {

    res.send(`${juration.parse(res.match[1])}`)

    // const secs = res.match[1];
	//
    // if (!isNaN(secs)) {
    //   robot.brain.set(`SILENT_FOR:${res.message.room}`, secs);
    //   res.send(`Ok! I won't repeat myself for at least ${secs} secs in this channel`);
    // } else {
    //   res.send(`Sorry, I don't understand`);
    // }
  });
};
