<template>
    <el-container class="ninja-add-table">
        <el-aside v-if="!table.ID" style="background-color: rgb(35, 40, 45);">
            <el-menu :collapse="isCollapse"
                     :default-active="activeTabName"
                     background-color="#23282d"
                     text-color="#eee"
                     active-text-color="#fff"
            >
                <el-menu-item @click="activeTabName = 'default'" index='default'>
                    <i class="el-icon-setting"></i>
                    <span>Default</span>
                </el-menu-item>
                
                <el-menu-item @click="activeTabName = 'import_table'" index="import_table">
                    <i class="el-icon-upload2"></i>
                    <span>Import Table</span>
                </el-menu-item>

                <el-menu-item @click="activeTabName = 'google_spread_sheet'" index='google_spread_sheet'>
                    <span class="dashicons dashicons-media-spreadsheet"></span>
                    <span>Connect Google Sheets</span>
                </el-menu-item>

                <el-menu-item @click="activeTabName = 'csv'" index='csv'>
                    <i class="el-icon-document"></i>
                    <span>Connect External CSV</span>
                </el-menu-item>

                <el-menu-item @click="activeTabName = 'fluent_form'" index='fluent_form'>
                    <img :src="fluentFormIcon" alt="fluent form icon" class="el-icon-fluent-form">
                    <span>Connect Fluent Form</span>
                </el-menu-item>

                <el-menu-item @click="activeTabName = 'wp_posts'" index='wp_posts'>
                    <i class="el-icon-news"></i> <span>WP Posts</span>
                </el-menu-item>
            </el-menu>
        </el-aside>

        <el-main>
            <template v-if="activeTabName == 'default'">
                <div class="ninja_modal-body">
                    <template v-if="!table.ID">
                        <h3>Manually Create a Table</h3>
                        <p class="ninja_subtitle">
                            Manually create your table columns and rows to get complete
                            control over your data with tons of customizations.
                        </p>
                    </template>

                    <div class="form-group">
                        <label for="name">{{ $t('Table Title') }}</label>
                        <input v-model="table.post_title"
                               type="text" id="name" class="form-control"
                               placeholder="Enter a title to identify your table"
                        >
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
            </template>
            
            <import-table v-if="activeTabName === 'import_table'"></import-table>

            <external-data-source v-else-if="activeTabName == 'google_spread_sheet'"
                                  type="google-csv"
                                  :tableCreated="fireTableCreated"
                                  :has-pro="hasPro"
            />

            <external-data-source v-else-if="activeTabName == 'csv'"
                                  type="csv"
                                  :tableCreated="fireTableCreated"
                                  :has-pro="hasPro"
            />

            <fluent-form-data-source v-else-if="activeTabName == 'fluent_form'"
                                     :tableCreated="fireTableCreated"
            />
            <wp-posts-data-source v-else-if="activeTabName == 'wp_posts'"
                                     :tableCreated="fireTableCreated"
            />
        </el-main>
    </el-container>

</template>

<script type="text/babel">
    import wp_editor from '../../common/_wp_editor';
    import WPPosts from './includes/WPPosts';
    import FluentForm from './includes/FluentForm';
    import ExternalDataSource from './includes/ExternalDataSource';
    import ImportTable from './includes/ImportTable';

    export default {
        name: 'add_table',
        components: {
            wp_editor: wp_editor,
            'wp-posts-data-source': WPPosts,
            'fluent-form-data-source': FluentForm,
            'external-data-source': ExternalDataSource,
            ImportTable
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
            },
            hasPro: {
                required: true
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
                isCollapse: false,
                fluentFormIcon: window.ninja_table_admin.fluent_form_icon
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
    .ninja-add-table {
        .el-main {
            padding: 0 1px 0 15px;
            min-height: initial;
        }

        .el-menu {
            border-right: initial;
        }

        .el-menu-item {
            .el-icon-fluent-form {
                height: 18px;
            }

            .dashicons {
                width: 24px;
                height: 18px;
                margin-right: 5px;
            }

            &.is-active {
                background-color: #0073aa !important;
            }
        }

        .el-table .cell {
            text-overflow: initial;
        }
    }
</style>
