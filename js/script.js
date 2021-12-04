// import swal from 'sweetalert';

// Selectors
const submitButton = document.getElementById("submit");
const priority = document.getElementById("priority");
const table = document.getElementById("tableBody");

let counter = 0;
const addBook = (data) => {
  counter++;
  let html = '';
  table.innerHTML= '';
  for(let row of data){
    html += `
      <tr class="carWrapper" id="${counter}">
        <td valign="center" class="table-element col-3 col-sm-3" id="title">${row[0]}</td>
        <td valign="center" class="table-element col-3 col-sm-3" id="author">${row[1]}</td>
        <td valign="center" class="table-element col-3 col-sm-3" id="priority">${row[2]}</td>
        <td valign="center" class="table-element col-3 col-sm-3" id="category">${row[3]}</td>
      </tr> 
    `
  }
  table.insertAdjacentHTML('beforeend', html);
}

submitButton.addEventListener('click', function (event) {
  event.preventDefault();
  let title = this.parentNode.parentNode[0].value;
  let author = this.parentNode.parentNode[1].value;
  let priority = this.parentNode.parentNode[2].value;
  let category = this.parentNode.parentNode[3].value;
  if (
    title.length >= 1 && !/[^a-zA-Z0-9]/.test(title) &&
    author.length >= 3 && !/[^a-zA-Z]/.test(author) &&
    priority.length === 1
  ) {
    //adding row after validation
    addRow(title,author,priority,category)
    //clearing inputs
    document.getElementById("bookForm").reset();
  }
  else if(!(title.length >= 1 && !/[^a-zA-Z0-9]/.test(title))){
    swal("tytuł musi składać się z przynajmniej 1 litery lub cyfer, bez znaków specjalnych")
  }
  else if(!(author.length >= 3 && !/[^a-zA-Z]/.test(author))){
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
const addRow = (title,author,priority,category) => {
  let rows = get();
  rows.push([title,author,priority,category])
  save(rows)
}

// get localStorage data
const get = () => {
  let rows = localStorage.getItem('table')
  if (!rows) {
    return []
  }
  return JSON.parse(rows)
}

// saving changes
const save = data => {
  localStorage.setItem('table', JSON.stringify(data))
  addBook(data);
}

const appInit = () => {
  addBook(get());
}

appInit();