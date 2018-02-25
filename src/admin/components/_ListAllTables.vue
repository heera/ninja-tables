<template>
    <div>
        <el-table 
            v-loading.body="pageLoading"
            :data="items"
            border
            style="100%">

            <el-table-column :label="$t('Title')">
                <template slot-scope="scope">
                    <strong>{{ scope.row.post_title }}<span v-show="scope.row.post_status != 'publish'">({{ scope.row.post_status }})</span></strong>
                </template>
            </el-table-column>

            <el-table-column :label="$t('ShortCode')">
                <template slot-scope="scope">
                    <el-tooltip effect="dark"
                                content="Click to copy shortcode"
                                title="Click to copy shortcode"
                                placement="top">
                        <code class="copy"
                                :data-clipboard-text='`[ninja_tables id="${scope.row.ID}"]`'>
                            <i class="el-icon-document"></i> [ninja_tables id="{{ scope.row.ID }}"]
                        </code>
                    </el-tooltip>
                </template>
            </el-table-column>

            <el-table-column :label="$t('Actions')" width="170">
                <template slot-scope="scope">
                    <router-link :to="{ name: 'data_items', params: { table_id: scope.row.ID } }">
                        <el-button size="mini" type="primary">{{ $t( 'Edit' ) }}</el-button>
                    </router-link>
                    <el-button @click.prevent="confirmDeleteTable(scope.row.ID)" size="mini" type="danger">{{ $t('Delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        
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

<script type="text/babel">
    import Clipboard from 'clipboard';
    const pagination = require('../../common/pagination.vue')
    export default {
        name: 'Home',
        props: ['searchAction', 'searchString'],
        components: {
            ninja_pagination: pagination  
        },
        watch: {
            searchAction() {
                this.paginate.current_page = 1;
                this.fetchTables();
            }
        },
        data() {
            return {
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
                    per_page: 10
                }
            }
        },
        methods: {
            fetchTables() {
                this.pageLoading = true;
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'get-all-tables',
                    per_page: this.paginate.per_page,
                    page: this.paginate.current_page,
                    search: this.searchString
                };

                jQuery.get(ajaxurl, data)
                    .done((response) => {
                        this.items = response.data;
                        this.paginate.total = response.total;
                        this.paginate.current_page = response.current_page;
                        this.paginate.last_page = response.last_page;
                        this.pageLoading = false;
                    })
                    .fail((error) => {
                        vueNotification.error('Something went wrong, please try again.');
                    });
            },

            goToPage(value) {
                this.paginate.current_page = value;
                this.fetchTables();
            },

            handleSizeChange(val) {
                this.paginate.per_page = val;
                this.fetchTables();
            },
            
            confirmDeleteTable(tableId) {

                this.$confirm('Are you sure, You want to delete this table?', 'Warning', {
                    confirmButtonText: 'Yes, Delete',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this.deleteTable(tableId);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });
                });
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
                        this.$message({
                            type: 'success',
                            message: response.message
                        });
                    })
                    .fail((error) => {
                        alert(error.responseJSON.data.message);
                    });
            },
            
            handleBulkAction() {
                
            }
        },
        mounted() {
            this.fetchTables();

            var clipboard = new Clipboard('.copy');
            clipboard.on('success', (e) => {
                this.$message({
                    message: 'Copied to Clipboard!',
                    type: 'success'
                });
            });
        }
    }
</script>