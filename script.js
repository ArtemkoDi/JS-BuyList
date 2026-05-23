let items = [];
let nextId = 4;

function loadData() {
    const savedData = localStorage.getItem('buyListData');
    if (savedData) {
        items = JSON.parse(savedData);
        nextId = parseInt(localStorage.getItem('buyListNextId')) || 4;
    } else {
        items = [
            { id: 1, name: "Помідори", qty: 2, bought: true },
            { id: 2, name: "Печиво", qty: 2, bought: false },
            { id: 3, name: "Сир", qty: 1, bought: false }
        ];
    }
}

function saveData() {
    localStorage.setItem('buyListData', JSON.stringify(items));
    localStorage.setItem('buyListNextId', nextId);
}

const form = document.querySelector('.add-form');
const input = document.querySelector('#product-name');
const productList = document.querySelector('.product-list');
const leftTagsList = document.querySelector('.summary-panel:nth-child(1) .tags');
const rightTagsList = document.querySelector('.summary-panel:nth-child(2) .tags');

function render() {
    productList.innerHTML = '';
    leftTagsList.innerHTML = '';
    rightTagsList.innerHTML = '';

    items.forEach(item => {
        
        const li = document.createElement('li');
        li.classList.add('product-row');

        const isMinusDisabled = (item.qty <= 1 || item.bought) ? 'disabled' : '';
        const isPlusDisabled = item.bought ? 'disabled' : '';
        const statusText = item.bought ? 'Не куплено' : 'Куплено';

        const hiddenClass = item.bought ? 'hidden-element' : '';
        const delBtnHtml = !item.bought ? `<button type="button" class="delete-btn" data-id="${item.id}" data-tooltip="Видалити товар">×</button>` : '';

        li.innerHTML = `
            <span class="product-name" data-id="${item.id}"></span>
            <div class="product-qty">
                <button type="button" class="minus-btn ${hiddenClass}" data-id="${item.id}" data-tooltip="Зменшити кількість" ${isMinusDisabled}>-</button>
                <span class="qty-circle">${item.qty}</span>
                <button type="button" class="plus-btn ${hiddenClass}" data-id="${item.id}" data-tooltip="Збільшити кількість" ${isPlusDisabled}>+</button>
            </div>
            <div class="product-actions">
                <button type="button" class="status-btn" data-id="${item.id}" data-tooltip="${item.bought ? 'Скасувати покупку' : 'Позначити як куплене'}">${statusText}</button>
                ${delBtnHtml}
            </div>
        `;

        const nameSpan = li.querySelector('.product-name');
        nameSpan.textContent = item.name;
        
        if (item.bought) {
            nameSpan.classList.add('bought-item');
        }

        productList.appendChild(li);

        const tagLi = document.createElement('li');
        const boughtClassTag = item.bought ? 'bought-item' : '';
        tagLi.innerHTML = `
            <span class="tag-item ${boughtClassTag}">
                <span class="tag-name"></span> <span class="tag-number">${item.qty}</span>
            </span>
        `;
        tagLi.querySelector('.tag-name').textContent = item.name;

        if (item.bought) {
            rightTagsList.appendChild(tagLi);
        } else {
            leftTagsList.appendChild(tagLi);
        }
    });

    saveData();
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const text = input.value.trim();
    if (!text) return;

    items.push({
        id: nextId++,
        name: text,
        qty: 1,
        bought: false
    });

    input.value = '';
    input.focus();
    render();
});

productList.addEventListener('click', (event) => {
    const target = event.target;
    
    if (!target.dataset.id) return;
    
    const id = Number(target.dataset.id);
    const item = items.find(i => i.id === id);
    
    if (!item) return;

    if (target.classList.contains('delete-btn')) {
        items = items.filter(i => i.id !== id);
        render();
    } 

    else if (target.classList.contains('plus-btn')) {
        if (!item.bought) {
            item.qty++;
            render();
        }
    } 

    else if (target.classList.contains('minus-btn')) {
        if (!item.bought && item.qty > 1) {
            item.qty--;
            render();
        }
    } 

    else if (target.classList.contains('status-btn')) {
        item.bought = !item.bought;
        render();
    } 

    else if (target.classList.contains('product-name') && !item.bought) {
        if (target.querySelector('input')) return;

        const inputEdit = document.createElement('input');
        inputEdit.type = 'text';
        inputEdit.classList.add('edit-field');
        inputEdit.value = item.name;

        target.textContent = '';
        target.appendChild(inputEdit);
        inputEdit.focus();

        const saveEdit = () => {
            const newName = inputEdit.value.trim();
            if (newName) {
                item.name = newName;
            }
            render();
        };

        inputEdit.addEventListener('blur', saveEdit);
        inputEdit.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    }
});

loadData();
render();
