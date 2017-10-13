<template>
    <div>
        <div class="settings_header">
            <i title="Edit" @click="editTableModalShow = !editTableModalShow" class="el-icon-edit action"></i> <span class="section_title">{{ table.post_title }}</span><input type="text" :value="'[ninja_tables id='+tableId+']'">
            <span class="pull-right" v-html="context_help"></span>
        </div>
        
        <fieldset :class="[is_form_saving ? 'disabled' : '']" :disabled="is_form_saving">
            <h2 class="nav-tab-wrapper">
                <router-link active-class="nav-tab-active" exact :class="[ 'nav-tab' ]" :to="{ name: 'data_items', params: { table_id: tableId } }">
                    {{ $t('Table Rows') }}
                </router-link>

                <router-link active-class="nav-tab-active" :class="[ 'nav-tab' ]" :to="{ name: 'data_columns', params: { table_id: tableId } }">
                    {{ $t('Table Configuration') }}
                </router-link>

                <router-link active-class="nav-tab-active" :class="[ 'nav-tab' ]"
                             :to="{ name: 'import-export', params: { table_id: tableId } }">
                    {{ $t('Import - Export') }}
                </router-link>
                
                <template v-if="size(customTabs)">
                    <router-link v-for="(customTab, tabKey) in customTabs"  :key="tabKey" active-class="nav-tab-active" :class="[ 'nav-tab' ]"
                                 :to="{ name: 'custom_tab', params: { table_id: tableId }, query: { user_tab: tabKey } }" exact>
                        {{ customTab }}
                    </router-link>
                </template>
            </h2>
            
            <router-view v-if="config" :config="config"></router-view>
            
        </fieldset>
        
        <edit_table :table="table" @modal_close="editTableModalShow = !editTableModalShow" :modal_visible="editTableModalShow"></edit_table>
    </div>
</template>

<script type="text/babel">
    import EditTable from './_AddTable.vue';
    import { each, size } from 'lodash'
    import { tableHomeTabComponents } from '../data/data';
    
    export default {
        name: 'TableHome',
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
                editTableModalShow: false
            }
        },
        methods: {
            save_data() {

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
                   params: { table_id: this.tableId },
                   query: { user_tab: key } 
                });
            },
            size,
            each
        },
        mounted() {
            this.getSettings();
            each(tableHomeTabComponents, (component, key) => {
                this.customTabs[key] = component.title;
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