<template>
    <div v-cloak class="container">
        <div class="toast-container p-3 top-0 start-50 translate-middle-x">
            <div class="toast bg-success-subtle" v-bind:class="{'show': isSuccessAlertShow}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-all" viewBox="0 0 16 16">
                            <path d="M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0" />
                            <path d="m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708" />
                        </svg>
                        <span class="ms-2" v-text="successAlertText"></span>
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                </div>
            </div>
        </div>

        <div class="toast-container p-3 top-0 start-50 translate-middle-x">
            <div class="toast bg-danger-subtle" v-bind:class="{'show': isErrorAlertShow}" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle mb-1" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                        </svg>
                        <span class="ms-2" v-text="errorAlertText"></span>
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                </div>
            </div>
        </div>

        <div class="row justify-content-center">
            <div class="col-auto">
                <h1 class="mt-3">Phone Book</h1>
            </div>
        </div>

        <form @submit.prevent="createContact" class="mt-2">
            <div class="row justify-content-center">
                <div class="col-lg-3">
                    <h2 class="h5 d-flex justify-content-center">Создать контакт</h2>

                    <div class="mb-1">
                        <label for="first-name-field" class="form-label-sm">Имя</label>
                        <input v-model.trim="firstName"
                               :class="{'is-invalid': isFirstNameFieldValid, 'is-valid': isFirstNameFieldComplete}"
                               @change="checkFirstNameFieldComplete"
                               type="text"
                               class="form-control form-control-sm"
                               id="first-name-field"
                               autocomplete="off">
                        <div class="invalid-feedback">Заполните поле Имя</div>
                    </div>

                    <div class="mb-1">
                        <label for="last-name-field" class="form-label-sm">Фамилия</label>
                        <input v-model.trim="lastName"
                               :class="{'is-invalid': isLastNameFieldValid, 'is-valid':isLastNameFieldComplete}"
                               @change="checkLastNameFieldComplete"
                               type="text"
                               class="form-control form-control-sm"
                               id="last-name-field"
                               autocomplete="off">
                        <div class="invalid-feedback">Заполните поле Фамилия</div>
                    </div>

                    <div class="mb-2">
                        <label for="phone-field" class="form-label-sm">Телефон</label>
                        <input v-model.trim="phone"
                               :class="{'is-invalid': isPhoneFieldValid, 'is-valid': isPhoneFieldComplete}"
                               @change="checkPhoneFieldComplete"
                               type="text"
                               class="form-control form-control-sm"
                               id="phone-field"
                               autocomplete="off">
                        <div v-text="phoneInvalidText" class="invalid-feedback"></div>
                    </div>

                    <div class="d-flex justify-content-end">
                        <button type="submit" class="btn btn-primary">Создать</button>
                    </div>
                </div>
            </div>
        </form>

        <h2 class="h5 text-center mb-3">Поиск</h2>

        <form @submit.prevent="searchContacts" class="row row-cols-lg-auto g-3 justify-content-center">
            <div class="col-lg-3">
                <input v-model.trim="term" type="text" class="form-control" placeholder="Найти контакт">
                <template v-if="isSearchModeActive">
                    <div class="col-auto d-flex justify-content-center">
                        <div v-text="searchResultText" class="badge bg-success text-wrap mt-2 mx-auto" style="width: 11rem;"></div>
                    </div>
                </template>
            </div>
            <div class="col-auto">
                <button type="submit" class="btn btn-primary me-1">Поиск</button>
                <button @click="cancelContactsSearch" type="button" class="btn btn-secondary">Сбросить</button>
            </div>
        </form>

        <div class="table-responsive mt-2">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>
                            <label class="d-flex justify-content-sm-center">
                                <input v-model="isAllChecked" @change="selectAllCheckbox(isAllChecked)" class="form-check-input" type="checkbox">
                            </label>
                        </th>
                        <th>№</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Телефон</th>
                        <th>
                            <div class="d-flex justify-content-center">
                                <button @click="showAllSelectedDeleteConfirm" :disabled="checkedContactsCount === 0" class="btn btn-danger">Удалить все</button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    <phone-book-item v-for="(contact, index) in contacts"
                                     :contact="contact"
                                     :index="index"
                                     :key="contact.id"
                                     v-show="contact.isShown"
                                     @contact-delete="showSingleDeleteConfirm"
                                     @contact-edit="showEditContactModal"
                                     @selected-contact="checkSelected">
                    </phone-book-item>
                </tbody>
            </table>
        </div>

        <editing-modal ref="contactEditingModal" @save="saveEditContact" @check-phone="checkEditedContactPhone"></editing-modal>

        <single-delete-modal ref="confirmSingleDeleteModal" @delete="deleteSingleContact"></single-delete-modal>

        <all-selected-delete-modal ref="confirmAllSelectedDeleteModal" @all-selected-delete="deleteAllSelectedContacts"></all-selected-delete-modal>
    </div>
</template>

