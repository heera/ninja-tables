<template>
    <div>
        <div class="row clearfix">
            <h1 class="wp-heading-inline">{{ $t('All Tables') }}</h1>
            <!-- <bulk-actions style="margin-top: 10px;" @handle="handleBulkActions" /> -->
            <div style="margin-top:7px" class="pull-right">
                <label class="form_group search_action" for="search">
                    <input v-on:keyup.enter="getData" id="search" class="form-control inline" v-model="searchString" placeholder="Search"  type="text"/>
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
        <hr />
        
        <list-all-tables :searchString="searchString" :searchAction="searchAction" @selection="makeSelection" />

        <add-table-modal @table_inserted="addTableAction" @modal_close="modalVisible = false" :modal_visible.sync="modalVisible"></add-table-modal>
    </div>
</template>

<script type="text/babel">
    const ListAllTables = require('./_ListAllTables.vue');
    const AddTableModal = require('./_AddTable.vue');
    // import BulkActions from "./includes/BulkActions.vue";
    
    
    export default {
        name: 'all_tables',
        components: {
            'list-all-tables' : ListAllTables,
            'add-table-modal': AddTableModal
        //    BulkActions
        },
        data() {
            return {
                modalVisible: false,
                name: 'Jewel',
                searchAction: 0,
                searchString: '',
                selected: []
            }
        },
        methods: {
            addTableAction(tableId) {
                this.$router.push({ name: 'data_columns', params: { table_id: tableId } });
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
                        console.log('delete confirmations');
                    }).catch(() => {
                        console.log('dont delete');
                    });
                }
            }
        },
        mounted: function () {

        },
        beforeMount() {
            this.$options.components['home-extra'] =  (resolve, reject) => {
                // Pass the component definition to the resolve callback
                jQuery.get(ajaxurl, {  action: 'ninja_tables_ajax_actions', target_action: 'get-dynamic-obj', name: this.name  })
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
</style>
