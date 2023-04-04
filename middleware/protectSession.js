module.exports = function (req,res,next) {
  if(!req.session.accept){
    req.flash(`error`, `Для действий на сайте вам нужно авторизоваться`);
    res.redirect(`/auth`);
    console.log(`Не авторизован на сайте`);
    return;
  }

  next();
}