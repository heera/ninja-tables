<template>
    <div>
        <div style="margin-top: 15px;">
            <el-container>
                <el-aside width="200px">
                    <el-menu background-color="#545c64"
                             :default-active="active_menu"
                             text-color="#fff"
                             active-text-color="#ffd04b">
                        <el-menu-item  @click="active_menu = 'import'" index="import">
                            <i class="el-icon-upload"></i>
                            <span>{{ $t('Import') }}</span>
                        </el-menu-item>

                        <el-menu-item  @click="active_menu = 'privacy'" index="privacy">
                            <i class="el-icon-setting"></i>
                            <span>{{ $t('Permission') }}</span>
                        </el-menu-item>

                        <el-menu-item  v-if="has_pro"  @click="active_menu = 'license'" index="license">
                            <i class="dashicons dashicons-shield"></i>
                            <span>{{ $t('License') }}</span>
                        </el-menu-item>
                        
                    </el-menu>
                </el-aside>
                <el-main>
                    <template v-if="active_menu == 'import'">
                        <div class="ninja_header">
                            <h2>{{ $t('Import Table') }}</h2>
                        </div>
                        <div class="ninja_content">
                            <div class="ninja_block">
                                <p>
                                    {{ $t('NinjaTables can import tables from existing data, like from a CSV or JSON file. You can also import existing tables from the other WordPress table plugins.') }}
                                </p>
                            </div>
                            
                            <hr/>
                            <div class="ninja_block_section">
                                <h3>Import Table from CSV / JSON File</h3>
                                <p>
                                    Browse and locate a CSV/JSON file you backed up before.
                                </p>
                                <p>
                                    Select the intended format and click <strong>Import</strong> button, we will do
                                    the rest for you.
                                </p>

                                <div class="form">
                                    <!--Import data-->
                                    <div class="form-item">
                                        <template v-if="imports.source == 'file'">
                                            <label>{{ $t('Select file:') }}</label>
                                            <input type="file" id="fileUpload" @click="clear">
                                        </template>
                                        <template v-else-if="imports.source == 'url'">
                                            File upload url
                                        </template>
                                        <template v-else>
                                            <label>{{ $t('Import data:') }}</label>
                                            <textarea rows="10"></textarea>
                                        </template>
                                    </div>

                                    <!--Import format-->
                                    <div class="form-item">
                                        <label for="import_format">{{ $t('Import Format:') }}</label>
                                        <select id="import_format" v-model="imports.format">
                                            <option :value="format"
                                                    v-for="(option, format) in imports.formatOptions"
                                            >{{ $t(option) }}</option>
                                        </select>

                                        <span v-show="imports.format == 'csv'" class="help">
                                Check tutorial for importing data from CSV file <a href="https://wpmanageninja.com/docs/ninja-tables/import-table-data-from-csv/?utm_source=ninja-tables" target="_blank">here</a>
                            </span>
                                        <span v-show="imports.format == 'json' || imports.format == 'ninjaJson'" class="help">
                                Check tutorial for importing Table from JSON file <a href="https://wpmanageninja.com/docs/ninja-tables/import-table-data-from-csv/?utm_source=ninja-tables" target="_blank">here</a>
                            </span>
                                    </div>

                                    <div class="form-item">
                                        <el-button type="primary" size="small" :loading="btnLoading" @click="importTable">
                                            {{ $t('Import') }}
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                            
                            <hr />
                            
                            <div class="ninja_block_section">
                                <h3>Import From Other WP Table Plugin</h3>
                                <p>
                                    To import from other WordPress plugins click the respective <strong>Import</strong> button.
                                </p>
                                <table style="min-width: 400px;">
                                    <tbody>
                                    <tr v-for="(plugin, plugin_key) in otherPlugins">
                                        <td>{{ plugin }}</td>
                                        <td>
                                            <button class="btn btn-default btn-sm"
                                                    @click="importFromOtherPlugin(plugin_key)"
                                            >
                                                <template v-if="btnsLoading[plugin_key]">
                                                    {{ $t('Processing...') }}
                                                    <i class="fooicon fooicon-spin fooicon-circle-o-notch"></i>
                                                </template>
                                                <template v-else>
                                                    {{ $t('Import') }}
                                                </template>
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                        </div>
                    </template>
                    <template v-else-if="active_menu == 'privacy'">
                        <privacy />
                    </template>

                    <template v-else-if="active_menu == 'license'">
                        <license />
                    </template>
                </el-main>
            </el-container>
        </div>

        <el-dialog
                title="Your current tables"
                :visible.sync="showPluginModal"
                @close="closePluginModal()"
        >
            <template v-if="otherPluginTables.length">
                <el-table
                        :data="otherPluginTables"
                        style="width: 100%"
                >
                    <el-table-column label="Name">
                        <template slot-scope="scope">
                            <span v-if="scope.row.is_already_imported">( Already Imported )</span> {{ scope.row.post_title }}
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="Action"
                            fixed="right"
                    >
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini"
                                    @click="importThisTable(scope.row, scope.$index)"
                            >{{ $t('Import') }}</el-button>
                            <router-link
                                    :to="{ name: 'data_items', params: { table_id: scope.row.ninja_table_id } }"
                                    class="el-button el-button--danger el-button--mini ninja_btn"
                                    v-if="scope.row.ninja_table_id" 
                            >{{ $t('View Imported Table') }}
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>

                <template v-if="importing">
                    <br><br>
                    <div class="updated notice notice-success"
                         style="padding: 10px;"
                    >
                        {{ $t('Importing the table, please wait a bit ...') }}
                    </div>
                </template>
            </template>

            <div class="updated notice notice-success"
                 style="padding: 10px;"
                 v-else
            >
                You don't have any tables in your {{ selectedPlugin }} plugin.
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Privacy from './Privacy.vue'
    import License from './Extras/License.vue'

    export default {
        name: 'Tools',
        components: {
            Privacy,
            License
        },
        data() {
            return {
                has_pro: window.ninja_table_admin.hasPro,
                active_menu: 'import',
                activeNames: [
                    '1',
                    '2'
                ],
                imports: {
                    source: 'file',
                    sourceOptions: ['file'],
                    formatOptions: {
                        'csv' : this.$t('CSV - Comma-separated values'),
                        'json' : this.$t('JSON - JavaScript Object Notation'),
                        'ninjaJson': this.$t('JSON - Exported From Ninja Tables'),
                    },
                    format: 'csv'
                },
                btnLoading: false,
                otherPlugins: {
                    'TablePress' : 'Table Press',
                    'UltimateTables': 'Ultimate Tables',
                    'supsystic' : 'Data Tables Generator by Supsystic'
                },
                btnsLoading: {
                    'TablePress': false,
                    'UltimateTables': false
                },
                showPluginModal: false,
                selectedPlugin: null,
                otherPluginTables: [],
                importing: false
            }
        },
        methods: {
            clear() {
                jQuery('#fileUpload').val('');
            },
            importTable() {
                this.btnLoading = true;

                // For now only execute when the import source is `file`
                if (! this.imports.source == 'file') {
                    this.btnLoading = true;
                    return;
                }

                var file = jQuery('#fileUpload')[0].files[0];

                if (! file) {
                    this.btnLoading = false;
                    return;
                }

                var formData = new FormData();

                formData.append('format', this.imports.format);
                formData.append('file', file);
                formData.append('action', 'ninja_tables_ajax_actions');
                formData.append('target_action', 'import-table');

                jQuery.ajax({
                    url: ajaxurl,
                    data: formData,
                    type: 'POST',
                    contentType: false,
                    processData: false,
                    success: (response) => {
                        alert(response.message);

                        this.$router.push({
                            name: 'data_items',
                            params: { table_id: response.tableId }
                        });
                    },
                    error: (error) => {
                        this.btnLoading = false;
                        alert(error.responseJSON.message);
                    }
                });
            },
            importFromOtherPlugin(plugin) {
                this.selectedPlugin = plugin;

                this.btnsLoading[plugin] = true;

                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'get-tables-from-plugin',
                    plugin: plugin
                };

                jQuery.ajax({
                    url: ajaxurl,
                    data: data,
                    type: 'POST',
                    success: (response) => {
                        this.showPluginModal = true;
                        this.otherPluginTables = response.tables;
                        this.btnsLoading[plugin] = false;
                    },
                    error: (error) => {
                        this.btnsLoading[plugin] = false;
                        this.$message.error(error.responseJSON.message);
                    }
                });
            },
            closePluginModal() {
                this.otherPluginTables = [];
                this.btnsLoading[this.selectedPlugin] = false;
                this.showPluginModal = false;
                this.selectedPlugin = null;

            },
            importThisTable(table, index) {
                this.importing = true;

                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'import-table-from-plugin',
                    plugin: this.selectedPlugin,
                    tableId: table.ID
                };

                jQuery.ajax({
                    url: ajaxurl,
                    data: data,
                    type: 'POST',
                    success: (response) => {
                        this.$message.success(response.data.message);
                        this.importing = false;
                        this.$set(this.otherPluginTables[index], 'ninja_table_id', response.data.tableId);
                    },
                    error: (error) => {
                        this.$message.error(error.responseJSON.data.message);
                        this.importing = false;
                    }
                });
            }
        },
        mounted() {
            if(this.$route.query.active_menu) {
                this.active_menu = this.$route.query.active_menu;
            }
            jQuery('.ninja_table_tools_menu').on('click', () => {
                this.active_menu = 'import';
            });

            jQuery('.ninja_table_import_menu').on('click', () => {
                this.active_menu = 'import';
            });
            
            jQuery('.ninja_table_license_menu').on('click', () => {
                this.active_menu = 'license';
            });
            
        }
    }
</script>

<style scoped>
    .form-item {
        margin: 10px 0;
    }
    .form-item label {
        width: 100px;
    }
</style>