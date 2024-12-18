﻿document.addEventListener("DOMContentLoaded", function () {
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
                    <button class="edit-button btn" type="button">Редактировать</button>
                    <button class="delete-button btn" type="button">Удалить</button>
                </div>
            `;

            newTodoItem.querySelector(".todo-text").textContent = newTodoText;

            newTodoItem.querySelector(".delete-button").addEventListener("click", function () {
                newTodoItem.remove();
            });

            newTodoItem.querySelector(".edit-button").addEventListener("click", function () {
                newTodoItem.innerHTML = `
                    <div>
                        <input class="edit-todo-text-field" type="text">
                        <button class="save-button btn" type="button">Сохранить</button>
                        <button class="cancel-button btn" type="button">Отмена</button>
                    <div class="error-message">Необходимо задать значение</div>
                    </div>
                    `;

                const editTodoTextField = newTodoItem.querySelector(".edit-todo-text-field");
                editTodoTextField.value = newTodoText;

                newTodoItem.querySelector(".cancel-button").addEventListener("click", function () {
                    setViewMode();
                });

                newTodoItem.querySelector(".save-button").addEventListener("click", function () {
                    saveEditedTodoText();
                });

                editTodoTextField.addEventListener("keyup", e => {
                    if (e.code === "Enter") {
                        saveEditedTodoText();
                    }
                });

                function saveEditedTodoText() {
                    const editedTodoText = editTodoTextField.value.trim();

                    if (editedTodoText.length === 0) {
                        editTodoTextField.classList.add("invalid");

                        return;
                    }

                    newTodoText = editedTodoText;
                    setViewMode();
                };
            });
        }

        setViewMode();

        todoList.appendChild(newTodoItem);

        newTodoTextField.value = "";
    });
});