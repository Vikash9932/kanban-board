const modalContainer = document.querySelector('.modal_container');
const addButton = document.querySelector('.add');
const textArea = document.querySelector('.text_area');
const mainContainer = document.querySelector('.main_container');
const categories = document.querySelectorAll('.category');
const filterItems = document.querySelectorAll('.filter_item');
const deleteButton = document.querySelector('.remove');

let categorySelected = 'pink';
let isModalVisible = false;
let isDeleteActive = false;
let selectedFilter;
const colors = ['pink', 'lightGreen', 'teal', 'black'];
let ticketsArr = [];

function saveData() {
  localStorage.setItem('tickets', JSON.stringify(ticketsArr));
}

addButton.addEventListener('click', () => {
  isModalVisible = !isModalVisible;
  if (isModalVisible) {
    modalContainer.style.display = 'flex';
  } else {
    modalContainer.style.display = 'none';
  }
});

deleteButton.addEventListener('click', () => {
  isDeleteActive = !isDeleteActive;
  if (isDeleteActive) {
    deleteButton.classList.add('red');
    alert('delete button activated');
  } else {
    deleteButton.classList.remove('red');
  }
});

const createTask = (text, color, ticket_id) => {
  const div = document.createElement('div');
  div.classList.add('ticket_container');
  div.innerHTML = `<div class="ticket_color ${color}"></div>
        <div class="ticket_id">${ticket_id}</div>
        <div class="ticket_taskarea">${text}</div>
        <div class="ticket_lock"><i class="fa-solid fa-lock"></i>
        </div>`;
  mainContainer.appendChild(div);
  changeColor(div);
  handleLock(div);
  handleDelete(div);
};

modalContainer.addEventListener('keydown', (e) => {
  if (e.key == 'Enter') {
    const id = (Math.random() * 100000).toFixed(0);
    createTask(textArea.value, categorySelected, id);
    ticketsArr.push({ color: categorySelected, id, text: textArea.value });
    saveData();
    modalContainer.style.display = 'none';
    isModalVisible = false;
    textArea.value = '';
  }
});

for (let i = 0; i < categories.length; i++) {
  categories[i].addEventListener('click', (e) => {
    categories.forEach((elem) => elem.classList.remove('active'));
    categorySelected = categories[i].classList[1];
    categories[i].classList.add('active');
  });
}

mainContainer.addEventListener('click', (e) => {
  if (isDeleteActive) {
    e.target.parentElement.remove();
  }
});

filterItems.forEach((filterItem) => {
  filterItem.addEventListener('click', (e) => {
    selectedFilter = e.target.classList[1];
    const allTickets = document.querySelectorAll('.ticket_container');
    allTickets.forEach((ticket) => {
      const ticketColor = ticket.querySelector('.ticket_color');
      if (ticketColor.classList[1] == selectedFilter) {
        ticket.style.display = 'block';
      } else {
        ticket.style.display = 'none';
      }
    });
  });
  filterItem.addEventListener('dblclick', (e) => {
    selectedFilter = e.target.classList[1];
    const allTickets = document.querySelectorAll('.ticket_container');
    allTickets.forEach((ticket) => {
      ticket.style.display = 'block';
    });
  });
});

function changeColor(ticketContainer) {
  const ticketColor = ticketContainer.querySelector('.ticket_color');
  const ticketId = ticketContainer.querySelector('.ticket_id').innerText;
  ticketColor.addEventListener('click', () => {
    let ticketIndex = findIndex(ticketId);
    const currentColor = ticketColor.classList[1];
    const currentColorIndex = colors.indexOf(currentColor);
    const colorIndex = (currentColorIndex + 1) % colors.length;
    ticketColor.classList.remove(currentColor);
    ticketsArr[ticketIndex].color = colors[colorIndex];
    saveData();
    ticketColor.classList.add(colors[colorIndex]);
  });
}

function handleLock(ticketContainer) {
  const ticketLock = ticketContainer.querySelector('.fa-solid');
  const ticketId = ticketContainer.querySelector('.ticket_id').innerText;
  ticketLock.addEventListener('click', () => {
    let ticketIndex = findIndex(ticketId);
    const taskArea = ticketContainer.querySelector('.ticket_taskarea');
    if (ticketLock.classList[1] == 'fa-lock') {
      ticketLock.classList.remove('fa-lock');
      ticketLock.classList.add('fa-lock-open');
      taskArea.setAttribute('contenteditable', true);
    } else {
      ticketLock.classList.remove('fa-lock-open');
      ticketLock.classList.add('fa-lock');
      taskArea.setAttribute('contenteditable', false);
    }
    ticketsArr[ticketIndex].text = taskArea.innerText;
    saveData();
  });
}

function handleDelete(ticket) {
  ticket.addEventListener('click', () => {
    if (isDeleteActive) {
      let deletedId = ticket.querySelector('.ticket_id');
      ticketsArr = ticketsArr.filter((tck) => tck.id != deletedId.innerText);
      saveData();
      ticket.remove();
      return;
    }
  });
}

function findIndex(id) {
  return ticketsArr.findIndex((ticket) => ticket.id == id);
}

(function init() {
  ticketsArr = JSON.parse(localStorage.getItem('tickets')) || [];
  ticketsArr &&
    ticketsArr.forEach((ticket) => {
      const { color, id, text } = ticket;
      createTask(text, color, id);
    });
})();
