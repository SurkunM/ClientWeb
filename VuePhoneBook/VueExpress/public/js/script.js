"use strict";

class PhoneBookService {
    constructor() {
        this.baseUrl = "/api/contacts";
    }

    get(url, params) {
        return axios.get(url, { params }).then(response => response.data);
    }

    post(url, data) {
        return axios.post(url, data).then(response => response.data);
    }

    delete(url, data) {
        return axios.delete(url, data).then(response => response.data);
    }

    put(url, data) {
        return axios.put(url, data).then(response => response.data);
    }

    patch(url, data) {
        return axios.patch(url, data).then(response => response.data);
    }

    getContacts(term) {
        return this.get(this.baseUrl, { term });
    }

    createContact(contact) {
        return this.post(this.baseUrl, contact);
    }

    deleteContact(id) {
        return this.delete(`${this.baseUrl}/${id}`);
    }

    deleteSelectedContacts(contacts) {
        return this.patch(this.baseUrl, contacts);
    }

    editContact(contact) {
        return this.put(this.baseUrl, contact);
    }
}

const app = Vue.createApp({
    data() {
        return {
            service: new PhoneBookService(),
            contacts: [],

            firstName: "",
            lastName: "",
            phone: "",

            phoneInvalidText: "",

            isFirstNameFieldValid: false,
            isLastNameFieldValid: false,
            isPhoneFieldValid: false,

            isFirstNameFieldComplete: false,
            isLastNameFieldComplete: false,
            isPhoneFieldComplete: false,

            selectedContact: null,

            isSearchModeActive: false,
            searchResultText: "",
            term: "",

            isSuccessAlertShow: false,
            successAlertText: "",

            isErrorAlertShow: false,
            errorAlertText: "",

            isAllChecked: false,
            checkedContactsCount: 0
        };
    },

    created() {
        this.getContacts();
    },

    methods: {
        showSuccessAlert(text) {
            this.successAlertText = text;
            this.isSuccessAlertShow = true;
            setTimeout(() => {
                this.successAlertText = "";
                this.isSuccessAlertShow = false
            }, 1500);
        },

        showErrorAlert(text) {
            this.errorAlertText = text;
            this.isErrorAlertShow = true;
            setTimeout(() => {
                this.errorAlertText = "";
                this.isErrorAlertShow = false
            }, 1500);
        },

        checkFirstNameFieldComplete() {
            if (this.firstName.length > 0) {
                this.isFirstNameFieldValid = false;
                this.isFirstNameFieldComplete = true;
            }
            else {
                this.isFirstNameFieldComplete = false;
            }
        },

        checkLastNameFieldComplete() {
            if (this.lastName.length > 0) {
                this.isLastNameFieldValid = false;
                this.isLastNameFieldComplete = true;
            }
            else {
                this.isLastNameFieldComplete = false;
            }
        },

        checkPhoneFieldComplete() {
            if (this.phone.length > 0) {
                this.isPhoneFieldValid = false;
                this.isPhoneFieldComplete = true;
            }
            else {
                this.isPhoneFieldComplete = false;
            }
        },

        clearFormsFields() {
            this.firstName = "";
            this.lastName = "";
            this.phone = "";

            this.isAllChecked = false;

            this.isFirstNameFieldValid = false;
            this.isLastNameFieldValid = false;
            this.isPhoneFieldValid = false;

            this.isFirstNameFieldComplete = false;
            this.isLastNameFieldComplete = false;
            this.isPhoneFieldComplete = false;
        },

        checkFormFieldsInvalid() {
            this.isFirstNameFieldValid = false;
            this.isLastNameFieldValid = false;
            this.isPhoneFieldValid = false;

            let isInvalidFields = false;

            if (this.firstName.length === 0) {
                this.isFirstNameFieldValid = true;
                isInvalidFields = true;
            }

            if (this.lastName.length === 0) {
                this.isLastNameFieldValid = true;
                isInvalidFields = true;
            }

            if (this.phone.length === 0) {
                this.phoneInvalidText = "Заполните поле телефон";
                this.isPhoneFieldValid = true;
                isInvalidFields = true;
            }

            if (isNaN(Number(this.phone))) {
                this.phoneInvalidText = "Не верный формат для поля телефон";
                this.isPhoneFieldValid = true;
                isInvalidFields = true;
            }

            return isInvalidFields;
        },

        checkExistPhone(id, phone) {
            if (this.contacts.some(c => c.id !== id && c.phone === phone)) {
                this.phoneInvalidText = "Контакт с таким номером уже существует";
                this.isPhoneFieldValid = true;
                return true;
            }

            return false;
        },

        getContacts() {
            this.service.getContacts(this.term.trim())
                .then(contacts => {
                    this.contacts = contacts;

                    if (this.isSearchModeActive) {
                        this.setShowContactsCount();
                    }
                })
                .catch(() => {
                    this.showErrorAlert("При создании контакта произошла ошибка!");
                });
        },

        createContact() {
            if (this.checkFormFieldsInvalid()) {
                return;
            }

            if (this.checkExistPhone(0, this.phone)) {
                return;
            }

            const contact = {
                firstName: this.firstName,
                lastName: this.lastName,
                phone: this.phone,

                isChecked: false,
                isShow: true
            }

            this.service.createContact(contact)
                .then(response => {
                    if (!response.success) {
                        if (this.checkFormFieldsInvalid()) {
                            return;
                        }

                        if (this.checkExistPhone(0, this.phone)) {
                            return;
                        }
                    } else {
                        this.getContacts();
                        this.clearFormsFields();
                        this.showSuccessAlert("Контакт успешно создан!");
                    }
                })
                .catch(() => {
                    this.showErrorAlert("Ошибка! Попробуйте создать контакт еще раз");
                });
        },

        showSingleDeleteConfirm(contact) {
            this.selectedContact = contact;
            this.$refs.confirmSingleDeleteModal.show();
        },

        deleteSingleContact() {
            this.service.deleteContact(this.selectedContact.id)
                .then(() => {
                    this.getContacts();
                    this.showSuccessAlert("Контакт успешно удален!");

                    if (this.isSearchModeActive) {
                        this.setShowContactsCount();
                    }
                })
                .catch(() => {
                    this.showErrorAlert("Ошибка! Не удалось удалить");
                })
                .finally(() => {
                    this.$refs.confirmSingleDeleteModal.hide();
                });
        },

        showAllSelectedDeleteConfirm() {
            this.$refs.confirmAllSelectedDeleteModal.deletedContactsCount(this.checkedContactsCount);
            this.$refs.confirmAllSelectedDeleteModal.show();
        },

        deleteAllSelectedContacts() {
            this.service.deleteSelectedContacts(this.contacts)
                .then(response => {
                    if (!response.success) {
                        alert(response.message);
                    } else {
                        this.showSuccessAlert("Контакты успешно удалены!");                        
                        this.selectAllCheckbox(false);

                        if (this.isSearchModeActive) {
                            this.setShowContactsCount();
                        }
                    }
                })
                .catch(() => {
                    this.showErrorAlert("Ошибка! Не удалось удалить");
                })
                .finally(() => {
                    this.getContacts();
                    this.$refs.confirmAllSelectedDeleteModal.hide();
                });
        },

        showEditContactModal(contact) {
            this.selectedContact = contact;
            this.$refs.contactEditingModal.showEditingForm(this.selectedContact);
        },

        checkEditedContactPhone(id, phone) {
            if (this.contacts.some(c => c.id !== id && c.phone === phone)) {
                this.$refs.contactEditingModal.setExistPhoneInvalid();
            }
        },

        saveEditContact(editedContact) {
            this.service.editContact(editedContact)
                .then(response => {
                    if (!response.success) {
                        this.$refs.contactEditingModal.checkEiditFormFieldsInvalid();
                        this.$refs.contactEditingModal.checkEditingFormPhoneExist();
                    } else {
                        this.getContacts();
                        this.$refs.contactEditingModal.hideEditingForm();
                        this.showSuccessAlert("Контакт успешно изменен");
                    }
                })
                .catch(() => {
                    this.showErrorAlert("Ошибка редактирования! Попробуйие еще раз");
                })
        },

        setShowContactsCount() {
            this.searchResultText = `Найдено: ${this.contacts.length}`;
        },

        searchContacts() {
            const searchText = this.term.toLocaleLowerCase();
            this.isSearchModeActive = true;

            if (searchText.length === 0) {
                this.searchResultText = "Введите данные контакта";
                return;
            }

            this.getContacts();
        },

        cancelContactsSeatch() {
            if (this.isSearchModeActive) {
                this.term = "";

                this.getContacts();
                this.selectAllCheckbox(false);

                this.isSearchModeActive = false;
            }
        },

        checkSelected(isChecked) {
            if (isChecked) {
                this.checkedContactsCount++;
            } else {
                this.checkedContactsCount--;
            }
        },

        selectAllCheckbox(isCheck) {
            this.isAllChecked = isCheck;

            this.contacts.forEach(c => {
                if (c.isShow) {
                    c.isChecked = isCheck;
                }
            });

            this.checkedContactsCount = this.contacts.filter(c => c.isChecked).length;
        }
    }
});

