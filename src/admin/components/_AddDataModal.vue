<template>
    <el-dialog
            :title="title"
            :visible.sync="show"
            top="50px"
            :append-to-body="true"
            @close="closeModal">
        <div v-if="show">
            <div v-for="column in columns" class="form-group">
                <label :for="slugify(column.key)">{{ column.name || column.key }}</label>
                <div v-if="column.data_type == 'textarea'">
                    <textarea :placeholder="column.name" :id="slugify(column.key)" class="form-control"
                              v-model="newColumn[column.key]"></textarea>
                </div>
                <div v-else-if="column.data_type == 'html'">
                    <wp_editor :editor_id="slugify(column.key)" v-model="newColumn[column.key]"></wp_editor>
                </div>
                <div v-else-if="column.data_type == 'number'">
                    <input :placeholder="column.name" type="text" :id="slugify(column.key)" class="form-control"
                           v-model="newColumn[column.key]">
                </div>
                <div v-else-if="column.data_type == 'date'">
                    <ninja-date-picker :column="column" :new_column="newColumn"></ninja-date-picker>
                </div>
                <div v-else-if="column.data_type == 'selection'">
                    <el-select
                            style="width: 100%"
                            v-model="newColumn[column.key]"
                            filterable
                            allow-create
                            default-first-option
                            placeholder="Choose One from List">
                        <el-option
                                v-for="item in getFromSelectionStr(column.selections)"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                </div>
                <div v-else>
                    <input :placeholder="column.name" type="text" :id="slugify(column.key)" class="form-control"
                           v-model="newColumn[column.key]">
                </div>
            </div>

            <div v-if="!editId && manualSort && !insertAfterPosition">
                Add at
                <input type="radio" v-model="position" value="last" style="margin-left: 5px;">Last
                <input type="radio" v-model="position" value="first" style="margin-left: 10px;">First
            </div>
        </div>

        <div slot="footer" class="dialog-footer" :class="{ 'single-child': shouldNotContinueAdding }">
            <template v-if="!shouldNotContinueAdding">
                <div>
                <label for="adding_more" class="dialog-footer-item">
                    <input type="checkbox" id="adding_more" v-model="continueAdding"/> Continue Adding
                </label>
                </div>
            </template>

            <div class="dialog-footer-item">
                <el-button @click.prevent="closeModal" type="danger" size="small">{{ $t('Cancel') }}</el-button>
                <el-button v-loading="btnLoading" :disabled="btnLoading" type="primary" size="small" @click="addData">
                    <span v-if="editId"> {{ $t('Update') }}</span>
                    <span v-else>{{ $t('Add') }}</span>
                    <i v-if="btnLoading" class="fooicon fooicon-spin fooicon-circle-o-notch"></i>
                </el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script type="text/babel">
    import each from 'lodash/each';

    import wp_editor from '../../common/_wp_editor';
    import NinjaDatePicker from './Extras/_NinjaDatePicker'

    export default {
        name: 'add_data',
        props: ['title', 'show', 'columns', 'table_id', 'item', 'manualSort', 'insertAfterPosition', 'type'],
        data() {
            return {
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike', 'link'],        // toggled buttons
                            ['blockquote', 'code-block'],

                            [{'header': 1}, {'header': 2}],               // custom button values
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
                            [{'align': []}],
                            [{'direction': 'rtl'}]
                        ]
                    }
                },
                btnLoading: false,
                continueAdding: true,
                newColumn: {},
                has_pro: !!window.ninja_table_admin.hasPro,
                position: 'last',
                modal_title: 'Add Row'
            }
        },
        computed: {
            editId() {
                return this.item && this.item.id;
            },
            shouldNotContinueAdding() {
                return !!(this.editId || this.type === 'duplicate');
            }
        },
        watch: {
            item() {
                this.initNewColumnObj();

                if (!this.item) {
                    this.modal_title = 'Add Row'
                }
            }
        },
        methods: {
            addData() {
                let valid = false;
                const encodedColumn = {};
                each(this.newColumn, (value) => {
                    if (value) {
                        valid = true;
                    }
                });
                if (!valid) {
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
                    id: this.editId,
                };

                if (this.manualSort) {
                    if (this.insertAfterPosition) {
                        data['position'] = this.insertAfterPosition + 1;
                    } else {
                        data['position'] = this.position;
                    }
                }

                jQuery.post(ajaxurl, data)
                    .then((response) => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: 'success'
                        });
                        this.initNewColumnObj();

                        if (this.editId) {
                            this.$emit('updateItem', response.item);
                        } else {
                            this.$emit('createItem', response.item);
                        }
                        if (this.editId || !this.continueAdding) {
                            this.$emit('modal_close');
                        }
                        if(this.type === 'duplicate') {
                            this.$emit('modal_close');
                        }
                    })
                    .fail((error) => {
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
            onEditorChange(key, {editor, html, text}) {
                this.newColumn[key] = html;
            },
            slugify(text) {
                return text.toString().toLowerCase()
                    .replace(/\s+/g, '-')           // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                    .replace(/^-+/, '')             // Trim - from start of text
                    .replace(/-+$/, '');            // Trim - from end of text
            },
            getFromSelectionStr(str) {
                return str.split("\n");
            }
        },
        mounted() {
            this.initNewColumnObj();
        },
        components: {
            wp_editor: wp_editor,
            NinjaDatePicker
        }
    }
</script>

<style lang="scss">
    .dialog-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        &.single-child {
            justify-content: flex-end;
        }
    }
</style>
