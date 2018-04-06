module.exports = (robot) => {

  robot.hear(/https:\/\/github.com\/[^\/]*\/[^\/]*\/pull\/(\d+)\/.*/g, [], (res)=> {
    console.log("-----------");
    console.log(res.match);
    res.reply("world");
  });

};
