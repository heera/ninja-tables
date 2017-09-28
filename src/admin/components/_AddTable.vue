<template>
    <!-- MODAL -->
    <div class="modal fade" :style="{ display: modal_visible ? 'block' : 'none'}" :class="modal_visible && 'in'">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal">
                        <span aria-hidden="true">×</span>
                    </button>
                    <h4 v-if="table.ID">{{ $t('Update Table Info') }}</h4>
                    <h4 v-else>{{ $t('Add New Table') }}</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="name">{{ $t('Title') }}</label>
                        <input type="text" id="name" class="form-control" v-model="table.post_title">
                    </div>
                    <div class="form-group">
                        <label>{{ $t('Description') }}</label>
                        <wysiwyg v-model="table.post_content" />
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" @click="closeModal">{{ $t('Cancel') }}</button>
                    <button class="btn btn-primary btn-flex" @click="addTable">
                        <span v-if="table.ID">{{ $t('Update') }}</span>
                        <span v-else>{{ $t('Add') }}</span>
                        <i v-if="btnLoading" class="fooicon fooicon-spin fooicon-circle-o-notch"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- END OF MODAL -->
</template>

<script type="text/babel">
    export default {
        name: 'AddTable',
        props: { 
            modal_visible: Boolean,
            table: {
                type: Object,
                default() {
                    return {
                        ID: null,
                        post_title: '',
                        post_content: ''
                    }
                }
            }
        },
        data() {
            return {
                btnLoading: false
            }
        },
        methods: {
            addTable: function() {
                this.btnLoading = true;
                
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'store-a-table',
                    post_title: this.table.post_title,
                    post_content: this.table.post_content,
                    tableId: this.table.ID
                };
                jQuery.post(ajaxurl, data)
                    .then( (response) => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: 'success'
                        });
                        
                        if(this.table.ID) {
                            this.closeModal();
                        } else {
                            this.$emit('table_inserted', response.table_id);
                        }
                    })
                    .fail( (error) => {
                        if(error.responseJSON.data.message) {
                            this.$message({
                                showClose: true,
                                message: error.responseJSON.data.message,
                                type: 'error'
                            });
                        } else {
                            this.$message({
                                showClose: true,
                                message: error.responseText,
                                type: 'error'
                            });
                        }
                    })
                    .always(() => {
                        this.btnLoading = false;
                    });
            },
            closeModal() {
                this.$emit('modal_close');
            }
        }
    }
</script> 