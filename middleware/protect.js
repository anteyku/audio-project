module.exports = function (req,res,next){
  res.locals.active = req.session.accept;
  res.locals.csrf = req.csrfToken();
  next();
}