//cand dam load inital browser-ului
window.onload = function() {
    window.showCompleted = true;
    window.todos = _loadData();
    _loadExternalData();
}

//folosit pentru a genera list cu todo-uri
function _renderToDoList() {
    const todos = window.todos;
    for(let i = 0; i<todos.length; i++){
        const item = todos[i];
        item.id = _generateNextId();
        _renderToDoItem(item);
    }
    _updateListUi();
}

//placeholder-ul este folosit pentru a pune toate todo-urile inauntru, adica div-urile
function _renderPlaceholderText(text){
    const placeholder = document.createElement('span');
    placeholder.id = 'placeholder';
    placeholder.style.display = 'none';
    _getTodoList().appendChild(placeholder); //lista va deveni ultimu copil al placeholder-ului
}

function _generateNextId() {
    window.nextId = window.nextId ? window.nextId + 1 : 1;
    return window.nextId;
}

function _updateListUi() {
    document.getElementById('button-add').disabled = _getInputElement().value.length === 0;
    let listHasElements = window.todos.length > 0;
    document.getElementById('button-remove-all').disabled = !listHasElements;
    _updatePlaceholderText();
    for(let  i = 0; i < window.todos.length; i++){
        const todo = window.todos[i];
        const uiItem = _findUiItem(todo.id);
        if(window.showCompleted){
            uiItem.style.display = '';
        } else if(todo.completed){
            uiItem.style.display = 'none';
        }
    }  
}

function _shouldDisplayPlaceholder() {
    if(window.todos.length === 0){
        return true;
    }
    const activeItem = window.todos.find(function(item) {
        if(!item.completed) {
            return item;
        }
    })
    if(!activeItem && !window.showCompleted){
        return true;
    }else{
        return false;
    }
}

async function _updatePlaceholderText(){
    const placeholder = document.getElementById("placeholder");
    placeholder.style.display = _shouldDisplayPlaceholder() ? ' ' : 'none';
}

function _renderToDoItem(itemModel) {

    const item = document.createElement('div'); //div ul principal, adica container ul din span
    item.classList.add("item");
    if(itemModel.completed) {
        item.classList.add("is-completed");
    }

    const container = document.createElement('div');
    container.id = "container";

    const check = document.createElement('input'); //check-ul din stanga
    check.type = "checkbox";
    check.checked = itemModel.completed;
    check.onclick = function() {
        updateItemState(itemModel.id); //schimbam culoarea in functie de starea (bifat sau nu) todo-ului
    }

    container.appendChild(check);

    const itemText = document.createElement('span');
    itemText.innerText = itemModel.todo;
    container.appendChild(itemText);
    item.appendChild(container);
    item.setAttribute('data-id', itemModel.id);

    const deleteTask = document.createElement('button');
    deleteTask.id = "delete-button";
    deleteTask.innerText = "-";
    container.appendChild(deleteTask);

    //deletion of a single element in the list
    deleteTask.onclick = () => {
        const todoList = _getTodoList();
        console.log(todoList);
        todoList.removeChild(_findUiItem(item.id));
        _updateListUi();
    }
    
    _getTodoList().appendChild(item);
    
}

async function _loadExternalData() {
    deleteAllItems();
    window.todos = await _fetchData();
    _renderToDoList();
}

async function _fetchData() {
    const response = await fetch('https://dummyjson.com/todos?limit=5&skip='+0);
    const json = await response.json();
    return json.todos;
}

function updateItemState(itemId) {
    const item = window.todos.find(function(item) {
        return item.id === itemId;
    });

    item.completed = !item.completed;
    const uiItem = _findUiItem(item.id);
    if(item.completed){
        uiItem.classList.add("is-completed");
    } else {
        uiItem.classList.remove("is-completed");
    }

    _updateListUi();
}

function inputChange(e) {
    if(e.key === "Enter") {
        createNewToDoItem();
    }
     document.getElementById("button-add").disabled = _getInputElement().value.length === 0;
   
}

//aici vom crea un nou element todo
function createNewToDoItem() {
    const itemText = _getInputElement().value;
    const newItem = _createNewModelItem(itemText, false);
    window.todos.push(newItem);
    _getInputElement().value = "";
    _renderToDoItem(newItem);
    _updateListUi();
}

//if we wanna show or not the todo list
function toggleShow() {
    window.showCompleted = !window.showCompleted;
    document.getElementById("toggle-show").innerText = window.showCompleted ? "Hide" : "Show";
    _updateListUi();
}

//delete all items
function deleteAllItems() {
    const todoList = _getTodoList();
    while(window.todos.length>0){
        const itemModel = window.todos.pop();
        todoList.removeChild(_findUiItem(itemModel.id));
    }
    _renderToDoList();
}

//luam input element-ul, adica, in cazul nostru, unde introducem noul todo
function _getInputElement() {
    return document.getElementById('todo-text-input');
}

//cand dam loadData initial
function _loadData() {
    const data = [];
    return data;
}

//aici returnam toata lista de todo-uri
function _getTodoList() {
    return document.getElementById("todo-list");
}

//aici cream un model nou de item, adica doar un template, doar dupa ii dam render in div
function _createNewModelItem(itemText, itemCompleted) {
    const newItem = {
        id: _generateNextId(),
        todo: itemText,
        completed: itemCompleted
    };
    return newItem;
}

function _findUiItem(itemId) {
    return document.querySelector('div[data-id="'+itemId+'"]');
}
