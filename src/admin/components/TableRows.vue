<template>
    <div>
        <template v-if="columns.length ">
            <add_data_modal v-if="columns.length && addDataModal"
                            :title="addDataModalTitle"
                            :show="addDataModal"
                            @modal_close="closeDataModal"
                            @updateItem="updateItemOnTable"
                            @createItem="addItemOnTable"
                            :table_id="tableId"
                            :columns="columns"
                            :item="updateItem"
                            :manual-sort="config.settings.sorting_type === 'manual_sort'"
                            :insert-after-position="insertAfterPosition"
                            :type="dataModalType"
            ></add_data_modal>

            <div v-if="dataSourceType == 'fluent-form'" class="tablenav top">
                <el-row>
                    <el-col :md="20">
                        <el-alert
                            show-icon
                            type="info"
                            title="Table Settings"
                            :closable="false">
                                {{ isEditableMessage }}
                        </el-alert>
                    </el-col>

                    <el-col :md="4">
                        <el-button
                        :loading="syncing"
                        @click="updateTableSettings">Sync Table Settings</el-button>
                    </el-col>

                </el-row>
            </div>

            <div v-if="dataSourceType == 'external'" class="tablenav top">
                <el-alert
                    show-icon
                    type="info"
                    title="Table Settings"
                    :closable="false">
                        {{ isEditableMessage }}
                        <span
                            style="color:#0073aa;cursor:pointer;"
                            @click="isUpdatingTableSettings = !isUpdatingTableSettings">
                                {{ isUpdatingTableSettings ? 'Hide Settings' : 'Show Settings' }}
                        </span>
                </el-alert>

                <div v-show="isUpdatingTableSettings">
                    <el-input
                    placeholder="Remote URL..."
                    v-model="externalDataSourceUrl"
                    v-on:keyup.enter="updateTableSettings">
                        <el-button
                        slot="append"
                        :loading="syncing"
                        @click="updateTableSettings">Sync Table Settings</el-button>
                    </el-input>
                </div>
            </div>

            <div v-if="isEditable" class="tablenav top">
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
                        <input v-on:keyup.enter="getData" id="search" class="form-control inline" v-model="searchString"
                               placeholder="Search" type="text"/>
                        <i @click="getData" class="el-icon-search"></i>
                    </label>

                    <label>
                        <input type="checkbox" name="checkbox" v-model="sorting">
                        Sort Manually
                        <template v-if="!has_pro">(Pro Feature)</template>
                    </label>
                </div>
                <div class="pull-right">
                    <el-button size="small" type="primary" @click="add()"> {{ $t('Add Data') }}</el-button>
                    <el-button size="small" type="info" @click="addColumn()"> {{ $t('Add Column') }}</el-button>
                </div>
            </div>
            <hr/>

            <template v-if="columns.length">
                <el-table
                        class="js-sortable-table"
                        v-loading="loading"
                        :data="items"
                        row-key="id"
                        border
                        :class="{ compact: isCompact, sorting: sorting}"
                        :style="'width: '+tableWidth"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column
                            v-if="isEditable"
                            type="selection"
                            fixed
                            width="55">
                    </el-table-column>
                    <el-table-column
                            v-for="(column, index) in columns"
                            :label="column.name || column.key"
                            :render-header="addConfigIcon"
                            :width="(columnLength == index + 1 ) ? '' : 150"
                            :key="index">
                        <template slot-scope="scope">
                            <div :title="scope.row.values[column.key]" class="cell-content"
                                 v-html="scope.row.values[column.key]"></div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            v-if="isEditable"
                            fixed="right"
                            label="Actions"
                            class-name="actions"
                            width="120">
                        <template slot-scope="scope">
                            <a v-if="has_pro" @click="addAfter(scope)">
                                <el-tooltip placement="top-end" effect="light" content="Add data" :open-delay="500">
                                    <span class="dashicons dashicons-plus"></span>
                                </el-tooltip>
                            </a>

                            <a @click="showUpdateModal(scope)">
                                <el-tooltip placement="top-end" effect="light" content="Edit data" :open-delay="500">
                                    <span class="dashicons dashicons-edit"></span>
                                </el-tooltip>
                            </a>

                            <a @click="duplicateData(scope)">
                                <el-tooltip placement="top-end" effect="light" content="Duplicate data"
                                            :open-delay="500">
                                    <span class="dashicons dashicons-admin-page"></span>
                                </el-tooltip>
                            </a>
                            <delete-pop-over @deleted="deleteItem(scope.row.id)"></delete-pop-over>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="tablenav bottom">
                    <div v-if="isEditable" class="alignleft actions bulkactions">
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
                                :page-sizes="[10, 20, 50, 100, 500, 2000]"
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
        <div v-else-if="!loading" type="warning" style="margin-top: 15px; text-align: center" class="instruction_block">
            <h3>{{ $t('To get started please add table columns') }}</h3>
            <el-button @click="addColumn()" type="primary">
                Add Column
            </el-button>
        </div>

        <sortable-upgrade-notice :show="sortableUpgradeNotice" @close="sortableUpgradeNotice = false"/>

        <el-dialog title="Edit Table Column" :visible.sync="showColumnEditor">
            <columns-editor :model="currentEditingColumn" :has-pro="has_pro"
                            :updating="true"
                            v-if="showColumnEditor"
                            :hideDelete="true"
                            @store="storeSettings()"
                            @cancel="showColumnEditor = false"
            />
        </el-dialog>

        <el-dialog title="Add Table Column" width="65%" :visible.sync="columnModal">
            <columns-editor :model="new_column" :has-pro="has_pro"
                            @add="addNewColumn()"
                            @cancel="columnModal = !columnModal"
            />
        </el-dialog>
    </div>
