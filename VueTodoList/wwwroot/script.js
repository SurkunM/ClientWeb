"use strict";

const app = Vue.createApp({
    data() {
        return {
            newTodoItemText: "",
            newTodoItemId: 1,
            isNewTodoItemTextValid: false,
            items: [],
            deleteItemIndex: 0
        };
    },

    methods: {
        addTodoItem() {
            this.isNewTodoItemTextValid = false;

            const newTodoItemText = this.newTodoItemText;

            if (newTodoItemText.length === 0) {
                this.isNewTodoItemTextValid = true;
                return;
            }

            this.items.push({
                id: this.newTodoItemId,
                text: newTodoItemText
            });

            this.newTodoItemId++;
            this.newTodoItemText = "";
        },

        showDeleteTodoItemConfirm(itemIndex) {
            this.deleteItemIndex = itemIndex;
            this.$refs.confirmDeleteModal.show();
        },

        deleteTodoItem() {
            this.items.splice(this.deleteItemIndex, 1);
            this.$refs.confirmDeleteModal.hide();
        },

        saveTodoItem(itemIndex, newText) {
            this.items[itemIndex].text = newText;
        }
    }
})

app.component("todo-item", {
    props: {
        item: {
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
            editingText: this.item.text
        };
    },

    methods: {
        editTodoItem() {
            this.editingText = this.item.text;
            this.isEditing = true;
        },

        saveTodoItem() {
            this.isEditingTextInvalid = false;

            const editingText = this.editingText;

            if (editingText.length === 0) {
                this.isEditingTextInvalid = true;
                return;
            }

            this.$emit("save", this.index, editingText);
            this.isEditing = false;
        }
    },

    template: `
        <li class="mb-3">
            <template v-if="isEditing">
                <form @submit.prevent="saveTodoItem" class="row g-1">
                    <div class="col">
                        <input v-model.trim="editingText"
                               :class="{ 'is-invalid': isEditingTextInvalid }"
                               class="form-control"
                               type="text">
                        <div class="invalid-feedback">Необходимо задать значение</div>
                    </div>
                    <div class="col-auto">
                        <button class="btn btn-primary ms-1" type="submit">
                            Сохранить
                        </button>
                        <button @click="isEditing = false" class="btn btn-secondary ms-1" type="button">
                            Отмена
                        </button>
                    </div>
                </form>
            </template>
            <template v-else>
                <div class="row">
                    <div class="col todo-text" v-text="item.text"></div>
                    <div class="col-auto">
                        <button @click="editTodoItem" class="btn btn-primary ms-1" type="button">
                            Редактировать
                        </button>
                        <button @click="$emit('delete', index)" class="btn btn-danger ms-1" type="button">
                            Удалить
                        </button>
                    </div>
                </div>
            </template>
        </li>
    `
});

app.component("delete-modal", {
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
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Подтвердите удаление</h5>
                        <button type="button" class="btn-close" @click="hide" aria-label="Закрыть"></button>
                    </div>
                    <div class="modal-body">Вы действительно хотите удалить заметку?</div>
                    <div class="modal-footer">
                        <button @click="$emit('delete-todo-item')" type="button" class="btn btn-danger">Удалить</button>
                        <button type="button" class="btn btn-secondary" @click="hide">Отмена</button>
                    </div>
                </div>
            </div>
        </div>
    `
});

app.mount("#app");