$(document).ready(function () {
    "use strict";

    const todoList = $("#todo-list");
    const newTodoTextField = $("#new-todo-text-field");
    const newTodoForm = $("#new-todo-form");

    newTodoForm.submit(function (e) {
        e.preventDefault();

        newTodoTextField.removeClass("invalid");

        let newTodoText = newTodoTextField.val().trim();

        if (newTodoText.length === 0) {
            newTodoTextField.addClass("invalid");
            return;
        }

        const newTodoItem = $("<li>");

        function setViewMode() {
            newTodoItem.html(`
                <div>
                    <span class="todo-text"></span>
                    <div class="todo-list-buttons">
                        <button class="edit-button todo-form-button" type="button">Редактировать</button>
                        <button class="delete-button todo-form-button" type="button">Удалить</button>
                    </div>
                </div>
            `);

            newTodoItem.find(".todo-text").text(newTodoText);

            newTodoItem.find(".delete-button").click(function () {
                newTodoItem.remove();
            });

            newTodoItem.find(".edit-button").click(function () {
                newTodoItem.html(`
                    <form class="edit-todo-form">
                        <div>
                            <input class="edit-todo-text-field" type="text">
                            <div class="todo-list-buttons">
                                <button class="todo-form-button" type="submit">Сохранить</button>
                                <button class="cancel-button todo-form-button" type="button">Отмена</button>
                            </div>
                            <div class="error-message">Необходимо задать значение</div>
                        </div>
                    </form>
                `);

                const editTodoTextField = newTodoItem.find(".edit-todo-text-field");
                editTodoTextField.val(newTodoText);

                newTodoItem.find(".cancel-button").click(function () {
                    setViewMode();
                });

                newTodoItem.find(".edit-todo-form").submit(function (e) {
                    e.preventDefault();

                    const editedTodoText = editTodoTextField.val().trim();

                    if (editedTodoText.length === 0) {
                        editTodoTextField.addClass("invalid");
                        return;
                    }

                    newTodoText = editedTodoText;
                    setViewMode();
                });
            });
        }

        setViewMode();

        todoList.append(newTodoItem);

        newTodoTextField.val("");
    });
});