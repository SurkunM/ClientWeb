<template>
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
</template>

<script>
    export default {
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

        emits: ["selected-contact", "contact-edit", "contact-delete"]
    }
</script>