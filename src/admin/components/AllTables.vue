<template>
    <div>
        <div class="row clearfix">
            <h1 class="wp-heading-inline">{{ $t('All Tables') }}</h1>
            <div style="margin-top:7px" class="pull-right">
                <label class="form_group search_action" for="search">
                    <input v-on:keyup.enter="getData" id="search" class="form-control inline" v-model="searchString"
                           placeholder="Search" type="text"/>
                    <i @click="getData" class="el-icon-search"></i>
                </label>

                <el-button size="small" type="primary" @click="modalVisible = !modalVisible">
                    {{ $t( 'Add Table' ) }}
                </el-button>

                <router-link :to="{ name: 'tools' }">
                    <el-button size="small" type="success">{{ $t( 'Import Table' ) }}</el-button>
                </router-link>
            </div>
        </div>
        <hr/>

        <list-all-tables
                v-show="published_tables"
                @total_table="published_tables = true"
                :searchString="searchString"
                :searchAction="searchAction"
                @selection="makeSelection"/>

        <div v-if="!published_tables" class="ninja_intro_welcome">
            <h2>Welcome to Ninja Tables</h2>
            <p>Thank you for installing Ninja Tables - Best Responsive Table Plugin for WordPress</p>
            <div class="ninja_actions">
                <el-button type="success" @click="modalVisible = !modalVisible">Click here to create your first Table</el-button>
                <router-link :to="{ name: 'tools' }">
                    <el-button type="info">{{ $t( 'Import From CSV' ) }}</el-button>
                </router-link>
            </div>
            <hr />

            <div class="ninja_docs">
                <h4>Check Ninja Table Documentation:</h4>
                <ul>
                    <li>
                        <a target="_blank" href="https://wpmanageninja.com/docs/ninja-tables/configure-tables/?ninja_intro=1">
                            Demo and Basic Settings
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href="https://wpmanageninja.com/docs/ninja-tables/setting-up-a-table/?ninja_intro=1">
                            Setting up a table
                        </a>
                    </li>
                    <li>
                        <a target="_blank" href="https://wpmanageninja.com/docs/ninja-tables/configure-responsive-breakdowns-for-table/?ninja_intro=1">
                            Make your table looks good in all devices
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <el-dialog 
                :title="$t('Add New Table')" 
                :visible.sync="modalVisible"
                top="50px"
                width="65%"
                :append-to-body="true"
        >
            <add-table-modal @table_inserted="addTableAction" @modal_close="modalVisible = false"></add-table-modal>
        </el-dialog>
        <lead-modal></lead-modal>
    </div>
</template>

<script type="text/babel">
    const ListAllTables = require('./_ListAllTables.vue');
    const AddTableModal = require('./_AddTable.vue');
    const leadModal = require('./Extras/lead');

    export default {
        name: 'all_tables',
        components: {
            'list-all-tables': ListAllTables,
            'add-table-modal': AddTableModal,
            'lead-modal': leadModal
            //    BulkActions
        },
        data() {
            return {
                modalVisible: false,
                published_tables : parseInt(window.ninja_table_admin.published_tables),
                searchAction: 0,
                searchString: '',
                selected: []
            }
        },
        methods: {
            addTableAction(tableId) {
                this.$router.push({name: 'data_items', params: {table_id: tableId}});
                this.modalVisible = false;
            },
            getData() {
                this.searchAction++;
            },
            makeSelection(ids) {
                this.selected = ids;
            },
            handleBulkActions(event) {
                if (event === 'delete') {
                    this.deleteTables();
                }
            },
            deleteTables() {
                if (this.selected.length) {
                    this.$confirm(
                        this.$t('This will permanently delete the selected tables. Continue?'),
                        'Warning',
                        {
                            confirmButtonText: this.$t('Yes, Delete'),
                            cancelButtonText: this.$t('Cancel'),
                            type: 'warning'
                        }
                    ).then(() => {
                       
                    }).catch(() => {
                       
                    });
                }
            }
        },
        mounted: function () {

        },
        beforeMount() {
            this.$options.components['home-extra'] = (resolve, reject) => {
                // Pass the component definition to the resolve callback
                jQuery.get(ajaxurl, {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'get-dynamic-obj',
                    name: this.name
                })
                    .done((res) => {
                        resolve(JSON.parse(res))
                    })
                    .fail((error) => {
                        console.log(error);
                    });
            };
        }
    }
</script>

<style lang="scss">
    label.form_group.search_action {
        padding-top: 0;
        margin-bottom: 0;
    }
    .ninja_intro_welcome {
        max-width: 600px;
        margin: 45px auto 0px;
        padding: 30px 20px;
        background: white;
        text-align: center;
        h2 {
            font-size: 30px;
        }
        .ninja_actions {
            margin-bottom: 30px;
        }
        .ninja_docs {
            text-align: left;
        }
    }
</style>
