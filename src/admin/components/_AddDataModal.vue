<template>
    <!-- MODAL -->
    <div class="modal fade" :style="{display: modal_visible ? 'block' : 'none'}" :class="modal_visible && 'in'">
        <div class="modal-dialog">
            <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal">
                            <span aria-hidden="true">×</span>
                        </button>
                        <h4><span v-if="editId">{{ $t('Update Row') }}</span><span v-else>{{ $t('Add Row') }}</span></h4>
                    </div>
                    <div v-if="modal_visible" class="modal-body">
                        <div v-for="column in columns" class="form-group">
                            <label :for="column.key">{{ column.name }}</label>
                            <div v-if="column.data_type == 'textarea'">
                                <textarea :id="column.key" class="form-control" v-model="newColumn[column.key]"></textarea>
                            </div>
                            <div v-else-if="column.data_type == 'html'">
                                <quill-editor :content="newColumn[column.key]"
                                              :options="editorOption"
                                              @change="onEditorChange(column.key, $event)">
                                </quill-editor>
                            </div>
                            <div v-else>
                                <input type="text" :id="column.key" class="form-control" v-model="newColumn[column.key]">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer row_full">
                        <div v-show="!editId" class="pull-left">
                            <label for="adding_more">
                                <input type="checkbox" id="adding_more" v-model="continueAdding" /> Add Next Item
                            </label>
                        </div>
                        <div class="pull-right">
                            <button class="btn btn-default" @click.prevent="closeModal">{{ $t('Cancel') }}</button>
                            <button type="submit" class="btn btn-primary btn-flex" @click="addData">
                                <span v-if="editId"> {{ $t('Update') }}</span>
                                <span v-else>{{ $t('Add') }}</span>
                                <i v-if="btnLoading" class="fooicon fooicon-spin fooicon-circle-o-notch"></i>
                            </button>
                        </div>
                    </div>
                </div>
        </div>
    </div>
    <!-- END OF MODAL -->
</template>

<script type="text/babel">
    import { each, escape as ninjaEscape } from 'lodash';
    export default {
        name: 'AddData',
        props: ['modal_visible', 'columns', 'table_id', 'item'],
        data() {
            return {
                editorOption: {},
                btnLoading: false,
                editId: null,
                continueAdding: true,
                newColumn: {
                    
                }
            }
        },
        watch: {
            item() {
                this.initNewColumnObj();
                if(this.item) {
                    this.editId = this.item.id;
                } else {
                    this.editId = null;
                }
            }
        },
        methods: {
            addData() {
                let valid = false;
                const encodedColumn = {};
                each(this.newColumn, (value) => {
                        if(value) {
                            valid = true;
                        }
                });
                if(!valid) {
                    this.$message({
                        showClose: true,
                        message: 'Please add at least 1 value to the row',
                        type: 'error'
                    });
                    return;
                }
                this.btnLoading = true;
                
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'store-table-data',
                    table_id: this.table_id,
                    row: this.newColumn,
                    id: this.editId
                };
                let that = this;
                jQuery.post(ajaxurl, data)
                    .then( (response) => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: 'success'
                        });
                        this.initNewColumnObj();
                        
                        if(this.editId) {
                            this.$emit('updateItem', response.item);
                        } else {
                            this.$emit('createItem', response.item);
                        }
                        if(this.editId || !this.continueAdding)  {
                            this.$emit('modal_close');
                        }
                    })
                    .fail( (error) => {
                        this.$message({
                            showClose: true,
                            message: error.responseJSON.data.message,
                            type: 'error'
                        });
                    })
                    .always(() => {
                        this.btnLoading = false;
                    });
            },
            closeModal() {
                this.$emit('modal_close');
            },
            initNewColumnObj() {
                let columnObj = {};
                each(this.columns, (column) => {
                    columnObj[column.key] = (this.item && this.item.values[column.key])
                        ? this.item.values[column.key]
                        : '';
                });
                this.newColumn = columnObj;
            },
            onEditorChange(key, {editor, html, text }) {
                this.newColumn[key] = html;
            }
        },
        mounted() {
            this.initNewColumnObj();
        },
        components: {
        }
    }
</script> 