<script>      
    import PhoneBookService from "../js/phoneBookService";
    import PhoneBookItem from "./PhoneBookItem.vue";

    import SingleDeleteModal from "./SingleDeleteModal.vue";
    import EditingModal from "./EditingModal.vue";
    import AllSelectedDeleteModal from "./AllSelectedDeleteModal.vue";

    export default {
        components: {
            PhoneBookItem,
            EditingModal,
            SingleDeleteModal,
            AllSelectedDeleteModal
        },

        data() {
            return {
                service: new PhoneBookService(),
                contacts: [],

                firstName: "",
                lastName: "",
                phone: "",

                phoneInvalidText: "",
                phoneExistErrorCode: "phoneExistError",

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
                    this.isSuccessAlertShow = false;
                }, 1500);
            },

            showErrorAlert(text) {
                this.errorAlertText = text;
                this.isErrorAlertShow = true;

                setTimeout(() => {
                    this.errorAlertText = "";
                    this.isErrorAlertShow = false;
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
                } else {
                    this.isLastNameFieldComplete = false;
                }
            },

            checkPhoneFieldComplete() {
                if (this.phone.length > 0) {
                    this.isPhoneFieldValid = false;
                    this.isPhoneFieldComplete = true;
                } else {
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

                let isInvalid = false;

                if (this.firstName.length === 0) {
                    this.isFirstNameFieldValid = true;
                    isInvalid = true;
                }

                if (this.lastName.length === 0) {
                    this.isLastNameFieldValid = true;
                    isInvalid = true;
                }

                if (this.phone.length === 0) {
                    this.phoneInvalidText = "Заполните поле телефон";
                    this.isPhoneFieldValid = true;
                    isInvalid = true;
                }

                if (isNaN(Number(this.phone))) {
                    this.phoneInvalidText = "Неверный формат для поля телефон";
                    this.isPhoneFieldValid = true;
                    isInvalid = true;
                }

                return isInvalid;
            },

            getContacts() {
                this.service.getContacts(this.term.trim())
                    .then(contacts => {
                        this.contacts = contacts;

                        if (this.isAllChecked) {
                            this.selectAllCheckbox(true);
                        }

                        if (this.isSearchModeActive) {
                            this.setShowContactsCount();
                        }
                    })
                    .catch(() => {
                        this.showErrorAlert("Ошибка загрузки данных с сервера!");
                    });
            },

            createContact() {
                if (this.checkFormFieldsInvalid()) {
                    return;
                }

                const contact = {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    phone: this.phone,

                    isChecked: false,
                    isShown: true
                };

                this.service.createContact(contact)
                    .then(response => {
                        if (!response.success) {
                            if (response.message === this.phoneExistErrorCode) {
                                this.phoneInvalidText = "Контакт с таким телефоном уже существует!";
                                this.isPhoneFieldValid = true;
                            } else {
                                this.showErrorAlert("Введены не коректные данные!");
                            }
                            return;
                        }

                        this.getContacts();
                        this.clearFormsFields();
                        this.showSuccessAlert("Контакт успешно создан!");
                    })
                    .catch(response => {
                        this.showErrorAlert("При создании контакта произошла ошибка!");
                    });
            },

            showSingleDeleteConfirm(contact) {
                this.selectedContact = contact;
                this.$refs.confirmSingleDeleteModal.show();
            },

            deleteSingleContact() {
                this.service.deleteContact(this.selectedContact.id)
                    .then((response) => {
                        const x = response.message;
                        this.getContacts();
                        this.showSuccessAlert("Контакт успешно удален!");
                        if (this.isSearchModeActive) {
                            this.setShowContactsCount();
                        }
                    })
                    .catch(() => {
                        this.showErrorAlert("Ошибка! Не удалось удалить контакт");
                    })
                    .finally(() => {
                        this.$refs.confirmSingleDeleteModal.hide();
                    });
            },

            showAllSelectedDeleteConfirm() {
                this.$refs.confirmAllSelectedDeleteModal.setDeletedContactsCount(this.checkedContactsCount);
                this.$refs.confirmAllSelectedDeleteModal.show();
            },

            deleteAllSelectedContacts() {
                const contactsId = this.contacts
                    .filter(c => c.isChecked)
                    .map(c => c.id);
                this.service.deleteSelectedContacts(contactsId)
                    .then(response => {
                        if (!response.success) {
                            this.showErrorAlert(response.message);
                            return;
                        }

                        this.showSuccessAlert("Контакты успешно удалены!");
                        this.checkedContactsCount = 0;
                        this.isAllChecked = false;

                        if (this.isSearchModeActive) {
                            this.setShowContactsCount();
                        }
                    })
                    .catch(() => {
                        this.showErrorAlert("Ошибка! Не удалось удалить контакты");
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
                            if (response.message === this.phoneExistErrorCode) {
                                this.$refs.contactEditingModal.setPhoneExistInvalid();
                            } else {
                                this.$refs.contactEditingModal.checkEditFormFieldsInvalid();
                            }
                            return;
                        }

                        this.getContacts();
                        this.$refs.contactEditingModal.hideEditingForm();
                        this.showSuccessAlert("Контакт успешно изменен");
                    })
                    .catch(() => {
                        this.showErrorAlert("Ошибка редактирования! Попробуйие еще раз");
                    });
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

                this.checkedContactsCount = 0;
                this.isAllChecked = false;
                this.getContacts();
            },

            cancelContactsSearch() {
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

            selectAllCheckbox(isChecked) {
                this.isAllChecked = isChecked;

                this.contacts.forEach(c => {
                    if (c.isShown) {
                        c.isChecked = isChecked;
                    }
                });

                this.checkedContactsCount = this.contacts.filter(c => c.isChecked).length;
            }
        }
    }
</script>

<style lang="scss">
    [v-cloak] {
        display: none;
    }
</style>