<template>
    <div ref="modal" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Подтвердите удаление</h5>
                    <button type="button" class="btn-close" @click="hide" aria-label="Закрыть"></button>
                </div>
                <div class="modal-body">Вы действительно хотите удалить все выделенные контакты? ({{ count }}) шт.</div>
                <div class="modal-footer">
                    <button @click="$emit('all-selected-delete')" type="button" class="btn btn-danger">Удалить</button>
                    <button @click="hide" type="button" class="btn btn-secondary">Отмена</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>    
    import Modal from "bootstrap/js/dist/modal";

    export default {
        data() {
            return {
                instance: null,
                count: 0
            };
        },

        mounted() {
            this.instance = new Modal(this.$refs.modal);
        },

        methods: {
            show() {
                this.instance.show();
            },

            hide() {
                this.instance.hide();
            },

            setDeletedContactsCount(count) {
                this.count = count;
            }
        },

        emits: {
            "all-selected-delete": null
        }
    }
</script>