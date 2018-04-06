module.exports = (robot) => {

  robot.hear(/https:\/\/github.com\/[^\/]*\/[^\/]*\/pull\/(\d+)\/.*/g, [], (msg)=> {
    msg.reply("world");
  });

};
