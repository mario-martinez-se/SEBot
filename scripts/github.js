module.exports = (robot) => {

  robot.hear(/hello/, [], (msg)=>{
    msg.reply("world");
  });

};
