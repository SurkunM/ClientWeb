<template>
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
</template>

<script>
    "use strict";
    import Modal from "bootstrap/js/dist/modal";

    export default {
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
            this.instance = new Modal(this.$refs.editingModal);
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
        }
    }
</script>