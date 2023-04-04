let {Router} = require(`express`);
let {validationResult} = require(`express-validator/check`);
let {resetPass} = require(`../utils/validator`);
let {newPass} = require(`../utils/validator`);
let resetPassword = require(`../emails/reset`);
let nodemailer = require(`nodemailer`);
let User = require(`../models/user`);
let crypto = require(`crypto`);
let bcrypt = require(`bcrypt`);

let router = Router();



let transporter = nodemailer.createTransport({
  service: `gmail`,
  auth: {
    user: `1nonamehack@gmail.com`,
    pass: `zjbrdckxwpgpevsa`
  }
})



router.get(`/`, async (req,res)=>{
  res.render(`password`, {
    title: `Страница возстановления пароля`,
    error: req.flash(`error`),
    succes: req.flash(`succes`)
  })
})

//! Форма с email на возстановления пароля
router.post(`/resetEmail`, resetPass, async (req,res)=>{
  
  let errors = validationResult(req);

  if(!errors.isEmpty()){
    req.flash(`error`, errors.array()[0].msg);
    res.redirect(`/`);
    console.log(`Проверка не пройдена`);
    return;
  }

 // Проверка на наличия аккаунта с таким логином в базе данных
 let check = await User.findOne({email: req.body.email});

 if(check){

  // Проверка на то - подтверждена ли почта или нет
    if(check.emailAccept == true){
      crypto.randomBytes(32, async (err, buffer)=>{

        let token = buffer.toString(`hex`);
        check.resetToken = token;
        check.resetTokenExp = Date.now() + 60 * 60 * 1000;
  
        check.save();
  
        await transporter.sendMail(resetPassword(req.body.email, token));
  
        req.flash(`succes`, `На почту ${req.body.email} отправлено письмо возстановления`);
        res.redirect(`/password`);
  
      })
    } else {
      req.flash(`error`, `Почта аккаунта не подтверждена`);
      res.redirect(`/password`);
    }


 } else {
   req.flash(`error`, `Аккаунта с такой почьтой не существует`);
   res.redirect(`/password`);
 }

})

//! Переход из письма почьты для подтверждения пароля
router.get(`/:token`, async (req,res)=>{
  
  let check = await User.findOne({
    resetToken: req.params.token,
    resetTokenExp: {$gt: Date.now()}
  })

  if(check){
    res.render(`newPassword`, {
      title: `Установка нового пароля`,
      check
    })
  } else {
    req.flash(`error`, `Жизнь токена устекла или токен не верный`);
    res.redirect(`/password`);
  }

})

//! Сохранения нового пароля
router.post(`/newPass`, async (req,res)=>{

  let check = await User.findOne({
    resetToken: req.body.token,
    resetTokenExp: {$gt: Date.now()},
    _id: req.body._id
  })

  if(check){
    console.log(`Проверка на валидность токена и id пройдена`);
    req.body.password = await bcrypt.hash(req.body.password, 10);
    check.password = req.body.password;
    check.resetToken = undefined;
    check.resetTokenExp = undefined;

    await check.save();

    req.flash(`succes`, `Пароль изменен`);
    res.redirect(`/auth`);
  } else {
    req.flash(`error`, `Валидность токена или id не пройдена`);
    res.redirect(`/auth`);
  }

})

module.exports = router;