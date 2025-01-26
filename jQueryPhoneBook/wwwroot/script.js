$(document).ready(function () {
    "use strict";

    const phoneBookForm = $("#phone-book-form");
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
    let isEditingMode = false;

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
        searchField.val("");
    });

    function setDisabledAllSelectedDeleteButton() {
        if (allSelectedDeleteButton.prop("disabled")) {
            allSelectedDeleteButton.prop("disabled", false);
        }

        if ($(":checked").length === 0) {
            allSelectedDeleteButton.prop("disabled", true);
        }
    }

    selectAllItemsCheckbox.change(function () {
        contacts.forEach(c => {
            if ($(selectAllItemsCheckbox).prop("checked") && c.idElement.is(":visible")) {
                $(c.isCheckedElement).prop("checked", true);
            }
            else {
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
                "Да": () => {
                    contacts
                        .filter(c => c.isCheckedElement.prop("checked"))
                        .forEach(c => {
                            c.idElement.closest("tr").remove();
                        });

                    contacts = contacts.filter(c => !c.isCheckedElement.prop("checked"));

                    contacts.forEach((c, i) => {
                        c.idElement.text(++i);
                    });

                    if (isSearchModeActive) {
                        searchForm.triggerHandler("submit");
                    }

                    allSelectedDeleteButton.prop("disabled", true);
                    selectAllItemsCheckbox.prop("checked", false);
                    confirmAllSelectedDeleteDialog.dialog("close");
                },

                "Нет": () => confirmAllSelectedDeleteDialog.dialog("close")
            }
        });
    });

    phoneBookForm.submit(function (e) {
        e.preventDefault();

        function checkFormFieldsValid() {
            const phoneFieldErrorMessage = $("#phone-error-message");
            let isFormFieldsValid = true;

            if (contactFirstNameField.val().trim().length === 0) {
                $(contactFirstNameField).addClass("is-invalid");
                isFormFieldsValid = false;
            }

            if (contactLastNameField.val().trim().length === 0) {
                $(contactLastNameField).addClass("is-invalid");
                isFormFieldsValid = false;
            }

            if (contactPhoneField.val().trim().length === 0) {
                phoneFieldErrorMessage.text("Заполните поле номер телефона");
                $(contactPhoneField).addClass("is-invalid");
                isFormFieldsValid = false;
            }
            else if (isNaN(Number(contactPhoneField.val().trim()))) {
                phoneFieldErrorMessage.text("Не верный формат номера телефона");
                contactPhoneField.addClass("is-invalid");
                isFormFieldsValid = false;
            }

            return isFormFieldsValid;
        }

        function checkExistPhone(index, contactPhoneText) {
            if (contacts.some(c => c.phoneElement.text() === contactPhoneText && c.idElement.text() !== index)) {
                contactPhoneField.addClass("is-invalid");
                $("#phone-error-message").text("Номер уже существует");
                return false;
            }

            return true;
        }

        if (!checkFormFieldsValid() || !checkExistPhone(contacts.length, contactPhoneField.val().trim())) {
            return;
        }

        const newPhoneBookItem = $("<tr>").addClass(".new-phone-book-item");

        if (isSearchModeActive) {
            newPhoneBookItem.hide();
        }

        let contactId = contacts.length;
        let contactFirstNameText = contactLastNameField.val().trim();
        let contactLastNameText = contactFirstNameField.val().trim();
        let contactPhoneText = contactPhoneField.val().trim();

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

            contacts[contactId] = {
                idElement: newPhoneBookItem.find(".contact-index"),
                isCheckedElement: newPhoneBookItem.find(".new-phone-book-item-checkbox"),
                firstNameElement: newPhoneBookItem.find(".contact-first-name"),
                lastNameElement: newPhoneBookItem.find(".contact-last-name"),
                phoneElement: newPhoneBookItem.find(".contact-phone")
            }

            let contact = contacts[contactId];

            contact.idElement.text(contactId + 1);
            contact.firstNameElement.text(contactFirstNameText);
            contact.lastNameElement.text(contactLastNameText);
            contact.phoneElement.text(contactPhoneText);

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
                        "Да": () => {                          
                            contacts.splice(Number(contact.idElement.text()) - 1, 1);
                            newPhoneBookItem.remove();

                            contacts.forEach((c, i) => {
                                c.idElement.text(++i);
                            });

                            if (contacts.length === 0) {
                                selectAllItemsCheckbox.prop("checked", false);
                            }

                            if (isSearchModeActive) {
                                searchForm.triggerHandler("submit");
                            }

                            setDisabledAllSelectedDeleteButton();
                            confirmSingleDeleteDialog.dialog("close");
                        },

                        "Нет": () => confirmSingleDeleteDialog.dialog("close")
                    }
                });
            })

            newPhoneBookItem.find(".edit-button").click(function () {// Сделать через модальное окно! Сейчас если  при ред. удалить контакт не удалится!
                confirmEditingDialog.dialog({
                    resizable: false,
                    modal: true,
                    buttons: {
                        "Сохранить": () => {


                            confirmEditingDialog.dialog("close")
                        },

                        "Отмена": () => confirmEditingDialog.dialog("close")
                    }

                })
                //if (isEditingMode) {
                //    return;
                //}

                //isEditingMode = true;

                //newPhoneBookItem.html(`
                //    <td>
                //        <label class="d-flex justify-content-sm-center">
                //            <input class="new-phone-book-item-checkbox form-check-input" type="checkbox">
                //        </label>
                //    </td>
                //    <td class="contact-index"></td>
                //    <td>
                //        <div class="mb-2">                            
                //            <input class="edit-contact-last-name-field form-control form-control-sm" type="text" autocomplete="off">
                //            <div class="invalid-feedback">Заполните поле</div>
                //        </div>
                //    </td>
                //    <td>
                //        <div class="mb-2">                            
                //            <input class="edit-contact-first-name-field form-control form-control-sm" type="text" autocomplete="off">
                //            <div class="invalid-feedback">Заполните поле</div>
                //        </div>
                //    </td>
                //    <td>
                //        <div class="mb-2">                            
                //            <input class="edit-contact-phone-field form-control form-control-sm" type="text" autocomplete="off">
                //            <div class="invalid-feedback" id="phone-error-message">Заполните поле</div>
                //        </div>
                //    </td>
                //    <td>                        
                //        <button class="save-button ui-button ui-widget ui-corner-all" type="button">Сохранить</button>
                //        <button class="cancel-button ui-button ui-widget ui-corner-all" type="button">Отменить</span></button>                       
                //    </td>                     
                //`);

                //const editContactId = newPhoneBookItem.find(".contact-index");
                //const editLastNameField = newPhoneBookItem.find(".edit-contact-last-name-field");
                //const editFirstNameField = newPhoneBookItem.find(".edit-contact-first-name-field");
                //const editPhoneField = newPhoneBookItem.find(".edit-contact-phone-field");               

                //editContactId.text(contact.idElement.text());

                //editLastNameField.val(contact.lastNameElement.text());
                //editFirstNameField.val(contact.firstNameElement.text());
                //editPhoneField.val(contact.phoneElement.text());

                //newPhoneBookItem.find(".save-button").click(function () {
                //    contactId = editContactId.text() - 1;
                //    contactLastNameText = editLastNameField.val().trim();
                //    contactFirstNameText = editFirstNameField.val().trim();
                //    contactPhoneText = editPhoneField.val().trim();

                //    isEditingMode = false;
                //    setPhoneBookViewMode();
                //});

                //newPhoneBookItem.find(".cancel-button").click(function () {
                //    isEditingMode = false;
                //    setPhoneBookViewMode();
                //});
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