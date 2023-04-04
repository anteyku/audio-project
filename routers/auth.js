let {Router} = require(`express`);
let User = require(`../models/user`);
let {validationResult} = require(`express-validator/check`);
let {authUser} = require(`../utils/validator`);
let bcrypt = require(`bcrypt`);



let router = Router();

router.get(`/`, async (req,res)=>{
  res.render(`auth`, {
    title: `Страница Авторизацаа`,
    error: req.flash(`error`),
    succes: req.flash(`succes`)
  })
})

//! Авторизация пользователя в аккаунте
router.post(`/`, authUser, async (req,res)=>{

  let errors = validationResult(req);

  if(!errors.isEmpty()){
    req.flash(`error`, errors.array()[0].msg);
    res.redirect(`/auth`);
    console.log(`Проверка не пройдена`);
    return;
  }

  let pass = await User.findOne({email: req.body.email});
  let check = await bcrypt.compare(req.body.password, pass.password);

  if(check){
    // Проверка на подтвержденную почту 
    if(pass.emailAccept){
      req.session.accept = true;
      req.session.user = pass;
      await req.session.save();
  
      req.flash(`succes`, `Успешная авторизация в аккаунте`);
      res.redirect(`/`);
    } else {
      req.flash(`error`, `Для входа в аккаунт - подтвердите почту, перейдя по письме отправленному на вашу почту`);
      res.redirect(`/auth`);
    }


  } else {
    console.log(`Не правельный пароль или логин`);
    req.flash(`error`, `Не верный логин или пароль`)
    res.redirect(`/auth`);
  }

})

module.exports = router;
