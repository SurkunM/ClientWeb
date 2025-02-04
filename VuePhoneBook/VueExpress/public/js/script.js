"use strict";

class PhoneBookService {
    constructor() {
        this.baseUrl = "/api/contacts";
    }

    get(url, params) {
        return axios.get(url, {
            params
        }).then(response => response.data);
    }

    post(url, data) {
        return axios.post(url, data).then(response => response.data);
    }

    delete(url, data) {
        return axios.delete(url, data).then(response => response.data);
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
}

const app = Vue.createApp({
    data() {
        return {
            contacts: [],
            service: new PhoneBookService(),
            term: "",

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

            isChecked: false
        };
    },

    created() {
        this.getContacts();
    },

    methods: {
        checkContactFirstNameFieldComplete() {
            if (this.firstName.length > 0) {
                this.isFirstNameFieldValid = false;
                this.isFirstNameFieldComplete = true;
            }
            else {
                this.isFirstNameFieldComplete = false;
            }
        },

        checkContactLastNameFieldComplete() {
            if (this.lastName.length > 0) {
                this.isLastNameFieldValid = false;
                this.isLastNameFieldComplete = true;
            }
            else {
                this.isLastNameFieldComplete = false;
            }
        },

        checkContactPhoneFieldComplete() {
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

            this.isFirstNameFieldValid = false;
            this.isLastNameFieldValid = false;
            this.isPhoneFieldValid = false;

            this.isFirstNameFieldComplete = false;
            this.isLastNameFieldComplete = false;
            this.isPhoneFieldComplete = false;
        },

        checkNewContactFieldsInvalid() {
            const firstName = this.firstName;
            const lastName = this.lastName;
            const phone = this.phone;

            this.isFirstNameFieldValid = false;
            this.isLastNameFieldValid = false;
            this.isPhoneFieldValid = false;

            if (firstName.length === 0) {
                this.isFirstNameFieldValid = true;
                return true;
            }

            if (lastName.length === 0) {
                this.isLastNameFieldValid = true;
                return true;
            }

            if (phone.length === 0) {
                this.phoneInvalidText = "Заполните поле Телефон";
                this.isPhoneFieldValid = true;
                return true;
            }

            if (isNaN(Number(phone))) {
                this.phoneInvalidText = "Не верный формат для поля Телефон";
                this.isPhoneFieldValid = true;
                return true;
            }

            return false;
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
                    this.setShowContactsCount();
                })
                .catch(() => {
                    alert("Get contacts ERORR");//TODO: ред. сервер. message!
                });
        },

        createContact() {
            if (this.checkNewContactFieldsInvalid()) {
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
                        alert(response.message);
                    }
                })
                .catch(() => {
                    alert("Не создано");
                });

            this.getContacts();

            this.id++;

