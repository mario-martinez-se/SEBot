
module.exports = (robot) => {
  const regex = /shut up/g;
  robot.respond(regex, [], (res)=> {
    res.send(`Ok`)
  });
};
