document.addEventListener("DOMContentLoaded", function () {
    const todoList = document.getElementById("todo-list");
    const newTodoForm = document.getElementById("new-todo-form");
    const newTodoTextField = document.getElementById("new-todo-text-field");

    newTodoForm.addEventListener("submit", function (e) {
        e.preventDefault();

       newTodoTextField.classList.remove("invalid");


        const newTodoText = newTodoTextField.value.trim();

        if (newTodoText.length === 0) {
            newTodoTextField.classList.add("invalid");
            return;
        }

        const newTodoItem = document.createElement("li");
        newTodoItem.innerHTML = `
        <div>
            <span class="todo-text"></span>
                <button class="edit-button" type="button">Редактировать</button>
                <button class="delete-button" type="button">Удалить</button>
        </div>
        `;

        newTodoItem.querySelector(".todo-text").textContent = newTodoText;

        todoList.appendChild(newTodoItem);
    })
})