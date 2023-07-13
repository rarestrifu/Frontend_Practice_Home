

const todos = [
    {title: 'todo1'},
    {title: "todo2"}
];

function displayTodos(todos) {
    setTimeout(()=>{
        let output = "";
        todos.forEach(todo => {
            output += `<li>${todo.todo}</li>`;
        });
        document.getElementById('output').innerHTML = output;
    }, 2000);
}

const createTodo = () => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{  
            let err = false;
            if(!err){
                todos.push({title: 'todo3'});
            resolve();
            } else {
                reject("error");
            }
        }, 3000);
    })
};

async function loadResponse() {
    try{
    console.log("starting");
    const promise = await fetch('https://dummyjson.com/todos?limit=5&skip='+0)
    const json = await promise.json();
    displayTodos(json.todos);
    } catch(err){
        console.log(err);
    } finally {

    }
    // .then(res=> res.json())
    // .then(data=>displayTodos(data.todos))

    // .then(()=> fetch("https://dummyjson.com/todos?limit=5&skip=" + 5) )
    // .then(res => res.json())
    // .then(data => console.log(data.todos))
    // .catch(err => {
    //     console.log(err);
    // })
}

document.getElementById('output').innerHTML = "Loading";

createTodo()
        .catch(err => console.log(err));  
loadResponse();

