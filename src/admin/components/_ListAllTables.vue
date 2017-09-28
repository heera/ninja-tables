<template>
    <div>
        
        <table class="wp-list-table widefat fixed striped wpuf-contact-form">
            <thead>
                <tr>
                    <td id="cb" class="manage-column column-cb check-column">
                        <input type="checkbox" v-model="selectAll">
                    </td>
                    <th class="col-table-name">{{ $t('Title') }}</th>
                    <th class="col-table-name">{{ $t('Short Code') }}</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <td id="cb" class="manage-column column-cb check-column">
                        <input type="checkbox" v-model="selectAll">
                    </td>
                    <th class="col-table-name">{{ $t('Title') }}</th>
                    <th class="col-table-name">{{ $t('ShortCode') }}</th>
                </tr>
            </tfoot>
            <tbody>
                <tr v-if="loading">
                    <td v-bind:colspan="3">{{ $t('Loading...') }}</td>
                </tr>
                <tr v-if="!items.length && !loading">
                    <td v-bind:colspan="3">{{ $t('No entries found!') }}</td>
                </tr>
                <tr v-for="(item, index) in items">
                    <th scope="row" class="check-column">
                        <input type="checkbox" name="post[]" v-model="checkedItems" :value="item.ID">
                    </th>
                    <th class="title column-title has-row-actions column-primary page-title">
                        <strong>{{ item.post_title }}<span v-show="item.post_status != 'publish'">({{ item.post_status }})</span></strong>
                        <div class="row-actions">
                            <span class="edit"><router-link :to="{ name: 'data_items', params: { table_id: item.ID } }">{{ $t( 'Edit' ) }}</router-link> | </span>
                            <span class="trash"><a href="#" @click.prevent="confirmDeleteTable(item.ID)">{{ $t('Delete') }}</a></span>
                        </div>
                    </th>
                    <td><code>[ninja_tables id="{{ item.ID }}"]</code></td>
                </tr>
            </tbody>
        </table>
        
        <div class="tablenav bottom">
            <ninja_pagination @change_page="goToPage" :paginate="paginate"></ninja_pagination>
        </div>
    </div>
</template>

<script type="text/babel">
    const pagination = require('@/common/pagination.vue')
    export default {
        name: 'Home',
        components: {
            ninja_pagination: pagination  
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
                    page: this.paginate.current_page
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
        }
    }
</script>