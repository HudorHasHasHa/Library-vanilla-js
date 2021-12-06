// Selectors
const submitButton = document.getElementById("submit");
const priority = document.getElementById("priorityOpt");
const table = document.getElementById("tableBody");
const deleteButtons = document.getElementsByClassName("deleteButton");

const addBook = (data) => {
  let html = '';
  table.innerHTML = '';
  for (let row of data) {
    let id = table.children.length;
    html = `
      <tr class="carWrapper" id="${id}">
        <td valign="center" class="table-element col-3 col-sm-3" id="title"><div class="table-cell">${row[1]}</div></td>
        <td valign="center" class="table-element col-3 col-sm-3" id="author"><div class="table-cell">${row[2]}</div></td>
        <td valign="center" class="table-element col-3 col-sm-3" id="priority"><div class="table-cell">${row[3]}</div></td>
        <td valign="center" class="table-element col-3 col-sm-3" id="genres"><div class="last-table-cell">${row[4]}<img class="deleteButton" src="./images/delete.png"/></div></td>
      </tr> 
    `
    table.insertAdjacentHTML('beforeend', html);
  }
  deleteElements();
}

submitButton.addEventListener('click', function (event) {
  event.preventDefault();
  let title = this.parentNode.parentNode[0].value;
  let author = this.parentNode.parentNode[1].value;
  let priority = this.parentNode.parentNode[2].value;
  let genres = this.parentNode.parentNode[3].value;
  if (
    title.length >= 1 && !/[^a-zA-Z0-9]/.test(title) &&
    author.length >= 3 && !/[^a-zA-Z]/.test(author) &&
    priority.length === 1
  ) {
    //adding row after validation
    addRow(title, author, priority, genres);
    //clearing inputs
    document.getElementById("bookForm").reset();
  }
  else if (!(title.length >= 1 && !/[^a-zA-Z0-9]/.test(title))) {
    swal("tytuł musi składać się z przynajmniej 1 litery lub cyfer, bez znaków specjalnych")
  }
  else if (!(author.length >= 3 && !/[^a-zA-Z]/.test(author))) {
    swal("autor musi składać się z przynajmniej 3 liter, bez znaków specjalnych i cyfer")
  }
});

priority.addEventListener('change', function (event) {
  event.preventDefault();
  if (this.value <= 0) {
    this.value = 1;
  }
  else if (this.value > 5) {
    this.value = 5;
  }
});

// add row into the table in localStorage
const addRow = (title, author, priority, genres) => {
  let rows = get();
  let id = table.children.length;
  // console.log(typeof rows);
  rows.push([id, title, author, priority, genres]);
  save(rows)
  sorting();
}

// get localStorage data
const get = () => {
  let rows = localStorage.getItem('table')
  if (!rows) {
    return []
  } else {
    return JSON.parse(rows)
  }
}

// saving changes
const save = data => {
  localStorage.setItem('table', JSON.stringify(data))
  addBook(data);
}

// deleting items from table&localStorage
const deleteElements = () => {
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', function () {
      // console.log(this.parentNode.parentNode.parentNode.id);
      // thisArray.push(this.parentNode.parentNode.parentNode.children[0].children[0].innerHTML);
      let storageData = JSON.parse(localStorage.getItem('table'));
      // deleting table item and item from localstorage by matching
      for (let i = 0; i < storageData.length; i++) {
        // console.log(this.parentNode.parentNode.parentNode.id, storageData[i][0]);
        if (+this.parentNode.parentNode.parentNode.id === +storageData[i][0]) {
          storageData.splice(i, 1);
        }
      }
      for (let i = 0; i < storageData.length; i++) {
        storageData[i][0] = i;
      }
      // console.log(storageData)
      save(storageData);
      this.parentNode.parentNode.parentNode.remove()
    });
  }
}

const switchIcon = (item, counter, allItems) => {
  for(let i = 0; i<allItems.length; i++){
    allItems[i].children[0].children[0].classList.remove("fa-arrow-up");
  }
  if(item.id !== "sortDefault"){
    if(counter%2==0){
      item.children[0].children[0].classList.add("fa-arrow-up");
    }else{
      item.children[0].children[0].classList.remove("fa-arrow-up");
    }
  }
}

// sorting by every header of the table with vanilajs
const sorting = () => {
  const title = document.getElementById("header-title");
  const author = document.getElementById("header-author");
  const priority = document.getElementById("header-priority");
  const genres = document.getElementById("header-genres");
  const sortDefault = document.getElementById("sortDefault");
  //adding counters to check when user want to sort asc and when decs
  let titleCount=2, authorCount=2, priorityCount=2, genresCount=2;
  let arr = [];
  let countersArr = [];
  // variable for switchicon reseting the icons
  let allItems = [];
  allItems.push(title,author,priority);
  countersArr.push(titleCount,authorCount);
  arr.push(title,author,genres);
  let defaultTable = get();
  // console.log(arr)
  for(let i = 0; i<arr.length; i++){
    // console.log(arr);
    arr[i].addEventListener('click', function () {
      const data = get();
      if(countersArr[i]%2==0){
        data.sort((a,b) => {
          if (a[i+1] === b[i+1]){
            return 0;
          }
          return (a[i+1] < b[i+1]) ? -1 : 1;
        });
        ++countersArr[i];
      }
      else{
        data.sort((a,b) => {
          if (b[i+1] === a[i+1]){
            return 0;
          }
          return (b[i+1] < a[i+1]) ? -1 : 1;
        });
        ++countersArr[i];
      }
      save(data)
      switchIcon(this, countersArr[i], allItems);
    });
  }
  genres.addEventListener('click', function(){
    const data = get();
    if(genresCount%2==0){
      data.sort((a,b) => {
        if (a[4] === b[4]){
          return 0;
        }
        return (a[4] < b[4]) ? -1 : 1;
      });
      ++genresCount;
    }
    else{
      data.sort((a,b) => {
        if (b[4] === a[4]){
          return 0;
        }
        return (b[4] < a[4]) ? -1 : 1;
      });
      ++genresCount;
    }
    save(data)
    switchIcon(this, genresCount, allItems);
  })
  priority.addEventListener('click', function(){
    const data = get();
    if(priorityCount%2==0){
      data.sort((a,b) => {
        if (a[3] === b[3]){
            return 0;
        }
        return (a[3] > b[3]) ? -1 : 1;
      });
      ++priorityCount;
    }
    else{
      data.sort((a,b) => {
        if (b[3] === a[3]){
            return 0;
        }
        return (b[3] > a[3]) ? -1 : 1;
      });
      ++priorityCount;
    }
    // console.log(data);
    save(data);
    switchIcon(this, priorityCount, allItems);
  });
  sortDefault.addEventListener('click', function(event){
    if(defaultTable.length >= 0){
      
    }
    event.preventDefault();
    save(defaultTable);
    switchIcon(this, priorityCount, allItems);
  });
}

//init
const appInit = () => {
  addBook(get());
  deleteElements();
  sorting();
}

appInit();