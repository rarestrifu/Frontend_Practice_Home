async function accessLocalStorage() {
    let todosData = localStorage.getItem("todos");
    if(!todosData) {
        const promise = await fetch('https://dummyjson.com/todos?limit=5&skip='+0)
        const json = await promise.json();
        todos = json.todos;
        localStorage.setItem("todos", JSON.stringify(todos)); // stringify <-> parse
    } else {
        todos = JSON.parse(todosData);
    }

    return todos;
}

console.log(accessLocalStorage());