</template>
<script type="text/babel">
    import Sortable from 'sortablejs';

    import findIndex from 'lodash/findIndex';
    import snakeCase from 'lodash/snakeCase'

    import addDataModal from './_AddDataModal';
    import pagination from '../../common/pagination.vue';
    import Alert from './includes/Alert.vue';
    import DeletePopOver from './includes/DeletePopOver.vue';
    import SortableUpgradeNotice from './includes/SortableUpgradeNotice.vue';
    import columnsEditor from './includes/ColumnsEditor'

    export default {
        name: 'TableDataItems',
        components: {
            add_data_modal: addDataModal,
            ninja_pagination: pagination,
            Alert,
            DeletePopOver,
            SortableUpgradeNotice,
            columnsEditor
        },
        props: ['config', 'getColumnSettings'],
        data() {
            return {
                columnModal: false,
                new_column: {
                    name: '',
                    key: '',
                    breakpoints: '',
                    data_type: 'text',
                    dateFormat: '',
                    header_html_content: "",
                    enable_html_content: false
                },
                has_pro: !!window.ninja_table_admin.hasPro,
                hasSortable: !!window.ninja_table_admin.hasSortable,
                isCompact: true,
                tableWidth: '100%',
                tableData: [],
                searchString: '',
                doingAjax: false,
                addDataModal: false,
                tableId: this.$route.params.table_id,
                loading: false,
                syncing: false,
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
                editIndex: null,

                // is table row soring enabled flag.
                sorting: false,
                sortableInstance: null,
                sortableUpgradeNotice: false,
                // insert after
                insertAfterPosition: null,

                showColumnEditor: false,
                currentEditingColumn: false,
                addDataModalTitle: 'Add Row',
                dataModalType: 'add',
                dataSource: 'default',
                // Used for external data sources
                isUpdatingTableSettings: false,
                externalDataSourceUrl: this.config.table.remoteURL,
            }
        },
        watch: {
            searchString() {
                if (this.searchString == '') {
                    this.getData();
                }
            },
            sorting(newVal) {
                if (newVal) {
                    if (!this.has_pro) {
                        this.sorting = false;
                        window.ninjaTableBus.$emit('show_pro_popup');

                        return;
                    }

                    if (!this.hasSortable) {
                        this.sorting = false;
                        this.sortableUpgradeNotice = true;

                        return;
                    }
                }

                this.toggleSorting(newVal);
            },
            'new_column.name': function () {
                this.new_column.key = snakeCase(this.new_column.name)
            },
        },
        computed: {
            columns() {
                return this.config && this.config.columns ? this.config.columns : [];
            },
            columnLength() {
                return this.columns.length
            },
            dataSourceType() {
                const c = this.config;
                return (c && 'dataSourceType' in c.table) ? c.table.dataSourceType : 'default';
            },
            isEditable() {
                const c = this.config;
                return (c && 'isEditable' in c.table) ? c.table.isEditable : true;
            },
            isEditableMessage() {
                const c = this.config;
                return (c && 'isEditableMessage' in c.table) ? c.table.isEditableMessage : null;
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
                    search: this.searchString,
                    default_sorting: this.config.settings.default_sorting
                };
                this.loading = true;
                return jQuery.get(ajaxurl, data)
                    .success((res) => {
                        this.items = res.data;
                        this.dataSource = res.data_source;
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
                return this.paginate.per_page * (this.paginate.current_page - 1) + (index + 1);
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
                if (confirm(this.$t('Are you sure, You want to delete this table'))) {
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

                    });
            },
            closeDataModal(success) {
                this.addDataModal = false;
                // this.updateItem = null;
                this.editIndex = null;
                this.insertAfterPosition = null;
                this.dataModalType = 'add';

                if (success) {
                    this.getData();
                }
            },
            updateItemOnTable(item) {
                this.items[this.editIndex].values = item.values;
            },
            addItemOnTable(item) {
                let position = item.position;

                if (position) {
                    if (position === 'last') {
                        this.items.push(item);
                    } else if (position === 'first') {
                        this.items.unshift(item);
                    } else {
                        this.items.splice(position - 1, 0, item);
                    }
                } else {
                    this.items.unshift(item);
                }


                if (this.insertAfterPosition) {
                    this.insertAfterPosition += 1;
                }

                this.paginate.total++;
            },
            showUpdateModal(item) {
                this.updateItem = item.row;
                this.editIndex = item.$index;
                this.addDataModal = true;
                this.dataModalType = 'update';
                this.addDataModalTitle = 'Update Row';
            },

            addColumn() {
                this.columnModal = true;
            },

            validateColumn(column) {
                if (!column.name) {
                    this.$message({
                        showClose: true,
                        message: this.$t('Name is required'),
                        type: 'error'
                    });
                    return false;
                }
                if (!column.key) {
                    this.$message({
                        showClose: true,
                        message: this.$t('Column Key is required'),
                        type: 'error'
                    });
                    return false;
                }
                // check uniqueness
                let uniqueStatus = findIndex(this.columns, (co) => {
                    return co.key == column.key
                });
                if (uniqueStatus === -1) {
                    return true;
                }
                this.$message({
                    showClose: true,
                    message: this.$t('Column Key needs to be unique. Please add a suffix / prefix to make it unique'),
                    type: 'error'
                });
                return false;
            },

            addNewColumn() {
                if (this.validateColumn(this.new_column)) {
                    this.config.columns.push(this.new_column);
                    this.new_column = {
                        name: '',
                        key: '',
                        breakpoints: '',
                        data_type: 'text',
                        dateFormat: '',
                        header_html_content: "",
                        enable_html_content: false
                    };
                    this.columnModal = false;
                    this.storeSettings();
                }
            },

            /**
             * Sortable JS initiate for table
             */
            initSortable() {
                const table = document.querySelector('.js-sortable-table tbody');
                const self = this;
                this.sortableInstance = Sortable.create(table, {
                    onEnd({newIndex, oldIndex}) {
                        let oldItem = self.items[oldIndex];
                        self.sortTable(oldItem.id, self.items[newIndex].position);

                        const targetRow = self.items.splice(oldIndex, 1)[0];

                        self.items.splice(newIndex, 0, targetRow);
                    }
                });
            },
            toggleSorting(shouldSort) {
                if (shouldSort) {
                    this.loading = true;

                    let promise = new Promise((resolve, reject) => {
                        window.ninjaTableBus.$emit('initManualSorting', {
                            table_id: this.tableId,
                            page: this.paginate.current_page,
                            per_page: this.paginate.per_page,
                            search: this.searchString,
                            default_sorting: this.config.settings.default_sorting
                        }, resolve, reject);
                    });

                    promise.then(res => {
                        this.items = res.data;
                        this.paginate.total = parseInt(res.total);
                        this.paginate.last_page = parseInt(res.last_page);

                        // Manually set the sorting type so that we
                        // don't need to load the settings again.
                        this.config.settings['sorting_type'] = 'manual_sort';

                        this.initSortable();
                    }).catch(e => {
                        console.log(e);
                    }).then(() => {
                        this.loading = false;
                    });
                } else {
                    if (this.sortableInstance) {
                        this.sortableInstance.destroy();
                    }
                }
            },
            sortTable(id, newPosition) {
                this.loading = true;

                let data = {
                    action: "ninja_tables_sort_table",
                    table_id: this.tableId,
                    id,
                    newPosition,
                    page: this.paginate.current_page,
                    per_page: this.paginate.per_page,
                    search: this.searchString,
                    default_sorting: this.config.settings.default_sorting
                };

                jQuery
                    .post(ajaxurl, data)
                    .then(res => {
                        this.items = res.data;
                        this.paginate.total = parseInt(res.total);
                        this.paginate.last_page = parseInt(res.last_page)
                    })
                    .fail(e => {
                        console.log(e);
                    })
                    .always(() => {
                        this.loading = false;
                    });
            },
            add() {
                this.updateItem = null;
                this.insertAfterPosition = null;
                this.addDataModal = true;
                this.dataModalType = 'add';
                this.addDataModalTitle = 'Add Data';
            },
            addAfter(scope) {
                if (!this.hasSortable) {
                    this.sortableUpgradeNotice = true;
                    return
                }

                this.updateItem = null;
                this.addDataModalTitle = 'Add Data';
                this.dataModalType = 'add-after';
                this.insertAfterPosition = scope.$index + 1;
                this.addDataModal = true;
            },
            addConfigIcon(h, {column, $index}) {
                let self = this;
                let result = h('i', {
                    props: {
                        size: 'mini',
                        class: "el-icon-setting",
                        plain: true,
                        round: true
                    },
                    class: 'el-icon-setting nt-column-config',
                    on: {
                        click(query) {
                            self.showColumnConfigModal($index - 1)
                        }
                    }
                });
                return h('span', null, [column.label, result]);
            },
            showColumnConfigModal(columnIndex) {
                this.currentEditingColumn = this.columns[columnIndex];
                this.showColumnEditor = true;
            },
            storeSettings() {
                window.ninjaTableBus.$emit('updateTableColumns', () => {
                    this.showColumnEditor = false;
                    this.currentEditingColumn = false;
                });
            },
            duplicateData(item) {
                this.updateItem = Object.assign({}, item.row);
                this.updateItem.id = null;

                if (this.hasSortable) {
                    this.insertAfterPosition = item.$index + 1;
                }
                this.addDataModal = true;
                this.dataModalType = 'duplicate';
                this.addDataModalTitle = 'Duplicate Data';
            },
            /**
             * Used to re-sync table settings with external data source
             * @return void
             */
            updateTableSettings() {
                this.syncing = true;
                jQuery.post(ajaxurl, {
                    tableId: this.config.table.ID,
                    remote_url: this.externalDataSourceUrl,
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'update-external-data-source'
                })
                .then(response => {
                    if(response.success) {
                        this.getColumnSettings();
                        this.getData();
                        this.$message({
                            type: 'success',
                            showClose:true,
                            message: 'Table column settings updated successfully.'
                        });
                        this.externalDataSourceUrl = response.data.remote_url;
                    }
                })
                .fail(({responseJSON}) => {
                    let first = Object.keys(responseJSON.data.message)[0];
                    this.$message({
                        type: 'error',
                        showClose:true,
                        message: responseJSON.data.message[first]
                    });
                })
                .always(() => this.syncing = false);
            }
        },
        mounted() {
            this.getData();
            this.tableWidth = jQuery('.wrap').width() + 'px';
        }
    }
</script>
<style lang="scss">
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

    .sorting tr {
        cursor: move;
    }

    .el-table__header {
        tr th:hover {
            .nt-column-config {
                opacity: 1;
            }
        }
    }

    .nt-column-config {
        padding-left: 5px;
        cursor: pointer;
        opacity: 0;
        display: inline-block;
        &:hover {
            color: #58B7FF;
        }
    }

    .instruction_block {
        padding: 30px 20px;
        background: white;
    }
</style>