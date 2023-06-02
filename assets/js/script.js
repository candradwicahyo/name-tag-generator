window.addEventListener('DOMContentLoaded', () => {
  
  let items = [];
  
  const content = document.querySelector('.content');
  const input = document.querySelector('.input');
  const buttonSubmit = document.querySelector('.button-submit');
  buttonSubmit.addEventListener('click', addItem);
  
  function addItem(event) {
    event.preventDefault();
    if (event.target.dataset.type.toLowerCase().includes('add')) {
      const value = input.value.trim();
      const data = {value: value};
      if (validate(value)) {
        if (isItemExist(value)) return alerts('error', 'Name Tag is already exist!');
        items.unshift(data);
        setLocalstorage('item', items);
        alerts('success', 'Item has been added!');
        showData();
        clear();
      }
    }
  }
  
  function validate(value) {
    if (!value) return alerts('error', 'Input is empty!');
    if (value.length > 20) return alerts('error', 'Your name must be no more than 20 character');
    if (value.match(/[0-9]/gi)) return alerts('error', 'Name should be letters!');
    return true;
  }
  
  function isItemExist(value) {
    let exist = false;
    items.forEach(item => {
      if (item.value.toLowerCase() === value.toLowerCase()) exist = true;
    });
    return exist;
  }
  
  function setLocalstorage(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
  }
  
  function showElement(data, index) {
    const result = renderElement(data, index);
    content.insertAdjacentHTML('beforeend', result);
  }
  
  function showData() {
    content.innerHTML = '';
    const data = localStorage.getItem('item');
    items = (data) ? JSON.parse(data) : [];
    items.forEach((item, index) => showElement(item, index));
  }
  
  showData();
  
  function renderElement(data, index) {
    return `
      <div class="content-wrapper">
        <div class="box">
          <span class="close-button button-delete" data-index="${index}">×</span>
          <h3>Hi, my name is</h3>
          <h6>${data.value}</h6>
          <div class="button-wrapper">
            <button class="button button-blue button-edit" data-index="${index}">Edit</button>
            <button class="button button-red button-delete" data-index="${index}">Delete</button>
          </div>
        </div>
      </div>
    `;
  }
  
  function alerts(icon, text) {
    swal.fire ({
      icon: icon,
      title: 'alert',
      text: text
    });
  }
  
  function clear() {
    const forms = document.querySelectorAll('.form');
    forms.forEach(form => form.reset());
  }
  
  window.addEventListener('click', event => {
    if (event.target.classList.contains('button-delete')) {
      const index = event.target.dataset.index;
      deleteItem(index);
    }
  });
  
  function deleteItem(index) {
    swal.fire ({
      icon: 'info',
      title: 'are you sure?',
      text: 'do you want to delete this item?',
      showCancelButton: true
    })
    .then(response => {
      if (response.isConfirmed) {
        items.splice(index, 1);
        setLocalstorage('item', items);
        alerts('success', 'Item has been deleted!');
        showData();
      }
    });
  }
  
  window.addEventListener('click', event => {
    if (event.target.classList.contains('button-edit')) {
      buttonSubmit.setAttribute('data-type', 'edit');
      const index = event.target.dataset.index;
      input.value = items[index].value;
      editItem(index);
    }
  });
  
  function editItem(index) {
    buttonSubmit.addEventListener('click', function(event) {
      event.preventDefault();
      if (this.dataset.type.toLowerCase().includes('edit')) {
        const value = input.value.trim();
        const data = {value: value};
        if (validate(value)) {
        if (isItemExist(value)) return alerts('error', 'Name Tag is already exist!');
          items[index].value = value;
          setLocalstorage('item', items);
          alerts('success', 'Item has been updated!');
          showData();
          clear();
          this.setAttribute('data-type', 'add');
          index = null;
        }
      }
    });
  }
  
});