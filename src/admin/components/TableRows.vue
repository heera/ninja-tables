<template>
    <div>
        <template v-if="columns.length">
            <add_data_modal v-if="columns.length"
                            @modal_close="closeDataModal"
                            @updateItem="updateItemOnTable"
                            @createItem="addItemOnTable"
                            :table_id="tableId" :columns="columns"
                            :item="updateItem"
                            :modal_visible="addDataModal"
            ></add_data_modal>

            <div class="tablenav top">
                <div class="alignleft actions bulkactions">
                    <label for="bulk-action-selector-top" class="screen-reader-text">
                        {{ $t('Select bulk action') }}
                    </label>
                    <select name="action" v-model="bulkAction">
                        <option value="-1">{{ $t('Bulk Actions') }}</option>
                        <option value="delete">{{ $t('Delete Entries')}}</option>
                    </select>
                    <button class="button action" v-on:click.prevent="handleBulkAction">{{ $t('Apply') }}</button>
                    <label for="compact_view" class="form_group">
                        <input id="compact_view" type="checkbox" v-model="isCompact"/> Compact View
                    </label>
                    <label class="form_group search_action" for="search">
                        <input v-on:keyup.enter="getData" id="search" class="form-control inline" v-model="searchString" placeholder="Search"  type="text"/>
                            <i @click="getData" class="el-icon-search"></i>
                    </label>
                </div>
                <div class="pull-right">
                    <button class="button button-primary button-large pull-right" @click="addDataModal = true">
                        {{ $t('Add Data') }}
                    </button>
                </div>
            </div>
            <hr />

            
            <template v-if="columns.length">
                <el-table 
                    v-loading.body="loading"
                    :data="items"
                    border
                    :class="{compact: isCompact}"
                    :style="'width: '+tableWidth"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column
                        type="selection"
                        fixed
                        width="55">
                    </el-table-column>
                    <el-table-column
                        v-for="(column, index) in columns"
                        :label="column.name"
                        :width="(columnLength == index + 1 ) ? '' : 150"
                        :key="index">
                        <template scope="scope">
                            <div :title="scope.row.values[column.key]" class="cell-content" v-html="scope.row.values[column.key]"></div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="Actions"
                        width="100">
                        <template scope="scope">
                            <a @click="showUpdateModal(scope)">
                                <span class="dashicons dashicons-edit"></span>
                            </a>
                            <delete-pop-over @deleted="deleteItem(scope.row.id)"></delete-pop-over>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="tablenav bottom">
                    <div class="alignleft actions bulkactions">
                        <label for="bulk-action-selector-top" class="screen-reader-text">
                            {{ $t('Select bulk action') }}
                        </label>
                        <select name="action" v-model="bulkAction">
                            <option value="-1">{{ $t('Bulk Actions') }}</option>
                            <option value="delete">{{ $t('Delete Entries')}}</option>
                        </select>
                        <button class="button action" v-on:click.prevent="handleBulkAction">{{ $t('Apply') }}</button>
                    </div>
                    <div class="pull-right">
                        <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="goToPage"
                                :current-page.sync="paginate.current_page"
                                :page-sizes="[10, 20, 50, 100]"
                                :page-size="paginate.per_page"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="paginate.total">
                        </el-pagination>
                    </div>
                </div>
            </template>
            <div v-else-if="!loading" type="warning" style="margin-top: 15px" class="error">
                <p>{{ $t('Now add some data to the table.') }}</p>
            </div>
        </template>
        <div v-else-if="!loading" type="warning" style="margin-top: 15px" class="error">
            <p>{{ $t('Please set table configuration first.') }}</p>
        </div>
    </div>
