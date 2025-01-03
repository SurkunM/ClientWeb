$(document).ready(function () {
    const phoneBookForm = $("#phone-book-form");
    const phoneBookTBody = $("#phone-book-tbody");

    const confirmSingleDeleteDialog = $("#confirm-single-delete-dialog");
    const confirmAllDeleteDialog = $("#confirm-all-delete-dialog");

    const contactLastNameField = $("#phone-book-text-last-name-field");
    const contactFirstNameField = $("#phone-book-text-first-name-field");
    const contactTelField = $("#phone-book-text-tel-field");

    const allDeleteButton = $("#all-delete-button");

    const selectAllItemsCheckbox = $("#phone-book-table-selected-all-checkbox");
    let contactSequenceNumber = 0;


    phoneBookForm.change(function (e) {
        const field = $(e.target);

        field.removeClass("is-invalid");
        field.toggleClass("is-valid", field.val().trim().length > 0);
    });

    selectAllItemsCheckbox.change(function () {
        phoneBookTBody.find(".new-phone-book-item-checkbox").prop("checked", () => {
            if ($(this).prop("checked")) {
                return true;
            }
            else {
                return false;
            }
        }).last().trigger("change");        
    });

    allDeleteButton.click(function () {
        const chekedItems = phoneBookTBody.find(":checked");
        const checkedItemsCountText = confirmAllDeleteDialog.find("#confirm-all-delete-dialog-text");
        checkedItemsCountText.text(`Удалить ${chekedItems.length} записей?`);

        (confirmAllDeleteDialog).dialog({
            resizable: false,
            modal: true,
            buttons: {
                "Да": function () {
                    chekedItems.each((i, e) => {
                        $(e).parent().parent().remove();//другое! $(event.currentTarget).closest(newPhoneBookItem).find(".sequence-number").text();
                        contactSequenceNumber--;
                    });

                    $(".sequence-number").each((i, e) => {
                        if (i === contactSequenceNumber) {
                            return;
                        }

                        $(e).text(++i);
                    });

                   // selectAllItemsCheckbox.prop("checked", false);
                    allDeleteButton.hide();

                    $(this).dialog("close");
                },
                "Нет": function () {
                    $(this).dialog("close");
                }
            }
        });
    })

    phoneBookForm.submit(function (e) {
        e.preventDefault();

        let isValidFormFields = true;

        $(".phone-book-text-field").each((i, element) => {
            if ($(element).val().trim().length === 0) {
                $(element).addClass("is-invalid");

                isValidFormFields = false;
            }

            if (element.id === "phone-book-text-tel-field") {
                $("#tel-error-message").text(() => {
                    if (isNaN(Number(contactTelField.val().trim()))) {
                        contactTelField.addClass("is-invalid");

                        isValidFormFields = false;
                        return "Не верный формат для номера телефона";
                    }

                    return "Заполниие поле номер телефона";
                });
            }
        });

        if (!isValidFormFields) {
            return;
        }

        let contactLastNameText = contactLastNameField.val().trim();
        let contactFirstNameText = contactFirstNameField.val().trim();
        let contactTelText = contactTelField.val().trim();

        const newPhoneBookItem = $("<tr>").addClass(".new-phone-book-item");

        contactSequenceNumber++;

        function setPhoneBookViewMode() {
            newPhoneBookItem.html(`
                    <td class="col"><input class="new-phone-book-item-checkbox" type="checkbox"></td>
                    <td class="sequence-number"></td>
                    <td class="contact-last-name"></td>
                    <td class="contact-first-name"></td>
                    <td class="contact-tel"></td>
                    <td class="d-flex justify-content-center">                        
                        <button class="edit-button ui-button ui-widget ui-corner-all" type="button" title="Button with icon only"><span class="ui-icon ui-icon-pencil">У</span></button>
                        <button class="delete-button ui-button ui-widget ui-corner-all" type="button" title="Button with icon only"><span class="ui-icon ui-icon-trash"></span></button>                       
                    </td>            
            `);

            newPhoneBookItem.find(".sequence-number").text(contactSequenceNumber);
            newPhoneBookItem.find(".contact-last-name").text(contactLastNameText);
            newPhoneBookItem.find(".contact-first-name").text(contactFirstNameText);
            newPhoneBookItem.find(".contact-tel").text(contactTelText);

            

            newPhoneBookItem.find(".new-phone-book-item-checkbox").change(function () {
                if ($(phoneBookTBody).find(":checked").length > 0) {
                    allDeleteButton.show()
                }
                else {
                    allDeleteButton.hide();
                }
                
                if (!$(this).prop("checked")) {
                    selectAllItemsCheckbox.prop("checked", false);
                }
            });         

            newPhoneBookItem.find(".delete-button").click(function () {
                (confirmSingleDeleteDialog).dialog({
                    resizable: false,
                    modal: true,
                    buttons: {
                        "Да": function () {           
                            newPhoneBookItem.remove()
                            contactSequenceNumber--;
                            $(".sequence-number").each((i, e) => {
                                if (i === contactSequenceNumber) {
                                    return;
                                }

                                $(e).text(++i);
                            });

                            newPhoneBookItem.find(".new-phone-book-item-checkbox").trigger("change");// не убирается чек бокс и кнопкв удалить все
                            $(this).dialog("close");
                        },
                        "Нет": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            })
        }

        //_____________________________________________________
        function setViewMode() {
            newTodoItem.html(`
                <div>
                    <span class="todo-text"></span>
                    <div class="todo-list-buttons">
                        <button class="edit-button btn btn-primary" type="button">Редактировать</button>
                        <button class="delete-button btn btn-primary" type="button">Удалить</button>
                    </div>
                </div>
            `);

            //newTodoItem.find(".todo-text").text(contactLastNameText);
            newTodoItem.find(".delete-button").click(function () {
                $(confirmSingleDeleteDialog).dialog({
                    resizable: false,
                    modal: true,
                    buttons: {
                        "Да": function () {
                            newTodoItem.remove()
                            $(this).dialog("close");
                        },
                        "Нет": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            });

            newTodoItem.find(".edit-button").click(function () {
                newTodoItem.html(`
                    <form id="edit-todo-form">
                        <input class="edit-todo-text-field" type="text">
                        <div class="todo-list-buttons">
                            <button class="btn btn-primary" type="submit">Сохранить</button>
                            <button class="cancel-button btn btn-primary" type="button">Отмена</button>
                        </div>
                        <div class="error-message">Необходимо задать значение</div>
                    </form>
                `);

                const editTodoTextField = newTodoItem.find(".edit-todo-text-field");
                editTodoTextField.val(contactLastNameText);

                newTodoItem.find(".cancel-button").click(function () {
                    setViewMode();
                });

                newTodoItem.submit(function (e) {
                    e.preventDefault();
                    const editedTodoText = editTodoTextField.val().trim();

                    if (editedTodoText.length === 0) {
                        editTodoTextField.addClass("invalid");
                        return;
                    }

                    contactLastNameText = editedTodoText;
                    setViewMode();
                });
            });
        }

        setPhoneBookViewMode();

        phoneBookTBody.append(newPhoneBookItem);

        contactLastNameField.val("");
        contactFirstNameField.val("");
        contactTelField.val("");

        $(".phone-book-text-field").removeClass("is-valid");
    });
});