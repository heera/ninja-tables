<template>
    <div class="ninja_type_container">
        <div class="ninja_type_selectors">
            <el-menu :collapse="isCollapse" :default-active="activeTabName">
                <el-menu-item @click="activeTabName = 'default'" index='default'>
                    <i class="el-icon-setting"></i>
                    <span>Default</span>
                </el-menu-item>

                <el-menu-item @click="activeTabName = 'google_spread_sheet'" index='google_spread_sheet'>
                    <i class="el-icon-document"></i>
                    <span>Link To Google Spreadsheet</span>
                </el-menu-item>

                <el-menu-item @click="activeTabName = 'csv'" index='csv'>
                    <i class="el-icon-upload2"></i>
                    <span>Link To An External CSV</span>
                </el-menu-item>

                <el-menu-item @click="activeTabName = 'fluent_form'" index='fluent_form'>
                    <i class="el-icon-tickets"></i>
                    <span>Link To WP FluentForm</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="ninja_type_contents">
                <div v-if="activeTabName == 'default'">
                    <div class="ninja_modal-body">
                        <h3>Create Table Manually</h3>
                        <p class="ninja_subtitle">Create Your table columns and rows manually, You will get full customization over your data</p>
                        <div class="form-group">
                            <label for="name">{{ $t('Table Title') }}</label>
                            <input type="text" id="name" class="form-control" v-model="table.post_title">
                        </div>
                        <div class="form-group">
                            <label>{{ $t('Table Description') }}</label>
                            <wp_editor v-model="table.post_content"></wp_editor>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <el-button type="primary" size="small" @click="addTable">
                            <span v-if="table.ID">{{ $t('Update') }}</span>
                            <span v-else>{{ $t('Add') }}</span>
                            <i v-if="btnLoading" class="fooicon fooicon-spin fooicon-circle-o-notch"></i>
                        </el-button>
                    </div>
                </div>

                <data-source-step v-else-if="activeTabName == 'google_spread_sheet'" type="google-csv" :tableCreated="fireTableCreated" />

                <data-source-step v-else-if="activeTabName == 'csv'" type="csv" :tableCreated="fireTableCreated" />

                <fluent-form-data-source v-else-if="activeTabName == 'fluent_form'" :tableCreated="fireTableCreated" />

        </div>


    </div>


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
                },
                isCollapse: false
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
            checkScreenSize() {
                if(window.innerWidth < 1000) {
                    this.isCollapse = true;
                } else {
                    this.isCollapse = false;
                }
            }
        },
        mounted() {
            this.checkScreenSize();
            jQuery( window ).resize(() => {
                this.checkScreenSize();
            });
        }
    }
</script>

<style lang="scss">
    .ninja_type_container {
        width: 100%;
        display: block;
        overflow: hidden;
        > * {
            box-sizing: border-box;
        }
    }
    .ninja_type_selectors {
        width: auto;
        float: left;
        max-width: 30%;
    }
    .ninja_type_contents {
        width: auto;
        width: 70%;
        float: left;
        padding-left: 20px;
    }
</style>