</template>
<script type="text/babel">
    import addDataModal from './_AddDataModal';
    import pagination from '@/common/pagination.vue';
    import Alert from './includes/Alert.vue';
    import DeletePopOver from './includes/DeletePopOver.vue';

    export default {
        name: 'TableDataItems',
        components: {
            add_data_modal: addDataModal,
            ninja_pagination: pagination,
            Alert,
            DeletePopOver
        },
        props: ['config'],
        data() {
            return {
                isCompact: true,
                tableWidth: '100%',
                tableData: [],
                searchString: '',
                doingAjax: false,
                addDataModal: false,
                tableId: this.$route.params.table_id,
                loading: false,
                bulkAction: -1,
                selectAll: 0,
                checkedItems: [],
                pageLoading: false,
                items: [],
                paginate: {
                    total: 0,
                    current_page: 1,
                    last_page: 1,
                    per_page: 20
                },
                multipleSelection: [],
                updateItem: null,
                editIndex: null
            }
        },
        watch: {
            searchString() {
                if(this.searchString == '') {
                    this.getData();
                }
            }  
        },
        computed: {
            columns() {
                return this.config && this.config.columns ? this.config.columns : [];
            },
            columnLength() {
                return this.columns.length
            }
        },
        methods: {
            getData() {
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'get-table-data',
                    table_id: this.tableId,
                    page: this.paginate.current_page,
                    per_page: this.paginate.per_page,
                    search: this.searchString
                };
                this.loading = true;
                jQuery.get(ajaxurl, data)
                    .success((res) => {
                        this.items = res.data;
                        this.paginate.total = parseInt(res.total);
                        this.paginate.last_page = parseInt(res.last_page)
                    })
                    .fail((error) => {
                        
                    })
                    .always(() => {
                        this.loading = false;
                    });
            },
            addTableData() {
                
            },
            getItemNumber(index) {
                return this.paginate.per_page * (this.paginate.current_page -1 ) + (index + 1);
            },
            goToPage(value) {
                this.paginate.current_page = value;
                this.getData();
            },
            handleSizeChange(val) {
                this.paginate.per_page = val;
                this.getData();
            },
            confirmDeleteTable(tableId) {
                if(confirm(this.$t('Are you sure, You want to delete this table'))) {
                    this.deleteTable(tableId);
                }
            },
            deleteTable(tableId) {
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'delete-a-table',
                    table_id: tableId
                };

                jQuery.post(ajaxurl, data)
                    .then((response) => {
                        this.fetchTables();
                        alert(response.message);
                    })
                    .fail((error) => {
                        alert(error.responseJSON.data.message);
                    });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleBulkAction() {
                if (this.multipleSelection.length) {
                    if (this.bulkAction == 'delete') {
                        this.handleBulkDelete();
                    }
                }
            },
            handleBulkDelete() {
                this.$confirm(this.$t('This will permanently delete the selected rows. Continue?'), 'Warning', {
                    confirmButtonText: this.$t('Yes, Delete'),
                    cancelButtonText: this.$t('Cancel'),
                    type: 'warning'
                }).then(() => {
                    let ids = this.multipleSelection.map(item => item.id);
                    this.deleteItem(ids);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('Delete canceled')
                    });
                });
                
            },
            deleteItem(id) {
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'delete-data',
                    table_id: this.tableId,
                    id: id
                };

                let that = this;

                jQuery.post(ajaxurl, data)
                    .then(response => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: 'success'
                        });
                        that.getData();
                    })
                    .fail(error => {
                        this.$message({
                            showClose: true,
                            message: this.$t('Something is wrong! Please try again'),
                            type: 'error'
                        });
                        console.log(error, 'error')
                    });
            },
            closeDataModal(success) {
                this.updateItem = null;
                this.addDataModal = false;
                this.editIndex = null;
                
                if (success) {
                    this.getData();
                }
            },
            updateItemOnTable(item) {
                this.items[this.editIndex].values = item.values;
            },
            addItemOnTable(item) {
                this.items.unshift(item);
                this.paginate.total++;
            },
            showUpdateModal(item) {
                this.updateItem = item.row;
                this.editIndex = item.$index;
                this.addDataModal = true;
            }
        },
        mounted() {
            this.getData();
            this.tableWidth = jQuery('.wrap').width() +'px';
        }
    }
</script> 
<style>
    .el-table {
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .alert-warning {
        color: #8a6d3b;
        background-color: #fcf8e3;
        border-color: #faebcc;
    }
    .alert {
        padding: 15px;
        margin-bottom: 20px;
        border: 1px solid transparent;
        border-radius: 4px;
    }
</style>