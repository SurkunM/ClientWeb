"use strict";

Vue.createApp({
    data() {
        return {
            newTodoItemText: "",
            newTodoItemId: 1,
            isNewTodoItemTextValid: false,
            items: []
        };
    },

    methods: {
        addTodItem() {
            this.isNewTodoItemTextValid = false;

            const newTodoItemText = this.newTodoItemText;

            if (newTodoItemText.length === 0) {
                this.isNewTodoItemTextValid = true;
                return;
            }

            this.items.push({
                id: this.newTodoItemId,
                text: newTodoItemText,
                isEditing: false,
                editingText: newTodoItemText,
                isEditingTextInvalid: false
            })

            this.newTodoItemId++;

            this.newTodoItemText = "";
        },

        deleteTodoItem(itemIndex) {
            this.items.splice(itemIndex, 1);
        },

        editTodoItem(itemIndex) {
            const item = this.items[itemIndex];
            item.editingText = item.text;
            item.isEditing = true;
        },

        saveTodoItems(itemIndex) {
            const item = this.items[itemIndex];

            item.isEditingTextInvalid = false;

            const editingText = item.editingText

            if (editingText.length === 0) {
                item.isEditingTextInvalid = true;
                return;
            }

            item.text = editingText;
            item.isEditing = false;
        }
    }
}).mount("#app");