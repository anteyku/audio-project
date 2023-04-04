let {Router} = require(`express`);

let router = Router();

router.get(`/`, async(req,res)=>{

 
  
  
  res.render(`sounds`, {
    title: `Журнал всех треков`,
    audio: true,
    authorization: req.session.user
  })
})

module.exports = router;