let {Router} = require(`express`);

let router = Router();

router.get(`/`, async (req,res)=>{
  res.render(`imp`, {
    title: `Главная страница`,
    error: req.flash(`error`),
    succes: req.flash(`succes`),
    glav: true,
    authorization: req.session.user
  })
})


module.exports = router;