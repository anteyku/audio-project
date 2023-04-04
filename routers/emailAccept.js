let {Router} = require(`express`);
let User = require(`../models/user`);

let router = Router();

//! Подтверждения почьты для аккаунта
router.get(`/:token`, async (req,res)=>{
  
  let check = await User.findOne({
    emailToken: req.params.token,
    emailTokenExp: {$gt: Date.now()}
  })
 
  // Если найден аккаунт с таким токеном
  // Если не истекло время действия токена
 if(check){
    check.emailAccept = true;
    check.emailToken = undefined;
    check.emailTokenExp = undefined;
    // Сохраняем внесенные изминения
    await check.save();

    req.flash(`succes`, `Почта ${check.email} успешно подтверждена.`);
    res.redirect(`/auth`);
 } else {
    req.flash(`error`, `Неверный token или действия ссылки истекло`);
    res.redirect(`/auth`);
 }

})

module.exports = router;