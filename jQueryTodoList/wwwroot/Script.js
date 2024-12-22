$(document).ready(function () {
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
                    <button class="edit-button todo-form-button" type="button">Редактировать</button>
                    <button class="delete-button todo-form-button" type="button">Удалить</button>
                </div>
            `);

            newTodoItem.find(".todo-text").text(newTodoText);

            newTodoItem.find(".delete-button").click(function () {
                newTodoItem.remove();
            });

            newTodoItem.find(".edit-button").click(function () {
                newTodoItem.html(`
                    <div>
                        <input class="edit-todo-text-field" type="text">
                        <button class="save-button todo-form-button" type="button">Сохранить</button>
                        <button class="cancel-button todo-form-button" type="button">Отмена</button>
                    <div class="error-message">Необходимо задать значение</div>
                    </div>
                `);

                const editTodoTextField = newTodoItem.find(".edit-todo-text-field");
                editTodoTextField.val(newTodoText);

                newTodoItem.find(".cancel-button").click(function () {
                    setViewMode();
                });

                newTodoItem.find(".save-button").click(function () {
                    saveEditedTodoText();
                });

                editTodoTextField.keydown(function (e) {
                    if (e.code === "Enter") {
                        saveEditedTodoText();
                    }
                });

                function saveEditedTodoText() {
                    const editedTodoText = editTodoTextField.val().trim();

                    if (editedTodoText.length === 0) {
                        editTodoTextField.addClass("invalid");
                        return;
                    }

                    newTodoText = editedTodoText;
                    setViewMode();
                }
            });
        }

        setViewMode();

        todoList.append(newTodoItem);

        newTodoTextField.val("");
    });
});