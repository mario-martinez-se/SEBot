
module.exports = (robot) => {
  const regex = /badger/i;
  robot.respond(regex, [], (res)=> {
    res.send(`Ok`)
  });
};
