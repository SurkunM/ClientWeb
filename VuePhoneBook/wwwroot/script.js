"use strict";

class PhoneBookService {
    constructor() {
        this.baseUrl = "/api/contacts";
    }
    // 1:56 (express.js)


    getContacts(term) {

    }
}

const app = Vue.createApp({
    data() {
        return {
            contacts: [],

            newContactId: 1,
            newContactFirstName: "",
            newContactLastName: "",
            newContactPhone: "",
            phoneInvalidText: "",

            isNewContactFirstNameFieldValid: false,
            isNewContactLastNameFieldValid: false,
            isNewContactPhoneFieldValid: false,

            isNewContactFirstNameFieldComplete: false,
            isNewContactLastNameFieldComplete: false,
            isNewContactPhoneFieldComplete: false,

            formTitleText: "Создать контакт",
            isEditing: false,
            editingContactIndex: 0,

            isSearchModeActive: false,
            searchFieldText: "",
            searchResultCount: 0,

            isChecked: false
        };
    },

    methods: {
        checkContactFirstNameFieldComplete() {
            if (this.newContactFirstName.length > 0) {
                this.isNewContactFirstNameFieldValid = false;
                this.isNewContactFirstNameFieldComplete = true;
            }
            else {
                this.isNewContactFirstNameFieldComplete = false;
            }
        },

        checkContactLastNameFieldComplete() {
            if (this.newContactLastName.length > 0) {
                this.isNewContactLastNameFieldValid = false;
                this.isNewContactLastNameFieldComplete = true;
            }
            else {
                this.isNewContactLastNameFieldComplete = false;
            }
        },

        checkContactPhoneFieldComplete() {
            if (this.newContactPhone.length > 0) {
                this.isNewContactPhoneFieldValid = false;
                this.isNewContactPhoneFieldComplete = true;
            }
            else {
                this.isNewContactPhoneFieldComplete = false;
            }
        },

        clearFormsFields() {
            this.newContactFirstName = "";
            this.newContactLastName = "";
            this.newContactPhone = "";

            this.isNewContactFirstNameFieldValid = false;
            this.isNewContactLastNameFieldValid = false;
            this.isNewContactPhoneFieldValid = false;

            this.isNewContactFirstNameFieldComplete = false;
            this.isNewContactLastNameFieldComplete = false;
            this.isNewContactPhoneFieldComplete = false;
        },

        checkNewContactFieldsInvalid() {
            const firstName = this.newContactFirstName;
            const lastName = this.newContactLastName;
            const phone = this.newContactPhone;

            this.isNewContactFirstNameFieldValid = false;
            this.isNewContactLastNameFieldValid = false;
            this.isNewContactPhoneFieldValid = false;

            if (firstName.length === 0) {
                this.isNewContactFirstNameFieldValid = true;
                return true;
            }

            if (lastName.length === 0) {
                this.isNewContactLastNameFieldValid = true;
                return true;
            }

            if (phone.length === 0) {
                this.phoneInvalidText = "Заполните поле Телефон";
                this.isNewContactPhoneFieldValid = true;
                return true;
            }

            if (isNaN(Number(phone))) {
                this.phoneInvalidText = "Не верный формат для поля Телефон";
                this.isNewContactPhoneFieldValid = true;
                return true;
            }

            return false;
        },

        checkExistPhone(id, phone) {
            if (this.contacts.some(c => c.phone === phone && c.id !== id)) {
                this.phoneInvalidText = "Контакт с таким номером уже существует";
                this.isNewContactPhoneFieldValid = true;
                return true;
            }

            return false;
        },

        createContact() {
            if (this.checkNewContactFieldsInvalid()) {
                return;
            }

            if (this.checkExistPhone(this.newContactId, this.newContactPhone)) {
                return;
            }

            this.contacts.push({
                id: this.newContactId,
                firstName: this.newContactFirstName,
                lastName: this.newContactLastName,
                phone: this.newContactPhone,

                isChecked: false,
                isShow: true
            });

            if (this.isSearchModeActive) {
                this.contacts[this.contacts.length - 1].isShow = false;
            }

            this.newContactId++;

            this.clearFormsFields();
        },

        deleteContact(itemIndex) {
            //TODO: Модальное окно!
            this.contacts.splice(itemIndex, 1);
            this.setShowContactsCount();
        },

        deleteSelectedContacts() {
            //TODO: Модальное окно!
            this.contacts = this.contacts.filter(c => !c.isChecked);;

            this.setShowContactsCount();
            this.isChecked = false;
        },

        editContact(itemIndex) {
            const contact = this.contacts[itemIndex];

            this.newContactFirstName = contact.firstName;
            this.newContactLastName = contact.lastName;
            this.newContactPhone = contact.phone;

            this.formTitleText = "Редактировать контакт";
            this.editingContactIndex = itemIndex;
            this.isEditing = true;
        },

        cancelEditContact() {
            this.clearFormsFields();

            this.formTitleText = "Создать контакт";
            this.editingContactIndex = 0;
            this.isEditing = false;
        },

        saveEditContact(itemIndex) {
            if (this.checkNewContactFieldsInvalid()) {
                return;
            }

            const contact = this.contacts[itemIndex];

            if (this.checkExistPhone(contact.id, this.newContactPhone)) {
                return;
            }

            contact.firstName = this.newContactFirstName;
            contact.lastName = this.newContactLastName;
            contact.phone = this.newContactPhone;

            this.cancelEditContact();
        },

        setShowContactsCount() {
            this.searchResultCount = this.contacts.filter(c => c.isShow).length;
        },

        getContactsSearch() {
            this.isSearchModeActive = true;
            const searchText = this.searchFieldText.toLocaleLowerCase();            

            this.contacts.forEach(c => {
                if (c.firstName.toLocaleLowerCase().indexOf(searchText) > -1 || c.lastName.toLocaleLowerCase().indexOf(searchText) > -1
                    || c.phone.toLocaleLowerCase().indexOf(searchText) > -1) {
                    c.isShow = true;                    
                }
                else {
                    c.isShow = false;
                }
            });  

            this.setShowContactsCount();
        },

        cancelContactsSeatch() {
            if (this.isSearchModeActive) {
                this.contacts.forEach(c => {
                    if (!c.isShow) {
                        c.isShow = true;
                    }
                });

                this.isChecked = false;
                this.selectAllCheckbox();

                this.searchFieldText = "";                
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

app.mount("#app");