let express = require(`express`);
let Index = require(`./routers/index`);
let handlebars = require(`express-handlebars`);
let Register = require(`./routers/register`);
let mongoose = require(`mongoose`);
let session = require(`express-session`);
let keys = require(`./keys/keys.dev`);
//  хранит свои сообщения в сесси временно (для того чтобе передавать ошыбки)
let flash = require(`connect-flash`);
let Auth = require(`./routers/auth`);
let EmailAccept = require(`./routers/emailAccept`);
let app = express();
let Password = require(`./routers/password`);
let csrf = require(`csurf`);
let protectCSRF = require(`./middleware/protect`);
let Reg = require(`./routers/reg`);
let Sounds = require(`./routers/audios`);
let Aploud = require(`./routers/aploud`);
let File = require(`./middleware/file`); // Настройка сохранения файла
let Logout = require(`./routers/logout`); // Выход из текущего аккаунта
let getAudio = require(`./routers/getAudio`) // Получения списка контента для пагинации
let Cabinet = require(`./routers/cabinet`); // Страница личного кабинета



let MongoStore = require(`connect-mongodb-session`)(session);
let store = new MongoStore({
  collection: `sessions`,
  uri: keys.mongoURL
})
let sessionMiddleware = session({
  secret: keys.secret,
  resave: true,
  saveUninitialized: true,
  cookie: { // Автоудаления сессии через 1 час
    maxAge: 3600000,
    sameSite: "strict",
    secure: false,
    httpOnly: true
  }, 
  store: store
})

let hbs = handlebars.create({
  defaultLayout: `main`,
  extname: `hbs`
})

// Настройки сервера
app.engine(`hbs`, hbs.engine);
app.set(`view engine`, `hbs`);
app.set(`views`, `views`);
app.use(express.static(`public`));
app.use(`/audio`, express.static(`audio`))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(sessionMiddleware);
app.use(flash());
app.use(csrf()); // Защита от csrf атак
app.use(protectCSRF); // Показ ключя csrf на клиенте для отправки на бек


let PORT = process.env.PORT || 3001;


app.use(`/`, Index); // Главная страница 
app.use(`/reg`, Reg); // Страница регистрации
app.use(`/register`, Register); // Запрос на регистрацию аккаунта
app.use(`/auth`, Auth);  // Страница авторизации аккаунта
app.use(`/emailAccept`, EmailAccept); // Подтверждения почьты для аккаунта
app.use(`/password`, Password); // Страница возстановления пароля
app.use(`/sounds`, Sounds); // Страница всех треков
app.use(`/aploud`, Aploud); // Страница загрузки файлов
app.use(`/logout`, Logout); // Деавторизация в аккаунте
app.use(`/getaudio`, getAudio); // Асинхронное получения базы данных
app.use(`/cabinet`, Cabinet); // Страница личного кабинета
app.use(`/cabinet/edit-name`, Cabinet); // Смена имени в личном кабинете


// Запуск сервера
let startBD = async()=>{
  // Подключения базы данных
  await mongoose.connect(keys.mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=>{
    console.log(`База данных успешно подключена`);
  })

  // Запуск сервера 
  app.listen(PORT, ()=>{
    console.log(`Сервер успешно запущен`);
  })
}

startBD();