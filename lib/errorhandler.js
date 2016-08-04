module.exports = function(err,req,res,next) { // eslint-disable-line
  if (err) {
    res.status(err.status || 400);
    res.json(err);
  }
};