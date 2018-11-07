<template>
    <div class="ninja_custom_filter_wrapper">
        <div class="ninja_header">
            <h2 class="ninja_block">Custom Search Filters</h2>
            <p>
                Custom Search Filters is useful if you want to add select box / Radio Button to show a group of rows of
                your table.
                <br/>
                To learn more about this <a target="_blank" href="https://wpmanageninja.com/docs/ninja-tables/custom-filters-on-ninja-tables/">click here</a>
            </p>
        </div>
        <div class="ninja_style_wrapper">
            <div v-if="hasAdvancedFilters" class="section_block">
                <el-table
                        border
                        stripe
                        v-if="table_filters.length"
                        :data="table_filters"
                >
                    <el-table-column
                            prop="title"
                            label="Name">
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="Type">
                    </el-table-column>
                    <el-table-column
                            label="Target Columns">
                        <template slot-scope="scope">
                            <code v-for="columnKey in scope.row.columns" v-show="columnKeyPairs[columnKey]">{{
                                columnKeyPairs[columnKey] }}</code>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="Action">
                        <template slot-scope="scope">
                            <el-button @click="edit(scope.row)" size="mini" type="primary"
                                       icon="el-icon-edit"></el-button>
                            <el-button size="mini" @click="deleteFilter(scope.$index)" type="danger"
                                       icon="el-icon-delete"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div v-else-if="hasPro" class="section_block">
                <h3>Custom Filters is introduced in version 2.4.0. Please upgrade <b>Ninja tables pro</b> plugin to use this feature</h3>
            </div>
            <div v-else class="section_block text-center">
                <h3>Custom Filters is pro only features. Please purchase <b>"Ninja Tables Pro"</b> to use this feature</h3>

                <a class="el-button el-button--danger" target="_blank" href="https://wpmanageninja.com/downloads/ninja-tables-pro-add-on/?utm_source=ninja-tables&utm_medium=wp&utm_campaign=wp_plugin&utm_term=upgrade_custom_filter">Purchase Now</a>

            </div>
        </div>

        <el-button v-if="hasAdvancedFilters" @click="showAddFilter()" type="success">Add New Filter</el-button>


        <el-dialog
                title="Edit Custom Filter"
                :visible.sync="editorModal"
                width="70%"
                :append-to-body="true">
            <ninja-filter-editor :columnKeyPairs="columnKeyPairs" :activeEditor="activeEditor"></ninja-filter-editor>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editorModal = false">Cancel</el-button>
                <el-button type="primary" @click="updateFilter(activeEditor)">Update</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="Add New Custom Filter"
                :visible.sync="addFilterModal"
                width="70%"
                :append-to-body="true">
            <ninja-filter-editor :columnKeyPairs="columnKeyPairs" :activeEditor="activeEditor"></ninja-filter-editor>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFilterModal = false">Cancel</el-button>
                <el-button type="primary" @click="addFilter(activeEditor)">Add</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script type="text/babel">

    import each from 'lodash/each';
    import NinjaFilterEditor from './_filterEditor'

    export default {
        name: 'custom_filter',
        props: ['table_id', 'columns'],
        components: {
            NinjaFilterEditor
        },
        data() {
            return {
                loading: false,
                hasPro: !!window.ninja_table_admin.hasPro,
                hasAdvancedFilters: !!window.ninja_table_admin.hasAdvancedFilters,
                table_filters: [],
                activeEditor: false,
                editorModal: false,
                addFilterModal: false
            }
        },
        computed: {
            columnKeyPairs() {
                let formattedColumns = {};
                each(this.columns, (column) => {
                    formattedColumns[column.key] = column.name;
                });
                return formattedColumns;
            }
        },
        methods: {
            each,
            fetchFilters() {
                this.loading = true;
                jQuery.get(window.ajaxurl, {
                    action: 'ninjatable_get_custom_table_filters',
                    table_id: this.table_id
                })
                    .then((response) => {
                        this.table_filters = response.data.table_filters;
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.loading = false;
                    });
            },
            updateFilter(filter) {
                if (this.validateFilter(filter)) {
                    this.saveFilters();
                }
            },
            validateFilter(filter) {
                if (!filter.title) {
                    this.$message.error('Please Provide Filter Title');
                    return false;
                }
                if (!filter.options.length) {
                    this.$message.error('Please Provide Filter Options');
                    return false;
                }
                if (!filter.columns.length) {
                    this.$message.error('Please Select columns that you need to add filter');
                    return false;
                }

                return true;
            },
            saveFilters() {
                this.loading = true;
                jQuery.post(window.ajaxurl, {
                    action: 'ninjatable_update_custom_table_filters',
                    table_id: this.table_id,
                    ninja_filters: this.table_filters
                })
                    .then((response) => {
                        this.$message.success(response.data.message);
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.loading = false;
                        this.activeEditor = false;
                        this.editorModal = false;
                        this.addFilterModal = false;
                    });
            },
            showAddFilter() {
                this.activeEditor = {
                    placeholder: "All",
                    options: [{
                        value: '',
                        label: ''
                    }],
                    type: "select",
                    columns: [],
                    strict: true,
                    title: ""
                };
                this.addFilterModal = true;
            },
            addFilter(filter) {
                if (this.validateFilter(filter)) {
                    this.table_filters.push(filter);
                    this.$nextTick(() => {
                        this.saveFilters();
                    });
                }
            },
            edit(row) {
                this.activeEditor = row;
                this.editorModal = true;
            },
            deleteFilter(index) {
                this.table_filters.splice(index, 1);
                this.saveFilters();
            }
        },
        mounted() {
            if (this.hasAdvancedFilters) {
                this.fetchFilters();
            }
        }
    }
</script>