<template>
    <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabClick">
        <el-tab-pane name='default'>
            <span slot="label"><i class="el-icon-setting"></i> Default</span>
            <div>
               <div class="ninja_modal-body">
                   <div class="form-group">
                       <label for="name">{{ $t('Title') }}</label>
                       <input type="text" id="name" class="form-control" v-model="table.post_title">
                   </div>
                   <div class="form-group">
                       <label>{{ $t('Description') }}</label>
                       <wp_editor v-model="table.post_content"></wp_editor>
                   </div>
               </div>
               <div class="modal-footer">
                   <!-- <el-button
                       type="danger"
                       size="small"
                       @click="closeModal"
                   >{{ $t('Cancel') }}</el-button> -->

                   <el-button type="primary" size="small" @click="addTable">
                       <span v-if="table.ID">{{ $t('Update') }}</span>
                       <span v-else>{{ $t('Add') }}</span>
                       <i v-if="btnLoading" class="fooicon fooicon-spin fooicon-circle-o-notch"></i>
                   </el-button>
               </div>
           </div>
        </el-tab-pane>

        <el-tab-pane name='google_spread_sheet'>
            <span slot="label"><i class="el-icon-document"></i> Link To Google Spreadsheet</span>
            <data-source-step type="google-csv" :tableCreated="fireTableCreated" />
        </el-tab-pane>

        <el-tab-pane name='csv'>
            <span slot="label"><i class="el-icon-upload2"></i> Link To An External CSV</span>
            <data-source-step type="csv" :tableCreated="fireTableCreated" />
        </el-tab-pane>

        <el-tab-pane name='fluent_form'>
            <span slot="label"><i class="el-icon-tickets"></i> Link To FluentForm</span>
            <fluent-form-data-source :tableCreated="fireTableCreated" />
        </el-tab-pane>
    </el-tabs>
</template>

<script type="text/babel">
    import wp_editor from '../../common/_wp_editor';
    import FluentForm from './includes/FluentForm';
    import DataSourcceSettingsStep from './includes/DataSourcceSettingsStep';
    export default {
        name: 'add_table',
        components: {
            wp_editor: wp_editor,
            'fluent-form-data-source': FluentForm,
            'data-source-step': DataSourcceSettingsStep,
        },
        props: { 
            table: {
                type: Object,
                default() {
                    return {
                        ID: null,
                        post_title: '',
                        post_content: '',
                    }
                }
            }
        },
        data() {
            return {
                activeTabName: 'default',
                btnLoading: false,
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike', 'link'],         // toggled buttons
                            ['blockquote', 'code-block'],
                            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                            [{ 'align': [] }],
                            [{ 'direction': 'rtl' }]
                        ]
                    }
                }
            }
        },
        methods: {
            handleTabClick(tab, event) {
                setTimeout(() => {
                    jQuery(tab.$el).find('input:first').focus();
                }, 0);
            },
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
                            this.fireTableCreated(response.table_id);
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
            },
            onEditorChange({ editor, html, text }) {
                this.table.post_content = html
            },
            fireTableCreated(table_id) {
                this.$emit('table_inserted', table_id);
            },
        }
    }
</script> 
