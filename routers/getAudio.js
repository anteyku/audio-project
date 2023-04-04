let {Router} = require(`express`);
const { stringify } = require("uuid");
let Songs = require(`../models/song`);

let router = Router();

router.post(`/`, async(req,res)=>{

  
  let PAGE_SIZE = req.body.loadContentLenght; // Количество загружаемых елементов на странице
  let PAGE_NUMBER = req.body.page; // Страница которую нам нужно открыть
  let db = await Songs.find().sort({_id: -1}).skip(PAGE_SIZE * (PAGE_NUMBER - 1)).limit(PAGE_SIZE);
  let basaLength = await Songs.find();
  basaLength = basaLength.length;

  res.send(JSON.stringify({db, basaLength}));

})

module.exports = router;