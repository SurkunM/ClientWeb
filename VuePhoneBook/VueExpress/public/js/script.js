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

            formTitleText: "Создать контакт",
            isEditing: false,
            editingContactId: 0,

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
                    alert("Get contacts ERORR");
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

        deleteContact(contact) {            
            this.$refs.confirmAllDeleteModal.show();//TODO: Модальное окно!

            this.service.deleteContact(contact.id)
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
        },

        deleteSelectedContacts() {           
            this.$refs.confirmSingleDeleteModal.show(); //TODO: Модальное окно!

            this.contacts = this.contacts.filter(c => !c.isChecked);;

            this.setShowContactsCount();
            this.isChecked = false;
        },

        editContact(contact) {
            this.firstName = contact.firstName;
            this.lastName = contact.lastName;
            this.phone = contact.phone;

            this.formTitleText = "Редактировать контакт";
            this.editingContactId = contact.id;
            this.isEditing = true;
        },

        cancelEditContact() {
            this.clearFormsFields();

            this.formTitleText = "Создать контакт";
            this.editingContactId = 0;
            this.isEditing = false;
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

app.component("Modal", { // Vue 1:20:00
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

    template:`
        <div ref="modal" class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <slot name="header"></slot>                            
                        </h5>
                        <button type="button" class="btn-close"@click="hide" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="hide">Отмена</button>
                        <slot name="action-button"></slot>    
                    </div>
                </div>
            </div>
        </div>
    `,
    //--------------all delete
        template: `
        <div ref="modal" class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <slot name="header"></slot>                            
                        </h5>
                        <button type="button" class="btn-close"@click="hide" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="hide">Отмена</button>
                        <slot name="action-button"></slot>    
                    </div>
                </div>
            </div>
        </div>
    `
});

app.mount("#app");