let {Router} = require(`express`);
let Songs = require(`../models/song`);
let Users = require(`../models/user`);
let protectSession = require(`../middleware/protectSession`);
let {validationResult} = require(`express-validator/check`);
let {editName} = require(`../utils/validator`); // Валидация поля имя
let {newPassword} = require(`../utils/validator`); // Валидация введенного пароля
let crypto = require(`crypto`);
let bcrypt = require(`bcrypt`);

let router = Router();

//! Загрузка страницы кабинета
router.get(`/`,  protectSession, async (req,res)=>{

 let dbLength = await Songs.find({
    createEmailUser: req.session.user.email
 });
 let login = await Users.findOne({_id: req.session.user._id});
  login = login.login;

  
 let myWrites = await Songs.find({createEmailUser: req.session.user.email});

 // console.log(myWrites);

  res.render(`cabinet`, {
    title: `Личьный кабинет`,
    cabinet: true,
    authorization: req.session.user,
    login,
    wrtLength: dbLength.length,
    _id: req.session.user._id,
    error: req.flash(`error`),
    succes: req.flash(`succes`),
    writes: myWrites
  })
})

//! Редактирования пароля пользователя
router.post(`/edit-password`, protectSession, newPassword, async (req,res)=>{
  let errors = validationResult(req);

  if(!errors.isEmpty()){
    req.flash(`error`, errors.array()[0].msg);
    res.redirect(`/cabinet`);
    console.log(`Проверка не пройдена`);
    return;
   }  

   let check = await Users.findOne({_id: req.body.id});
  
   if(check){
     let check2 = await bcrypt.compare(req.body.oldpassword, check.password);
     if(check2){
       
      check.password = await bcrypt.hash(req.body.password, 10);
      await check.save();

      req.flash(`succes`, `Успешная смена пароля`);
      res.redirect(`/cabinet`);


     } else {
      req.flash(`error`, `Старый пароль не верный.`);
      res.redirect(`/cabinet`);
      return;
     }
   } else {
    req.flash(`error`, `Упс.. чтото пошло не так.`);
    res.redirect(`/cabinet`);
    return;
   }

})

//! Редактирования имя пользователя
router.post(`/:id`, protectSession, editName, async(req,res)=>{
 //console.log(req.params.id)
 let errors = validationResult(req);


 if(!errors.isEmpty()){
  req.flash(`error`, errors.array()[0].msg);
  res.redirect(`/cabinet`);
  console.log(`Проверка не пройдена`);
  return;
 }

 let check = await Users.findOne({_id: req.params.id});

 if(check){
  check.login = req.body.name;
  await check.save();
 } else {
  req.flash(`error`, `Упс.. чтото пошло не так.`);
  res.redirect(`/cabinet`);
  return;
 }
 


 req.flash(`succes`, `Успешная смена Name на ${req.body.name}`);
 res.redirect(`/cabinet`);

})



module.exports = router;