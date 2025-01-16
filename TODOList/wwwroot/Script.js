document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const todoList = document.getElementById("todo-list");
    const newTodoTextField = document.getElementById("new-todo-text-field");
    const newTodoForm = document.getElementById("new-todo-form");

    newTodoForm.addEventListener("submit", function (e) {
        e.preventDefault();

        newTodoTextField.classList.remove("invalid");

        let newTodoText = newTodoTextField.value.trim();

        if (newTodoText.length === 0) {
            newTodoTextField.classList.add("invalid");
            return;
        }

        const newTodoItem = document.createElement("li");

        function setViewMode() {
            newTodoItem.innerHTML = `
                <div>
                    <span class="todo-text"></span>
                    <div class="todo-list-buttons">
                        <button class="edit-button todo-form-button" type="button">Редактировать</button>
                        <button class="delete-button todo-form-button" type="button">Удалить</button>
                    </div>
                </div>
            `;

            newTodoItem.querySelector(".todo-text").textContent = newTodoText;

            newTodoItem.querySelector(".delete-button").addEventListener("click", function () {
                newTodoItem.remove();
            });

            newTodoItem.querySelector(".edit-button").addEventListener("click", function () {
                newTodoItem.innerHTML = `
                    <form class="edit-button-form">
                        <div>
                            <input class="edit-todo-text-field" type="text"> 
                            <div class="todo-list-buttons">
                                <button class="todo-form-button" type="submit">Сохранить</button>
                                <button class="cancel-button todo-form-button" type="button">Отмена</button>
                            </div>
                            <div class="error-message">Необходимо задать значение</div>
                        </div>
                    </form>
                `;

                const editTodoTextField = newTodoItem.querySelector(".edit-todo-text-field");
                editTodoTextField.value = newTodoText;

                newTodoItem.querySelector(".cancel-button").addEventListener("click", function () {
                    setViewMode();
                });

                newTodoItem.querySelector(".edit-button-form").addEventListener("submit", function (e) {
                    e.preventDefault();

                    const editedTodoText = editTodoTextField.value.trim();

                    if (editedTodoText.length === 0) {
                        editTodoTextField.classList.add("invalid");
                        return;
                    }

                    newTodoText = editedTodoText;
                    setViewMode();
                });
            });
        }

        setViewMode();

        todoList.appendChild(newTodoItem);

        newTodoTextField.value = "";
    });
});