"use strict";

let contacts = [];

$(document).ready(function () {
    const phoneBookForm = $("#phone-book-form");
    const phoneBookTBody = $("#phone-book-tbody");

    const contactFirstNameField = $("#phone-book-text-first-name-field");
    const contactLastNameField = $("#phone-book-text-last-name-field");
    const contactPhoneField = $("#phone-book-text-phone-field");

    const confirmSingleDeleteDialog = $("#confirm-single-delete-dialog");
    const confirmAllSelectedDeleteDialog = $("#confirm-all-selected-delete-dialog");

    const searchField = $("#phone-book-search-field");
    const searchResultText = $("#phone-book-search-result-text");
    const searchForm = $("#phone-book-search-form");

    const selectAllItemsCheckbox = $("#phone-book-table-selected-all-checkbox");

    let isSearchModeActive = false;
    let itemIndex = 0;

    phoneBookForm.change(function (e) {
        const field = $(e.target);

        field.removeClass("is-invalid");
        field.toggleClass("is-valid", field.val().trim().length > 0);
    });

    searchForm.submit(function (e) {
        e.preventDefault();

        const searchText = searchField.val().trim().toLocaleLowerCase();

        if (searchText.length === 0) {            
            return;
        }

        isSearchModeActive = true;
        let findItemsCount = 0;

        phoneBookTBody.find("tr")
            .filter((i, e) => $(e).is(":visible"))
            .each((i, e) => $(e).hide());

        selectAllItemsCheckbox.triggerHandler("change");

        contacts
            .filter(c => c.firstNameElement.text().toLocaleLowerCase().indexOf(searchText) >= 0 ||
                c.lastNameElement.text().toLocaleLowerCase().indexOf(searchText) >= 0 ||
                c.phoneElement.text().toLocaleLowerCase().indexOf(searchText) >= 0)
            .forEach(c => {
                c.idElement.closest("tr").show();
                findItemsCount++;
            });


        searchResultText.text(`Найдено: ${findItemsCount}`);
    });

    $("#phone-book-clear-button").click(function () {
        contacts
            .filter(c => c.idElement.is(":hidden"))
            .forEach(c => c.idElement.closest("tr").show());

        isSearchModeActive = false;
        searchResultText.text("");
        searchField.val("")
    });


    selectAllItemsCheckbox.change(function () {
        contacts.forEach(c => {
            if ($(this).prop("checked") && c.idElement.is(":visible")) {
                $(c.isCheckedElement).prop("checked", true);
            }
            else {
                $(c.isCheckedElement).prop("checked", false);
            }
        });
    });

    $("#all-selected-delete-button").click(function () {
        const checkedItemsCount = phoneBookTBody.find(":checked").length;

        const checkedItemsCountText = confirmAllSelectedDeleteDialog.find("#confirm-all-selected-delete-dialog-text");
        checkedItemsCountText.text(`Удалить ${checkedItemsCount} записей?`);

        (confirmAllSelectedDeleteDialog).dialog({
            resizable: false,
            modal: true,
            buttons: {
                "Да": function () {
                    contacts
                        .filter(c => c.isCheckedElement.prop("checked"))
                        .forEach(c => {
                            c.idElement.closest("tr").remove();
                            itemIndex--;
                        });

                    contacts = contacts.filter(c => !c.isCheckedElement.prop("checked"));

                    contacts.forEach((c, i) => {
                        c.idElement.text(++i);
                    });

                    if (isSearchModeActive) {
                        searchForm.triggerHandler("submit");
                    }

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
            const phoneFieldErrorMessage = $("#phone-error-message").text("");

            if (contactFirstNameField.val().trim().length === 0) {
                $(contactFirstNameField).addClass("is-invalid");
                return false;
            }

            if (contactLastNameField.val().trim().length === 0) {
                $(contactLastNameField).addClass("is-invalid");
                return false;
            }

            if (contactPhoneField.val().trim().length === 0) {
                phoneFieldErrorMessage.text("Заполните поле номер телефона");
                $(contactPhoneField).addClass("is-invalid");
                return false;
            }

            if (isNaN(Number(contactPhoneField.val().trim()))) {
                phoneFieldErrorMessage.text("Не верный формат номера телефона");
                contactPhoneField.addClass("is-invalid");
                return false;
            }

            return true;
        }

        function checkExistPhone(index, contactPhoneText) {
            if (contacts.some(c => c.phoneElement.text() === contactPhoneText && c.idElement.text() !== index)) {
                contactPhoneField.addClass("is-invalid");
                $("#phone-error-message").text("Номер уже существует");
                return false;
            }

            return true;
        }

        if (!checkFormFieldsValid() || !checkExistPhone(itemIndex, contactPhoneField.val().trim())) {
            return
        }

        const newPhoneBookItem = $("<tr>").addClass(".new-phone-book-item");

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
                    <td class="contact-index"></td>
                    <td class="contact-last-name"></td>
                    <td class="contact-first-name"></td>
                    <td class="contact-phone"></td>
                    <td>                        
                        <button class="edit-button ui-button ui-widget ui-corner-all" type="button" title="Button with icon only"><span class="ui-icon ui-icon-pencil">У</span></button>
                        <button class="delete-button ui-button ui-widget ui-corner-all" type="button" title="Button with icon only"><span class="ui-icon ui-icon-trash"></span></button>                       
                    </td>                     
            `);

            contacts.push({
                idElement: newPhoneBookItem.find(".contact-index"),
                isCheckedElement: newPhoneBookItem.find(".new-phone-book-item-checkbox"),

                firstNameElement: newPhoneBookItem.find(".contact-first-name"),
                lastNameElement: newPhoneBookItem.find(".contact-last-name"),
                phoneElement: newPhoneBookItem.find(".contact-phone")
            });

            const contact = contacts[contacts.length - 1];
            itemIndex++;

            contact.idElement.text(itemIndex);
            contact.firstNameElement.text(contactFirstNameField.val().trim());
            contact.lastNameElement.text(contactLastNameField.val().trim());
            contact.phoneElement.text(contactPhoneField.val().trim());

            contact.isCheckedElement.change(function () {
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
                            contacts.splice(Number(contact.idElement.text()) - 1, 1);
                            newPhoneBookItem.remove();

                            contacts.forEach((c, i) => {
                                c.idElement.text(++i);
                            });

                            itemIndex--;

                            if (itemIndex === 0) {
                                selectAllItemsCheckbox.prop("checked", false);
                            }

                            if (isSearchModeActive) {
                                searchForm.triggerHandler("submit");
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
                const editButton = $(this);
                const deleteButton = newPhoneBookItem.find(".delete-button");

                editButton.hide();
                deleteButton.hide();

                const phoneBookButtons = phoneBookForm.find(".phone-book-form-buttons");

                const formCurrentActionText = phoneBookForm.find(".current-form-action-text");
                formCurrentActionText.text("Редактирование контакта");

                const contactAddButton = phoneBookForm.find(".new-contact-add-button");
                contactAddButton.hide();

                $("<button>")
                    .addClass("save-button ui-button ui-widget ui-corner-all")
                    .prop("type", "button").text("Сохранить")
                    .appendTo(phoneBookButtons)
                    .click(function () {
                        if (!checkFormFieldsValid() || !checkExistPhone(contact.idElement.text(), contactPhoneField.val().trim())) {
                            return;
                        }

                        this.remove();
                        phoneBookButtons.find(".cancel-button").remove()

                        contact.firstNameElement.text(contactFirstNameField.val());
                        contact.lastNameElement.text(contactLastNameField.val());
                        contact.phoneElement.text(contactPhoneField.val());

                        formCurrentActionText.text("Создание нового контакта");

                        clearFormFields();

                        contactAddButton.show();
                        editButton.show();
                        deleteButton.show();
                    });

                $("<button>")
                    .addClass("cancel-button ui-button ui-widget ui-corner-all")
                    .prop("type", "button").text("Отменить")
                    .appendTo(phoneBookButtons)
                    .click(function () {
                        this.remove();
                        phoneBookButtons.find(".save-button").remove()

                        formCurrentActionText.text("Создание нового контакта");

                        clearFormFields();
                        $(".phone-book-text-field").trigger("change");

                        contactAddButton.show();
                        editButton.show();
                        deleteButton.show();
                    })

                contactLastNameField.val(contact.firstNameElement.text());
                contactFirstNameField.val(contact.lastNameElement.text());
                contactPhoneField.val(contact.phoneElement.text());

                $(".phone-book-text-field").trigger("change");
            });
        }

        function clearFormFields() {
            contactFirstNameField.val("");
            contactLastNameField.val("");
            contactPhoneField.val("");

            $(".phone-book-text-field").removeClass("is-valid");
        }

        setPhoneBookViewMode();

        phoneBookTBody.append(newPhoneBookItem);
        clearFormFields();
    });
});