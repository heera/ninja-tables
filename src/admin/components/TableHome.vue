<template>
    <div>
        <div class="settings_header">
            <div style="display: inline-block; margin-top: 8px;">
                <el-button class="ninja_mini" size="mini" @click="editTableModalShow = !editTableModalShow"><i title="Edit" class="el-icon-edit action">{{ $t('Edit') }}</i></el-button> <span
                    class="section_title">{{ table.post_title }}</span>
                <el-tooltip effect="dark"
                            content="Click to copy shortcode"
                            title="Click to copy shortcode"
                            placement="top">
                    <code class="copy"
                          :data-clipboard-text='`[ninja_tables id="${tableId}"]`'>
                        <i class="el-icon-document"></i> [ninja_tables id="{{ tableId }}"]
                    </code>
                </el-tooltip>
            </div>

            <span style="margin-right: 20px" class="pull-right">
                <router-link class="btn" :to="{ name: 'help' }">{{ $t('Documentation') }}</router-link>
                <a :href="preview_url" target="_blank">
                    <el-button size="mini">{{ $t('Preview') }}</el-button>
                </a>
                <a v-if="!has_pro"
                   href="https://wpmanageninja.com/downloads/ninja-tables-pro-add-on/?utm_source=ninja-tables&utm_medium=wp&utm_campaign=wp_plugin&utm_term=upgrade"
                   target="_blank">
                    <el-button type="danger" size="mini">{{ $t('Buy Pro') }}</el-button>
                </a>
            </span>
        </div>
        <fieldset :class="[is_form_saving ? 'disabled' : '']" :disabled="is_form_saving">
            <h2 class="nav-tab-wrapper">
                <router-link active-class="nav-tab-active" exact :class="[ 'nav-tab' ]"
                             :to="{ name: 'data_items', params: { table_id: tableId } }">
                    {{ $t('Table Rows') }}
                </router-link>

                <router-link active-class="nav-tab-active" :class="[ 'nav-tab' ]"
                             :to="{ name: 'data_columns', params: { table_id: tableId } }">
                    {{ $t('Table Configuration') }}
                </router-link>
                
                <router-link active-class="nav-tab-active" :class="[ 'nav-tab' ]"
                             :to="{ name: 'design_studio', params: { table_id: tableId } }">
                    {{ $t('Table Design') }}
                </router-link>
                <router-link active-class="nav-tab-active" :class="[ 'nav-tab' ]"
                             :to="{ name: 'additional_css', params: { table_id: tableId } }">
                    {{ $t('Custom CSS') }}
                </router-link>

                <router-link active-class="nav-tab-active" :class="[ 'nav-tab' ]"
                             :to="{ name: 'import-export', params: { table_id: tableId } }">
                    {{ $t('Import - Export') }}
                </router-link>

                <template v-if="size(customTabs)">
                    <router-link v-for="(customTab, tabKey) in customTabs" :key="tabKey" active-class="nav-tab-active"
                                 :class="[ 'nav-tab' ]"
                                 :to="{ name: 'custom_tab', params: { table_id: tableId }, query: { user_tab: tabKey } }"
                                 exact>
                        {{ customTab }}
                    </router-link>
                </template>
            </h2>

            <router-view v-if="config" :config="config"></router-view>

        </fieldset>
        <el-dialog 
                title="Update Table Info" 
                :visible.sync="editTableModalShow"
                top="50px"
                :append-to-body="true"
        >
            <edit_table :table="table" @modal_close="editTableModalShow = !editTableModalShow"></edit_table>
        </el-dialog>
    </div>
</template>

<script type="text/babel">
    import Clipboard from 'clipboard';
    import EditTable from './_AddTable.vue';
    import each from 'lodash/each';
    import size from 'lodash/size';

    export default {
        name: 'table_home',
        components: {
            'edit_table': EditTable
        },
        data() {
            return {
                customTabs: {},
                is_data_saving: false,
                is_form_saving: false,
                tableId: this.$route.params.table_id,
                config: null,
                table: {},
                user_tab: this.$route.query.user_tab,
                editTableModalShow: false,
                preview_url: '#',
                has_pro: window.ninja_table_admin.hasPro
            }
        },
        methods: {
            save_data() {

            },
            updateTableColumns(callback) {
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'update-table-settings',
                    table_id: this.tableId,
                    columns: this.config.columns
                };
                jQuery.post(ajaxurl, data)
                    .success((res) => {
                        this.$message({
                            showClose: true,
                            message: res.message,
                            type: 'success'
                        });
                        callback(res)
                    })
                    .fail((error) => {

                    })
                    .always(() => {
                    });
            },
            getSettings() {
                this.doingAjax = true;
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'get-table-settings',
                    table_id: this.tableId
                };

                jQuery.get(ajaxurl, data)
                    .done(response => {
                        this.config = response;
                        this.table = response.table;
                        this.preview_url = response.preview_url
                    })
                    .fail((error) => {
                        console.log(error);
                    })
                    .always(() => {
                        this.doingAjax = false;
                    });
            },
            goToTab(key) {
                this.user_tab = key;
                this.$router.push({
                    name: 'custom_tab',
                    params: {table_id: this.tableId},
                    query: {user_tab: key}
                });
            },
            size,
            each,
        },
        mounted() {
            this.getSettings();

            var clipboard = new Clipboard('.copy');
            clipboard.on('success', (e) => {
                this.$message({
                    message: 'Copied to Clipboard!',
                    type: 'success'
                });
            });
            
            // Initialize the table's manual data sorting.
            window.ninjaTableBus.$on('initManualSorting', function (options, resolve, reject) {
                let data = {
                    action: "ninja_tables_init_sortable",
                    ...options
                };

                jQuery.post(ajaxurl, data)
                    .success(response => resolve(response))
                    .fail(e => reject(e));
            });

            window.ninjaTableBus.$on('updateTableColumns', (callback) => {
                this.updateTableColumns(callback);
            });
        }
    }
</script>
<style lang="scss">
    .settings_header {
        font-size: 20px;
        padding-bottom: 20px;
        background: white;
        margin-top: -20px;
        padding-top: 20px;
        margin-right: -20px;
        margin-left: -20px;
        padding-left: 24px;
        .action {
            font-size: 16px;
            cursor: pointer;
            &:hover {
                color: #0085ba;
            }
        }
    }
</style>