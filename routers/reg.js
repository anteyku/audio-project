let {Router} = require(`express`);

let router = Router();

router.get(`/`, async (req,res)=>{
  res.render(`index`, {
    title: `Страница Регистрации`,
    error: req.flash(`error`),
    succes: req.flash(`succes`),
    reg: true
  })
})


module.exports = router;