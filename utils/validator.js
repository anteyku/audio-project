let {body} = require(`express-validator/check`);
let User = require(`../models/user`);


// Проверка формы регистрации
exports.regUser = [
  body(`login`, `Минимальная длинна логина 6 символов, макс 20`)
  .isLength({min: 6, max: 20})
  .isAlphanumeric()
  .trim(),
  body(`email`, `Email указан не верно`)
  .normalizeEmail()
  .isEmail()
  .custom(async (value, {req})=>{

    let check = await User.findOne({email: value})

    if(check){
      return Promise.reject(`Аккаунт с таким email уже существует`);
    }

  }),
  body(`password`, `Пароль должен содержат минимум 6 символов, макс 60`)
  .isLength({min: 6, max: 60})
  .isAlphanumeric()
  .trim()

]

// Проверка формы авторизации
exports.authUser = [
  body(`email`, `Email указан не верно`)
  .normalizeEmail()
  .isEmail()
  .custom(async (value, {req})=>{

    let check = await User.findOne({email: value});

    if(!check){
      return Promise.reject(`Аккаунт с таким email не существует`);
    }
  }),
  body(`password`, `Пароль должен содержать минимум 6 символов, макс 60`)
  .isLength({min: 6, max: 60})
  .isAlphanumeric()
  .trim()
]

// Проверка формы возстановления пароля
exports.resetPass = [
  body(`email`, `Email указан не верно`)
  .normalizeEmail()
  .isEmail()
  .custom(async (value, {req})=>{

    let check = await User.findOne({email: value});

    if(!check){
      return Promise.reject(`Аккаунт с таким email не существует`);
    }
  })
]

// Установка нового пароля для аккаунта
exports.newPass = [
  body(`password`, `Пароль должен содержать минимум 6 символов, макс 60`)
  .isLength({min: 6, max: 60})
  .isAlphanumeric()
  .trim()
]

// Валидация поля для редактирования имя пользователя
exports.editName = [
  body(`name`, `Минимальная длинна логина 6 символов, макс 20`)
  .isLength({min: 6, max: 20})
  .isAlphanumeric()
  .trim()
]

// Валидация поля для смены пароля
exports.newPassword = [
  body(`oldpassword`, `Пароль должен содержать минимум 6 символов, макс 60`)
  .isLength({min: 6, max: 60})
  .isAlphanumeric()
  .trim(),
  body(`password`, `Пароль должен содержать минимум 6 символов, макс 60`)
  .isLength({min: 6, max: 60})
  .isAlphanumeric()
  .trim(),
]