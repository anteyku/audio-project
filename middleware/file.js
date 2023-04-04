let multer = require(`multer`);
let timeFile = require(`../public/timeFile`); 
let path = require(`path`);


// МОДУЛЬ ДЛЯ ТОГО ЧТОБЕ ГЕНЕРИРОВАТЬ УНИКАЛЬНЫЙ ID НАЗВАНИЯ ФАЙЛА
// ЧТОБЕ ПОЛЬЗОВАТЕЛЬ САМ НЕ МОГ ЕГО НАЗВАТЬ, так как там он сможет
// прописать пути к файлу другим или чтото короче сделать
var uuid = require('uuid');


let storage = multer.diskStorage({
  destination(req,file,cb) {
    
    // Если файл загружаеться из input с name="audio" то сохранняем его в папку audio
      if (file.fieldname === "audio") {
          cb(null, `public/audio`)
      }
    // Если файл загружаеться из input с name="image" то сохранняем его в папку images
      if (file.fieldname === "image") {
        cb(null, `public/images`)
      }
  },
  filename(req,file,cb) {

    // Как я сохраняю файл ? Чтобе файлы не заменялись при сохранении похожего файла я делаю вот так -
    // 1. id аккаунта который сохраняет
    // 2. время с текущей датой вплоть до секунды
    // 3. названия самого файла
    // Используя такой алгоритм сохранения файлов - похожый файл может только 
    // сохраниться и замениться если пользователь одновременно с двух форм 
    // сохранит адинаковые файлы по названию в туже сикунду

    // Если файл загружаеться из input с name="audio" то сохранняем его в папку audio
    // с определенным названием
   
    if (file.fieldname === "audio") {
     
      // path.extname(file.originalname) - это мы получаем именно формат загружаемого файла
       cb(null,`Audi ` + req.session.user._id.toString() + ` ` + timeFile() + uuid.v1() + path.extname(file.originalname))      
    }
    if (file.fieldname === "image") {
      cb(null,`Image ` + req.session.user._id.toString() + ` ` + timeFile() + uuid.v1() + path.extname(file.originalname))      
   }

  }
})

let allowedTypes = ['audio/mp3', `audio/mp4`, `audio/mpeg`, `image/jpg`, `image/jpeg`, `image/png`, `image/webp`];

let fileFilter = (req,file,cb) => {

 
  // Если формат загружаемого файла есть в массиве allowedTypes то идем дальше
  if(allowedTypes.includes(file.mimetype)){
    // Если файл загружаеться из name="audio"
    if(file.fieldname === `audio`){
      // Если файл содержит адин из форматов в audio/mpeg или audio/mp3 или audio/mp4
      if(file.mimetype == `audio/mpeg` || file.mimetype == `audio/mp3` || file.mimetype == `audio/mp4`){
        // console.log(req.files);
        // console.log(`Файл это аудио ` + file.mimetype);
        cb(null, true)
      } else { // В другом случае - файл не сохраняеться
        cb(null, false)
      }
    } 

    // Если файл загружаеться из name="image"
    if(file.fieldname === `image`){
      if(file.mimetype == `image/jpg` || file.mimetype == `image/jpeg` || file.mimetype == `image/webp` || file.mimetype == `image/png`){
        // console.log(`Файл это картинка ` + file.mimetype);
        cb(null, true)
      } else {
        cb(null, false)
      }
    }  
  } else {
    cb(null, false)
  }
  


}




module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    files: 2, // allow up to 5 files per request,
    fieldSize: 2 * 1024 * 1024 // 2 MB (max file size)
  }
})