$(document).ready(function () {
    "use strict";

    const phoneBookForm = $("#phone-book-form");
    const phoneBookFormFields = $(".phone-book-text-field");
    const phoneBookTBody = $("#phone-book-tbody");

    const contactFirstNameField = $("#phone-book-text-first-name-field");
    const contactLastNameField = $("#phone-book-text-last-name-field");
    const contactPhoneField = $("#phone-book-text-phone-field");

    const confirmSingleDeleteDialog = $("#confirm-single-delete-dialog");
    const confirmAllSelectedDeleteDialog = $("#confirm-all-selected-delete-dialog");
    const confirmEditingDialog = $("#confirm-editing-dialog");

    const searchField = $("#phone-book-search-field");
    const searchResultText = $("#phone-book-search-result-text");
    const searchForm = $("#phone-book-search-form");

    const selectAllItemsCheckbox = $("#phone-book-table-selected-all-checkbox");
    const allSelectedDeleteButton = $("#all-selected-delete-button");

    let contacts = [];
    let isSearchModeActive = false;
    let foundItemsCount = 0;

    phoneBookFormFields.blur(function (e) {
        const field = $(e.target);

        field.removeClass("is-invalid");
        field.toggleClass("is-valid", field.val().trim().length > 0);
    });

    phoneBookFormFields.focus(function (e) {
        $(e.target).removeClass("is-invalid").removeClass("is-valid");
    });

    function setFoundItemsCount() {
        foundItemsCount = contacts.filter(c => c.idElement.closest("tr").is(":visible")).length;
        searchResultText.text(`Найдено: ${foundItemsCount}`);
    }

    searchForm.submit(function (e) {
        e.preventDefault();

        const searchText = searchField.val().trim().toLocaleLowerCase();

        if (searchText.length === 0) {
            return;
        }

        isSearchModeActive = true;

        if (phoneBookTBody.find(":checked").length > 0) {
            selectAllItemsCheckbox.prop("checked", false);
            selectAllItemsCheckbox.triggerHandler("change");
        }

        phoneBookTBody.find("tr").hide();

        contacts
            .filter(c =>
                c.firstNameElement.text().toLocaleLowerCase().indexOf(searchText) >= 0 ||
                c.lastNameElement.text().toLocaleLowerCase().indexOf(searchText) >= 0 ||
                c.phoneElement.text().toLocaleLowerCase().indexOf(searchText) >= 0)
            .forEach(c => {
                c.idElement.closest("tr").show();
            });

        setFoundItemsCount();

        if (foundItemsCount === 0) {
            selectAllItemsCheckbox.prop("checked", false);
        }
    });

    $("#phone-book-clear-button").click(function () {
        contacts
            .filter(c => c.idElement.is(":hidden"))
            .forEach(c => c.idElement.closest("tr").show());

        searchResultText.text("");
        searchField.val("");

        isSearchModeActive = false;
    });

    function setDisabledAllSelectedDeleteButton() {
        allSelectedDeleteButton.prop("disabled", false);

        if (phoneBookTBody.find(":checked").length === 0) {
            allSelectedDeleteButton.prop("disabled", true);
        }
    }

    selectAllItemsCheckbox.change(function () {
        contacts.forEach(c => {
            if (selectAllItemsCheckbox.prop("checked") && c.idElement.is(":visible")) {
                $(c.isCheckedElement).prop("checked", true);
            } else {
                $(c.isCheckedElement).prop("checked", false);
            }
        });

        setDisabledAllSelectedDeleteButton();
    });

    allSelectedDeleteButton.click(function () {
        const checkedItemsCount = phoneBookTBody.find(":checked").length;
        const checkedItemsCountText = confirmAllSelectedDeleteDialog.find("#confirm-all-selected-delete-dialog-text");

        checkedItemsCountText.text(`Удалить ${checkedItemsCount} записей?`);

        confirmAllSelectedDeleteDialog.dialog({
            resizable: false,
            modal: true,
            buttons: {
                "Да"() {
                    contacts
                        .filter(c => c.isCheckedElement.prop("checked"))
                        .forEach(c => {
                            c.idElement.closest("tr").remove();
                        });

                    contacts = contacts.filter(c => !c.isCheckedElement.prop("checked"));

                    contacts.forEach((c, i) => {
                        c.idElement.text(i + 1);
                    });

                    if (isSearchModeActive) {
                        setFoundItemsCount();
                    }

                    allSelectedDeleteButton.prop("disabled", true);
                    selectAllItemsCheckbox.prop("checked", false);
                    confirmAllSelectedDeleteDialog.dialog("close");
                },

                "Нет"() {
                    confirmAllSelectedDeleteDialog.dialog("close");
                }
            }
        });
    });

    phoneBookForm.submit(function (e) {
        e.preventDefault();

        function checkFormFieldsValid(firstNameField, lastNameField, phoneField) {
            const phoneFieldErrorMessage = $(".phone-error-message");
            let areFormFieldsValid = true;

            if (firstNameField.val().trim().length === 0) {
                firstNameField.addClass("is-invalid");
                areFormFieldsValid = false;
            }

            if (lastNameField.val().trim().length === 0) {
                lastNameField.addClass("is-invalid");
                areFormFieldsValid = false;
            }

            if (phoneField.val().trim().length === 0) {
                phoneFieldErrorMessage.text("Заполните поле номер телефона");
                phoneField.addClass("is-invalid");
                areFormFieldsValid = false;
            }
            else if (isNaN(Number(phoneField.val().trim()))) {
                phoneFieldErrorMessage.text("Неверный формат номера телефона");
                phoneField.addClass("is-invalid");
                areFormFieldsValid = false;
            }

            return areFormFieldsValid;
        }

        function checkPhoneExists(index, phoneField) {
            if (contacts.some(c => c.phoneElement.text() === phoneField.val().trim() && c.idElement.text() !== index)) {
                phoneField.addClass("is-invalid");
                $(".phone-error-message").text("Номер уже существует");
                return false;
            }

            return true;
        }

        if (!checkFormFieldsValid(contactFirstNameField, contactLastNameField, contactPhoneField) || !checkPhoneExists(contacts.length, contactPhoneField)) {
            return;
        }

        const newPhoneBookItem = $("<tr>").addClass(".new-phone-book-item");

        let contactNewIndex = contacts.length;
        let contactNewFirstNameText = contactLastNameField.val().trim();
        let contactNewLastNameText = contactFirstNameField.val().trim();
        let contactNewPhoneText = contactPhoneField.val().trim();

        function setPhoneBookViewMode() {
            newPhoneBookItem.html(`
                    <td>
                        <label class="d-flex justify-content-sm-center">
                            <input class="new-phone-book-item-checkbox form-check-input" type="checkbox">
                        </label>
                    </td>
                    <td class="contact-index"></td>
                    <td class="contact-last-name"></td>
                    <td class="contact-first-name"></td>
                    <td class="contact-phone"></td>
                    <td>                        
                        <button class="edit-button ui-button ui-widget ui-corner-all" type="button" title="Редактировать запись"><span class="ui-icon ui-icon-pencil"></span></button>
                        <button class="delete-button ui-button ui-widget ui-corner-all" type="button" title="Удалить запись"><span class="ui-icon ui-icon-trash"></span></button>                       
                    </td>                     
            `);

            contacts[contactNewIndex] = {
                idElement: newPhoneBookItem.find(".contact-index"),
                isCheckedElement: newPhoneBookItem.find(".new-phone-book-item-checkbox"),
                firstNameElement: newPhoneBookItem.find(".contact-first-name"),
                lastNameElement: newPhoneBookItem.find(".contact-last-name"),
                phoneElement: newPhoneBookItem.find(".contact-phone")
            };

            const contact = contacts[contactNewIndex];

            contact.idElement.text(contactNewIndex + 1);
            contact.firstNameElement.text(contactNewFirstNameText);
            contact.lastNameElement.text(contactNewLastNameText);
            contact.phoneElement.text(contactNewPhoneText);

            contact.isCheckedElement.change(function () {
                if (!$(this).prop("checked")) {
                    selectAllItemsCheckbox.prop("checked", false);
                }

                setDisabledAllSelectedDeleteButton();
            });

            newPhoneBookItem.find(".delete-button").click(function () {
                confirmSingleDeleteDialog.dialog({
                    resizable: false,
                    modal: true,
                    buttons: {
                        "Да"() {
                            contacts.splice(Number(contact.idElement.text()) - 1, 1);
                            newPhoneBookItem.remove();

                            contacts.forEach((c, i) => {
                                c.idElement.text(i + 1);
                            });

                            if (contacts.length === 0) {
                                selectAllItemsCheckbox.prop("checked", false);
                            }

                            if (isSearchModeActive) {
                                setFoundItemsCount();
                            }

                            setDisabledAllSelectedDeleteButton();
                            confirmSingleDeleteDialog.dialog("close");
                        },

                        "Нет"() {
                            confirmSingleDeleteDialog.dialog("close");
                        }
                    }
                });
            });

            newPhoneBookItem.find(".edit-button").click(function () {
                const editingFormFields = $(".editing-text-field");

                editingFormFields.focus(function (e) {
                    $(e.target).removeClass("is-invalid").removeClass("is-valid");
                });

                editingFormFields.removeClass("is-invalid").removeClass("is-valid");

                confirmEditingDialog.find(".editing-dialog-form")
                    .submit(function (e) {
                        e.preventDefault();
                        addEditingFields();
                    })
                    .change(function (e) {
                        const field = $(e.target);

                        field.removeClass("is-invalid");
                        field.toggleClass("is-valid", field.val().trim().length > 0);
                    });

                const editFirstNameField = confirmEditingDialog.find("#editing-first-name-field");
                const editLastNameField = confirmEditingDialog.find("#editing-last-name-field");
                const editPhoneField = confirmEditingDialog.find("#editing-phone-field");

                const editContactId = contact.idElement.text();
                editFirstNameField.val(contact.firstNameElement.text());
                editLastNameField.val(contact.lastNameElement.text());
                editPhoneField.val(contact.phoneElement.text());

                function addEditingFields() {
                    if (!checkFormFieldsValid(editFirstNameField, editLastNameField, editPhoneField) || !checkPhoneExists(editContactId, editPhoneField)) {
                        return;
                    }

                    contactNewIndex = editContactId - 1;
                    contactNewFirstNameText = editFirstNameField.val().trim();
                    contactNewLastNameText = editLastNameField.val().trim();
                    contactNewPhoneText = editPhoneField.val().trim();

                    setPhoneBookViewMode();
                    confirmEditingDialog.dialog("close");
                }

                confirmEditingDialog.dialog({
                    resizable: false,
                    modal: true,
                    buttons: {
                        "Сохранить"() {
                            addEditingFields();
                        },

                        "Отмена"() {
                            confirmEditingDialog.dialog("close");
                        }
                    }
                });
            });
        }

        function clearFormFields() {
            contactFirstNameField.val("");
            contactLastNameField.val("");
            contactPhoneField.val("");

            phoneBookFormFields.removeClass("is-valid");
        }

        setPhoneBookViewMode();

        phoneBookTBody.append(newPhoneBookItem);

        if (isSearchModeActive) {
            searchForm.triggerHandler("submit");
        }

        clearFormFields();
    });
});