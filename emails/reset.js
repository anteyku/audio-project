let keys = require(`../keys/keys.dev`);

module.exports = function (email, token){
  return {
    from: keys.email,
    to: email,
    subject: `Возстановления пароля`,
    html: `
    <h1> Возстановления пароля к аккаунта </h1>
    <p> Перейдите по ссылке ниже для возстановления пароля </p>
    </hr>
    <a href="${keys.url}/password/${token}">Возстановить пароль</a>
    `
  }
}