app.component("phone-book-item", {
    props: {
        contact: {
            type: Object,
            required: true
        },

        index: {
            type: Number,
            required: true
        }
    },

    template: `
        <teleport to="#tbody">
            <tr>
                <td>
                    <label class="d-flex justify-content-sm-center">
                        <input v-model="contact.isChecked" @change="$emit('selected-contact', contact.isChecked)" class="form-check-input" type="checkbox">
                    </label>
                </td>
                <td v-text="index + 1"></td>
                <td v-text="contact.firstName"></td>
                <td v-text="contact.lastName"></td>
                <td v-text="contact.phone"></td>
                <td>                   
                    <div class="d-flex justify-content-center">
                        <button @click="$emit('contact-edit', contact)" class="btn btn-primary me-1" type="button">
                            Редактировать
                        </button>
                        <button @click="$emit('contact-delete', contact)" class="btn btn-danger" type="button">
                            Удалить
                        </button>
                    </div>                    
                </td>
            </tr>
        </teleport>
    `
});

app.component("editing-modal", {
    data() {
        return {
            instance: null,
            contact: null,

            editContactId: 0,
            editFirstName: "",
            editLastName: "",
            editPhone: "",

            editPhoneInvalidText: "",
            isPhoneExist: false,

            isFirstNameFieldValid: false,
            isLastNameFieldValid: false,
            isPhoneFieldValid: false
        };
    },

    mounted() {
        this.instance = new bootstrap.Modal(this.$refs.editingModal);
    },

    methods: {
        showEditingForm(contact) {
            this.contact = contact;

            this.isFirstNameFieldValid = false;
            this.isLastNameFieldValid = false;
            this.isPhoneFieldValid = false;

            this.editContactId = this.contact.id
            this.editFirstName = this.contact.firstName;
            this.editLastName = this.contact.lastName;
            this.editPhone = this.contact.phone;

            this.instance.show();
        },

        hideEditingForm() {
            this.instance.hide();
        },

        setExistPhoneInvalid() {
            this.editPhoneInvalidText = "Контакт с таким номером уже сущевстует";

            this.isPhoneFieldValid = true;
            this.isPhoneExist = true;
        },

        checkEditingFirstNameField() {
            if (this.editFirstName.length > 0) {
                this.isFirstNameFieldValid = false;
            }
        },

        checkEditingLastNameField() {
            if (this.editLastName.length > 0) {
                this.isLastNameFieldValid = false;
            }
        },

        checkEditingPhoneField() {
            if (this.editPhone.length > 0) {
                this.isPhoneFieldValid = false;
            }
        },

        checkEiditFormFieldsInvalid() {
            this.isFirstNameFieldValid = false;
            this.isLastNameFieldValid = false;
            this.isPhoneFieldValid = false;

            let isFieldsInvalid = false;

            if (this.editFirstName.length === 0) {
                this.isFirstNameFieldValid = true;
                isFieldsInvalid = true;
            }

            if (this.editLastName.length === 0) {
                this.isLastNameFieldValid = true;
                isFieldsInvalid = true;
            }

            if (this.editPhone.length === 0) {
                this.isPhoneFieldValid = true;
                this.editPhoneInvalidText = "Заполните поле телефон";
                isFieldsInvalid = true;
            }

            if (isNaN(Number(this.editPhone))) {
                this.editPhoneInvalidText = "Не верный формат для поля телефон";
                this.isPhoneFieldValid = true;
                isFieldsInvalid = true;
            }

            return isFieldsInvalid;
        },

        checkEditingFormPhoneExist() {
            this.isPhoneExist = false;
            this.isPhoneFieldValid = false;

            this.$emit("check-phone", this.editContactId, this.editPhone);
        },

        saveEditing() {
            if (this.checkEiditFormFieldsInvalid()) {
                return;
            }

            this.checkEditingFormPhoneExist();

            if (this.isPhoneExist) {
                return;
            }

            this.contact.firstName = this.editFirstName;
            this.contact.lastName = this.editLastName;
            this.contact.phone = this.editPhone;

            this.$emit("save", this.contact);
        }
    },

    template: `
        <div ref="editingModal" class="modal fade" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Редактировать контакт</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveEditing">
                            <div class="mb-2">
                                <label for="edit-first-name-field" class="form-label-sm">Имя</label>
                                <input v-model.trim="editFirstName"
                                       :class="{'is-invalid': isFirstNameFieldValid}"
                                       @change="checkEditingFirstNameField"
                                       id="edit-first-name-field"
                                       type="text"
                                       class="form-control form-control-sm"                                        
                                       autocomplete="off">
                                <div class="invalid-feedback">Заполните поле Имя</div>
                            </div>

                            <div class="mb-2">
                            <label for="edit-last-name-field" class="form-label-sm">Фамилия</label>
                                <input v-model.trim="editLastName"
                                       :class="{'is-invalid': isLastNameFieldValid}"
                                       @change="checkEditingLastNameField"
                                       id="edit-last-name-field"
                                       type="text"
                                       class="form-control form-control-sm"                                        
                                       autocomplete="off">
                                <div class="invalid-feedback">Заполните поле Фамилия</div>
                            </div>

                            <div class="mb-2">
                                <label for="edit-phone-field" class="form-label-sm">Телефон</label>
                                <input v-model.trim="editPhone"
                                       :class="{'is-invalid': isPhoneFieldValid}"
                                       @change="checkEditingPhoneField"
                                       type="text"
                                       class="form-control form-control-sm"
                                       id="edit-phone-field"
                                       autocomplete="off">
                                <div v-text="editPhoneInvalidText" class="invalid-feedback"></div>
                            </div>

                            <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
                        </form>
                    </div>

                    <div class="modal-footer">
                        <button @click="saveEditing" type="button" class="btn btn-primary">Сохранить</button>
                        <button @click="hideEditingForm" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                    </div>
                </div>
            </div>
        </div>
    `
});

