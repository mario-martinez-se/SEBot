
module.exports = (robot) => {
  const regex = /badger/i;
  robot.hear(regex, [], (res)=> {
    res.send(`Ok`)
  });
};
