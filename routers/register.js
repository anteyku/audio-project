let {Router} = require(`express`);
let router = Router();
// Модель пользователя
let User = require(`../models/user`);
let Time = require(`../public/time`);
let {validationResult} = require(`express-validator/check`);
let {regUser} = require(`../utils/validator`);
let bcrypt = require(`bcrypt`);
let nodemailer = require(`nodemailer`);
// Письмо с настройками и текстом для подтверждения почьты 
let Emails = require(`../emails/accept`);
// Встроенная библиотека node.js для генерации ключей
let crypto = require(`crypto`);



// Настраиваем почту с которой отправлять будем письмо
let transporter = nodemailer.createTransport({
  service: `gmail`,
  auth: {
    user: `1nonamehack@gmail.com`,
    pass: `zjbrdckxwpgpevsa`
  }
})



// POST запрос на регистрацию нового пользователяы
router.post(`/`, regUser, async (req,res)=>{
  


  let errors = validationResult(req);

  if(!errors.isEmpty()){
    req.flash(`error`, errors.array()[0].msg);
    res.redirect(`/`);
    console.log(`Проверка не пройдена`);
    return;
  }


  // Проверка на наличия аккаунта с таким логином в базе данных
 let check = await User.findOne({email: req.body.email});
 



  if(!check){
    // Шифрую пароль
    req.body.password = await bcrypt.hash(req.body.password, 10);
  
    await new User({
      login: req.body.login,
      password: req.body.password,
      created: Time(),
      email: req.body.email,
      emailAccept: false
    })
    .save()
    .then((s)=>{
      console.log(s);
    })


    check = await User.findOne({email: req.body.email});


        // Генерирую токен и отправляю на почту
          crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                console.log(err);
            } else {

                let token = buffer.toString(`hex`);
             
                check.emailToken = token;
                check.emailTokenExp = Date.now() + 60 * 60 * 1000;

                await check.save();

                // Нам необходимо сгенерировать пароль на основе двух параметров
                await transporter.sendMail(Emails(req.body.email, token));
                console.log(`Пиьсмо по идеи отправлено на почту`);
            }
        })




    req.flash(`succes`, `На вашу почту отправленно письмо подтверждения регистрации`);
    res.redirect(`/`);
  } else {
    req.flash(`error`, `Аккаунт с таким email уже существует`);
    res.redirect(`/`);
  }
  


})

module.exports = router;