app.component("single-delete-modal", {
    data() {
        return {
            instance: null
        };
    },

    mounted() {
        this.instance = new bootstrap.Modal(this.$refs.singleDeleteModal);
    },

    methods: {
        show() {
            this.instance.show();
        },

        hide() {
            this.instance.hide();
        }
    },

    template: `
        <div ref="singleDeleteModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Подтвердите удаление</h5>
                        <button type="button" class="btn-close"@click="hide" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">Вы действительно хотите удалить заметку?</div>
                    <div class="modal-footer">
                        <button @click="$emit('delete')" type="button" class="btn btn-danger">Удалить</button>
                        <button @click="hide" type="button" class="btn btn-secondary">Отмена</button>
                    </div>
                </div>
            </div>
        </div>
    `
});

app.component("all-selected-delete-modal", {
    data() {
        return {
            instance: null,
            count: 0
        };
    },

    mounted() {
        this.instance = new bootstrap.Modal(this.$refs.allSelectedDeleteModal);
    },

    methods: {
        show() {
            this.instance.show();
        },

        hide() {
            this.instance.hide();
        },

        deletedContactsCount(count) {
            this.count = count;
        }
    },

    template: `
        <div ref="allSelectedDeleteModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Подтвердите удаление</h5>
                        <button type="button" class="btn-close"@click="hide" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">Вы действительно хотите удалить все выделенные контакты? ({{ count }}) шт.</div>
                    <div class="modal-footer">
                        <button @click="$emit('all-selected-delete')" type="button" class="btn btn-danger">Удалить</button>
                        <button @click="hide" type="button" class="btn btn-secondary">Отмена</button>
                    </div>
                </div>
            </div>
        </div>
    `
});

app.mount("#app");