$(document).ready(function () {
    "use strict";

    const phoneBookForm = $("#phone-book-form");
    const phoneBookTBody = $("#phone-book-tbody");

    const confirmSingleDeleteDialog = $("#confirm-single-delete-dialog");
    const confirmAllDeleteDialog = $("#confirm-all-delete-dialog");

    const contactLastNameField = $("#phone-book-text-last-name-field");
    const contactFirstNameField = $("#phone-book-text-first-name-field");
    const contactTelField = $("#phone-book-text-tel-field");

    const searchField = $("#phone-book-search-field");
    const searchFieldSearchButton = $("#phone-book-search-button");
    const searchFieldClearButton = $("#phone-book-clear-button");

    const selectAllItemsCheckbox = $("#phone-book-table-selected-all-checkbox");
    const allDeleteButton = $("#all-delete-button");

    let contactSequenceNumber = 0;
    let isSearchModeActive = false;

    phoneBookForm.change(function (e) {
        const field = $(e.target);

        field.removeClass("is-invalid");
        field.toggleClass("is-valid", field.val().trim().length > 0);
    });

    function getSearchItemFields(fields, searchText) {
        fields.each((i, e) => {
            if ($(e).text().toLocaleLowerCase().indexOf(searchText.toLocaleLowerCase()) >= 0) {
                $(e).closest("tr").show();
            }
        });
    }

    searchFieldSearchButton.click(function () {
        isSearchModeActive = true;
        const searchText = searchField.val().trim();

        phoneBookTBody.find("tr").each((i, e) => {
            $(e).hide();
        });

        selectAllItemsCheckbox.triggerHandler("change");

        getSearchItemFields(phoneBookTBody.find(".contact-last-name"), searchText);
        getSearchItemFields(phoneBookTBody.find(".contact-first-name"), searchText);
        getSearchItemFields(phoneBookTBody.find(".contact-tel"), searchText);
    });

    searchFieldClearButton.click(function () {
        phoneBookTBody.find("tr").each((i, e) => {
            $(e).show();
        });

        isSearchModeActive = false;
        searchField.val("")
    });


    selectAllItemsCheckbox.change(function () {
        phoneBookTBody.find(".new-phone-book-item-checkbox").each((i, e) => {
            if ($(this).prop("checked") && $(e).is(":visible")) {
                $(e).prop("checked", true);
            }
            else {
                $(e).prop("checked", false);
            }
        }).last().trigger("change");
    });

    allDeleteButton.click(function () {
        const checkedItems = phoneBookTBody.find(":checked");
        const checkedItemsCountText = confirmAllDeleteDialog.find("#confirm-all-delete-dialog-text");
        checkedItemsCountText.text(`Удалить ${checkedItems.length} записей?`);

        (confirmAllDeleteDialog).dialog({
            resizable: false,
            modal: true,
            buttons: {
                "Да": function () {
                    checkedItems.each((i, e) => {
                        $(e).closest("tr").remove();
                        contactSequenceNumber--;
                    });

                    $(".sequence-number").each((i, e) => {
                        if (i === contactSequenceNumber) {
                            return;
                        }

                        $(e).text(++i);
                    });

                    selectAllItemsCheckbox.prop("checked", false);
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

        function checkFormFieldsValid() {
            let isValidFormFields = true;
            
            $(".phone-book-text-field").each((i, element) => {

                if ($(element).val().trim().length === 0) {
                    $(element).addClass("is-invalid");

                    isValidFormFields = false;
                }

                if (element.id === "phone-book-text-tel-field") {
                    const telFieldErrorMessage = $("#tel-error-message").text("");
                    const contactNumberText = contactTelField.val().trim();

                    if (isNaN(Number(contactNumberText))) {
                        contactTelField.addClass("is-invalid");
                        isValidFormFields = false;

                        telFieldErrorMessage.text("Не верный формат номера телефона");
                    }
                    else if (!isValidFormFields) {
                        telFieldErrorMessage.text("Заполните поле номер телефона");
                    }
                    else {
                        phoneBookTBody.find(".contact-tel").each((i, e) => {
                            if ($(e).text() === contactNumberText) {
                                contactTelField.addClass("is-invalid");
                                isValidFormFields = false;

                                telFieldErrorMessage.text("Номер уже существует");
                            }
                        });
                    }
                }
            });

            return isValidFormFields
        }

        if (!checkFormFieldsValid()) {
            return
        }

        const newPhoneBookItem = $("<tr>").addClass(".new-phone-book-item");
        contactSequenceNumber++;

        if (isSearchModeActive) {
            newPhoneBookItem.hide();
        }

        function setPhoneBookViewMode() {
            newPhoneBookItem.html(`
                    <td class="col">
                        <label class="d-flex justify-content-center">
                            <input class="new-phone-book-item-checkbox form-check-input" type="checkbox">
                        </label>
                    </td>
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
            newPhoneBookItem.find(".contact-last-name").text(contactLastNameField.val().trim());
            newPhoneBookItem.find(".contact-first-name").text(contactFirstNameField.val().trim());
            newPhoneBookItem.find(".contact-tel").text(contactTelField.val().trim());

            newPhoneBookItem.find(".new-phone-book-item-checkbox").change(function () {
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

                            if (contactSequenceNumber === 0) {
                                selectAllItemsCheckbox.prop("checked", false);
                            }

                            $(this).dialog("close");
                        },
                        "Нет": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            })

            newPhoneBookItem.find(".edit-button").click(function (e) {
                const editButton = $(this).prop("disabled", true);
                const phoneBookButtons = phoneBookForm.find(".phone-book-form-buttons ");

                const newContactLastName = newPhoneBookItem.find(".contact-last-name");
                const newContactFirstName = newPhoneBookItem.find(".contact-first-name");
                const newContactTel = newPhoneBookItem.find(".contact-tel");

                phoneBookForm.find(".current-form-action-text ").text("Редактирование контакта");
                phoneBookForm.find(".new-contact-add-button").hide();

                $("<button>")
                    .addClass("save-button ui-button ui-widget ui-corner-all")
                    .prop("type", "button").text("Сохранить")
                    .appendTo(phoneBookButtons)
                    .click(function () {
                        if (checkFormFieldsValid()) {
                            this.remove();
                            phoneBookButtons.find(".cancel-button").remove()

                            newContactLastName.text(contactLastNameField.val());
                            newContactFirstName.text(contactFirstNameField.val());
                            newContactTel.text(contactTelField.val());

                            phoneBookForm.find(".current-form-action-text ").text("Создание нового контакта");
                            phoneBookForm.find(".new-contact-add-button").show();

                            clearFormFields();
                            $(".phone-book-text-field").trigger("change");
                            editButton.prop("disabled", false);
                        }
                    });

                $("<button>")
                    .addClass("cancel-button ui-button ui-widget ui-corner-all")
                    .prop("type", "button").text("Отменить")
                    .appendTo(phoneBookButtons)
                    .click(function () {
                        this.remove();
                        phoneBookButtons.find(".save-button").remove()
                        phoneBookForm.find(".current-form-action-text ").text("Создание нового контакта");
                        phoneBookForm.find(".new-contact-add-button").show();

                        newContactLastName.text(contactLastNameField.val());
                        newContactFirstName.text(contactFirstNameField.val());
                        newContactTel.text(contactTelField.val());

                        clearFormFields();
                        $(".phone-book-text-field").trigger("change");
                        editButton.prop("disabled", false);
                    });

                contactLastNameField.val(newContactLastName.text());
                contactFirstNameField.val(newContactFirstName.text());
                contactTelField.val(newContactTel.text());

                newContactLastName.text("")
                newContactFirstName.text("")
                newContactTel.text("")

                $(".phone-book-text-field").trigger("change");
            });
        }

        function clearFormFields() {
            contactLastNameField.val("");
            contactFirstNameField.val("");
            contactTelField.val("");

            $(".phone-book-text-field").removeClass("is-valid");
        }

        setPhoneBookViewMode();

        phoneBookTBody.append(newPhoneBookItem);
        clearFormFields();
    });
});