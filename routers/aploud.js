let {Router} = require(`express`);
let protectSession = require(`../middleware/protectSession`); // Защита сессии
let Audio = require(`../middleware/file`);
let fs = require(`fs`);
let Writes = require(`../models/song`);
let Time = require(`../public/time`);

let router = Router();

router.get(`/`, protectSession, async(req,res)=>{
  res.render(`upload`, {
    title: `Страница загрузки аудио файлов`,
    authorization: req.session.user
  })
})

//! Удаления записи
router.get(`/delete/:id`, protectSession, async(req,res)=>{
  console.log(`Запрос на удаления записи`)

  let check = await Writes.findOne({
    _id: req.params.id,
    createEmailUser: req.session.user.email
  })

  // Проверка на то что id запрашиваемой записи - существует, и пользователь создавшый эту запись являеться владельцем текущей сессии
  if(check){
    
    
      const cleanedFilePath = check.imagePath.replace(/^\/images\\/, '');
      const cleanedFilePath1 = check.audioPath.replace(/^\/audio\\/, '');

      fs.unlinkSync(`public/images/${cleanedFilePath}`);
      fs.unlinkSync(`public/audio/${cleanedFilePath1}`);    
     
    await Writes.deleteOne({
      _id: req.params.id
    }).then(()=>{
      console.log(`Запись успешно удалена`)
    })
    
    // Этим ответом - я перенаправляю клиента на страницу кабинета
    res.writeHead(302, {
      'Location': '/cabinet'
    });
    res.end();
    

  }


})

// Загрузка и сохранения аудио файлов на сервере
// число в скобках "2" это максимальное количество файлов сохраняемых за адин раз
router.post(`/audio`, protectSession, Audio.fields([{ name: 'audio', maxCount: 1 }, { name: 'image', maxCount: 1}]), async(req,res)=>{
  
  // Проверка на получения обеих нужных файлов на сервере
  if(req.files.audio){
    console.log(`Файл audio загружен`);

    if(req.files.image){
      console.log(`Файл image загружен`);

      if(!req.body.name){
        console.log(`Не установлено описание`);
        fs.unlinkSync(req.files.audio[0].path);
        fs.unlinkSync(req.files.image[0].path);
        
        return;
      } else {
        console.log(`Есть описание`);
      }


    } else {
      console.log(`Файл image НЕ найден`);
      // Адаления файла audio загруженного ранее пользователем 
      // если не загружен файл image
      fs.unlinkSync(req.files.audio[0].path)
      return;
    }
  } else {
    console.log(`Файл audio НЕ загружен`);
    // Удаления файла image если он загружен а 
    // файл audio не загружен
    if(req.files.image){
      fs.unlinkSync(req.files.image[0].path)
    }

    return; 
  }





  // req.session.user.login - логин пользователя создавшего запись
  // req.body.name - названия записи
  // req.files.audio[0].path - путь к audio файлу
  // req.files.image[0].path - путь к картинке
  // Time() - время создания записи

  console.log(req.files.audio)

  await new Writes({
    name: req.body.name,
    imagePath: `/images\\` + req.files.image[0].filename,
    audioPath: `/audio\\` + req.files.audio[0].filename,
    createTime: Time(),
    createUser: req.session.user.login,
    createEmailUser: req.session.user.email
  })
  .save()
  .then((s)=>{
    console.log(s);
  })
  .catch((e)=>{
    console.log(e);
  })
  
  
  res.send(JSON.stringify(`Файл отправлен на сервер`));
})

module.exports = router;