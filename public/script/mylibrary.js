(function(window) { //Анонимная обёртка для всего
  'use strict'; //Строгое соблюдение синтаксиса
  function myLibrary() { //Обёртка для нашего кода
   var _myPuginationObject = {};

   _myPuginationObject.pagePaginate = async function (object){




    // Получения CSRF ключа
    let csrf = document.querySelector(`#csrf`);
    csrf = csrf.dataset.csrf;

    // База данных нашых новосттей
    let users = [];

    // Количество записей на одной странице
    let notesOnPage = object.loadContentLength;

    // Количество обектов в базе данных
    let UserLength;
    // Получаю количество обектов в базе данныых для UserLength
    await requestBasa();
    
    
    // Общее количество страниц (с учетом количества контента на каждой странице)
    let countOfItems = Math.ceil(UserLength / notesOnPage);  
    
    // Текущая страница (на которой находимся при загрузке страницы)
    let thisPage = 1;

  




    
    

    // Прорисовка кнопок страничек
    renderPageBtn(thisPage);
    // Добавляю все нашы кнопки переключения страничек
    let items = document.querySelectorAll(`${object.items}`);
    // Выбираю самую первую страничку, и загружаю контент на сервер
    sharp(items[0]);
    

    proslushka();
    function proslushka(){
      for(let elem of document.querySelectorAll(`${object.items}`)){
        elem.addEventListener(`click`, (event)=>{
          sharp(elem)
        })
      }
    }



// Запуск выбора страниички и контента на ней
async function sharp (elem){


  await fetch(object.postRequest, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({page: Number(elem.innerHTML), loadContentLenght: object.loadContentLength}),
    headers: {
        'X-XSRF-TOKEN': csrf,
        'content-type': 'application/json'
    }
    }).then((response)=>{
      // Разпарсиваем полученную JSON строку и передаем в следующий then
      return response.json()
    }).then((infa)=>{
      users = [];
      // Добавляю в базу данных информацию о нашых блоках
      for(let elem of infa.db){
        users.push(elem);
      }
    })  



 

   
 




    // Устанавливаем текущую страницу выбранную
    thisPage = Number(elem.innerHTML)
    renderPageBtn(thisPage);
    
    
    // Запрашиваемая страница
    let pageNum = Number(elem.innerText);

    // Начальный индекс поиска в базе данных
    let start = (pageNum - 1) * notesOnPage;
    // Конечьный индекс поиска в базе данных
    let end = start + notesOnPage; 



    
    // Добавляю новые елементы в наш блок
    assemblyShablon(users, object.shablon.html, object.shablon.paste, object.shablon.pasteContent);
  }       



  // Получения количества обектов в базе данных
  async function requestBasa(){
    
    await fetch(object.postRequest, {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({page: 1, loadContentLenght: object.loadContentLength}),
      headers: {
          'X-XSRF-TOKEN': csrf,
          'content-type': 'application/json'
      }
      }).then((response)=>{
        // Разпарсиваем полученную JSON строку и передаем в следующий then
        return response.json()
      }).then((infa)=>{
        UserLength = infa.basaLength;
      })  
  }


  // Наполнения нового блока динамическим контентом
  function assemblyShablon(basa, shablon, items, content){
     
    object.table.innerHTML = ``;
    
    for(let i = 0; i < basa.length; i++){
    
      // 1. Поиск регулярками заменяемых слов, после чего - замена их
      let thisText = shablon;
      for(let b = 0; b < items.length; b++){
        let constReg = RegExp("" + items[b] + "", "g");
        thisText = thisText.replace(constReg, basa[i][content[b]]);
      }
      
      // 2. Превращаю шаблон в DOM елемент
      let domShablon = document.createElement('div');
      domShablon.innerHTML= thisText;
      let clearShablon =  domShablon.firstElementChild; // domShablon firstChild - раньше было

    
      // 3. Добавляю елемент в родительский блок
      object.table.appendChild(clearShablon);
      

    }
  

 }


  // Создания кнопок - удаления стаарых кнопой
  function renderPageBtn(){


    // 1. Удаляю старые кнопки страниц
    object.pageLink.innerHTML = ``;
    

    // 2. Создания новой навигации страниц
    let beforePage;
    let afterPage;

   

    if(thisPage - 1 == 0){ // Если это первая загружаемая страница

      if(thisPage + 1 == countOfItems){ // Если страницы всего две то создаем всего две
        beforePage = thisPage;
        afterPage = thisPage + 1;
      } else if(thisPage - countOfItems == 0){ // Если страница только одна
        beforePage = thisPage;
        afterPage = thisPage;
      } else { // Если мы на первой странице то не показиваем нулевую
        beforePage = thisPage;
        afterPage = thisPage + 2;
      }

    } else if(thisPage + 1 > countOfItems) { // Если дальше страниц нету

      if(thisPage - 2 == 0){ // Если страниц всего две то не показываем третю
        beforePage = thisPage - 1;
        afterPage = thisPage;
      } else {
        beforePage = thisPage - 2; // Если мы на последней странице то не показываем следущею
        afterPage = thisPage;
      }

    } else { // Если есть прошлая и следующая страница
      beforePage = thisPage - 1;
      afterPage = thisPage + 1;
    }
          
    // beforePage - предыдущая страница
    // afterPage - следующая страница
    for(let pageLength = beforePage; pageLength <= afterPage; pageLength++){

      let wrapper= document.createElement('div');
      wrapper.innerHTML= object.pageShablon;
      let div = wrapper.firstChild;
      div.children[0].innerText = pageLength;

      if(pageLength == thisPage){ // Если страница выбранная то ей клас вешаеться
        div.classList.add(`active`);
      } 

      object.pageLink.appendChild(div);
    
    }  

    proslushka();


  }



   }



 


   return _myPuginationObject;
  }
 
  // Чтобы библиотека была глобально доступна, 
  //сохраним объект в контексте глобального объекта window
  if( typeof (window.myWindowGlobalLibraryName) === 'undefined') {
   window.Pagination = myLibrary();
  }
 })(window); //Обёртка вызывает себя, передавая себе объект window