            this.clearFormsFields();
        },

        showSingleDeleteConfirm(contact) {
            this.selectedContact = contact;
            this.$refs.confirmSingleDeleteModal.show();
        },

        deleteContact() {
            this.service.deleteContact(this.selectedContact.id)
                .then(response => {
                    if (!response.success) {
                        alert(response.message);
                        this.setShowContactsCount();
                    }

                    this.getContacts();
                })
                .catch(() => {
                    alert("Не удалось удалить");
                });

            this.$refs.confirmSingleDeleteModal.hide();
        },

        deleteSelectedContacts() {
            this.contacts = this.contacts.filter(c => !c.isChecked);;

            this.setShowContactsCount();
            this.isChecked = false;
        },

        showEditContactModal(contact) {
            this.selectedContact = contact;
            this.$refs.contactEditingModal.show(contact);
        },

        editContact() {// Через модальное окно!
            this.firstName = contact.firstName;
            this.lastName = contact.lastName;
            this.phone = contact.phone;
        },

        cancelEditContact() {
            this.clearFormsFields();
        },

        saveEditContact(itemIndex) {
            if (this.checkNewContactFieldsInvalid()) {
                return;
            }

            const contact = this.contacts[itemIndex];

            if (this.checkExistPhone(contact.id, this.phone)) {
                return;
            }

            contact.firstName = this.firstName;
            contact.lastName = this.lastName;
            contact.phone = this.phone;

            this.cancelEditContact();
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

                this.isChecked = false;
                this.selectAllCheckbox();

                this.isSearchModeActive = false;
            }
        },

        selectAllCheckbox() {
            this.contacts.forEach(c => {
                if (c.isShow) {
                    c.isChecked = this.isChecked;
                }
            });
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

    data() {
        return {
            isEditing: false,
            isEditingTextInvalid: false,
        }
    },

    methods: {

    },

    template: `
        <teleport to="#tbody">
            <tr>
                <td>
                    <label class="d-flex justify-content-sm-center">
                        <input v-model="contact.isChecked" class="form-check-input" type="checkbox">
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
            editContact: null,
            editFirstName: "",
            editLastName: "",
            editPhone: "",

            editPhoneInvalidText: "",

            isFirstNameFieldValid: false,
            isLastNameFieldValid: false,
            isPhoneFieldValid: false,

            isFirstNameFieldComplete: false,
            isLastNameFieldComplete: false,
            isPhoneFieldComplete: false,
        };
    },

    mounted() {
        this.instance = new bootstrap.Modal(this.$refs.editingModal);
    },

    methods: {
        show(contact) {
            this.editFirstName = contact.firstName;
            this.editLastName = contact.lastName;
            this.editPhone = contact.phone;

            this.instance.show();
        },

        hide() {
            this.instance.hide();
        },
    },

    template: `
        <div ref="editingModal" class="modal fade" id="exampleModal" tabindex="-1"  data-bs-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Редактирование контакта</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <form>                                 
                            <div class="mb-2">
                                <label for="edit-first-name-field" class="form-label-sm">Имя</label>
                                <input v-model.trim="editFirstName"
                                       v-bind:class="{'is-invalid': false, 'is-valid': false}"
                                       id="edit-first-name-field"
                                       type="text"
                                       class="form-control form-control-sm"                                        
                                       autocomplete="off">
                                <div class="invalid-feedback">Заполните поле Имя</div>
                            </div>

                            <div class="mb-2">
                            <label for="edit-last-name-field" class="form-label-sm">Фамилия</label>
                                <input v-model.trim="editLastName"
                                       v-bind:class="{'is-invalid': false, 'is-valid':false}"
                                       id="edit-last-name-field"
                                       type="text"
                                       class="form-control form-control-sm"                                        
                                       autocomplete="off">
                                <div class="invalid-feedback">Заполните поле Фамилия</div>
                            </div>

                            <div class="mb-2">
                                <label for="edit-phone-field" class="form-label-sm">Телефон</label>
                                <input v-model.trim="editPhone"
                                       v-bind:class="{'is-invalid': false, 'is-valid': false}"                                        
                                       type="text"
                                       class="form-control form-control-sm"
                                       id="edit-phone-field"
                                       autocomplete="off">
                                <div v-text="editPhoneInvalidText" class="invalid-feedback"></div>
                            </div>                                                                          
                        </form>
                    </div>

                    <div class="modal-footer">
                        <button @click="hide" type="button" class="btn btn-primary">Сохранить</button>
                        <button @click="hide" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
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

app.component("all-delete-modal", {
    data() {
        return {
            instance: null
        };
    },

    mounted() {
        this.instance = new bootstrap.Modal(this.$refs.modal);
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
        <div ref="modal" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Подтвердите удаление</h5>
                        <button type="button" class="btn-close"@click="hide" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">Вы действительно хотите удалить все выделенные заметки?</div>
                    <div class="modal-footer">
                        <button @click="$emit('delete')" type="button" class="btn btn-danger">Удалить</button>
                        <button @click="hide" type="button" class="btn btn-secondary">Отмена</button>
                    </div>
                </div>
            </div>
        </div>
    `
});

app.mount("#app");