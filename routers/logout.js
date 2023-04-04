let {Router} = require(`express`);

let router = Router();

//! Выход из аккаунта
router.get(`/`, async(req,res)=>{
  req.session.destroy(()=>{
    res.redirect(`/auth`);
  })
})

module.exports = router;