<template>
    <div>
        <div class="section-container">
            <div class="section-column-9">
                <div class="section_widget">
                    <div class="heading">
                        <h3 v-if="addColumnStatus || !columns.length" class="title">{{ $t('Add Table Column') }}</h3>
                        <h3 v-else class="title">{{ $t('All Available Table Columns') }}</h3>
                        <div v-show="!addColumnStatus" class="inline_action">
                            <button v-show="columns.length" @click="addColumnStatus = !addColumnStatus"
                                    class="button button-primary">
                                {{ $t('Add Column') }}
                            </button>
                        </div>
                    </div>
                    <div class="widget_body">
                        <div v-show="addColumnStatus || !columns.length" class="column drawer">
                            <div class="add_column_wrapper">
                                <div class="form_group">
                                    <label>{{ $t('Column Name') }}
                                        <el-tooltip placement="right"
                                                    content="Enter a title for the table column, It will show as column header of the table">
                                            <<i class="el-icon-information"></i>
                                        </el-tooltip>
                                    </label>
                                    <input class="form_control" type="text" v-model="new_column.name"/>
                                </div>
                                <div class="form_group">
                                    <label>
                                        {{ $t('Column Key') }}
                                        <el-tooltip placement="right"
                                                    content="This is the column key, It will be used for internal use to mapping data and also for export and import data">
                                            <<i class="el-icon-information"></i>
                                        </el-tooltip>
                                    </label>
                                    <input class="form_control" type="text" v-model="new_column.key"/>
                                </div>
                                <div class="form_group">
                                    <label>
                                        {{ $t('Column Data Type') }}
                                        <el-tooltip placement="right" content="Data Type of the column">
                                            <<i class="el-icon-information"></i>
                                        </el-tooltip>
                                    </label>
                                    <select v-model="new_column.data_type" class="form_control">
                                        <option v-for="(typeName, typeKey) in dataTypesOptions" :value="typeKey">{{
                                            typeName }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form_group">
                                    <label>
                                        {{ $t('Responsive Breakpoint') }}
                                        <el-tooltip placement="right"
                                                    content="For responsiveness settings of your table columns. For more details check documentation">
                                            <<i class="el-icon-information"></i>
                                        </el-tooltip>
                                    </label>
                                    <select v-model="new_column.breakpoints" class="form_control">
                                        <option v-for="(option, optionKey) in breakPointsOptions" :value="optionKey">{{
                                            option }}
                                        </option>
                                    </select>
                                </div>
                                <div class="form_group">
                                    <div class="pull-right">
                                        <button @click="addColumnStatus = !addColumnStatus" class="button">Cancel
                                        </button>
                                        <button @click="addNewColumn" class="button button-primary">Add Column</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <draggable v-model="columns" :options="{handle:'.handle', animation: 150}">
                            <div class="column drawer" v-for="(column, index) in columns">
                                <div class="header">
                                    <span class="dashicons dashicons-editor-justify handle"></span>
                                    <span>{{ column.name }}</span>
                                    <span class="dashicons dashicons-edit edit_icon" @click="openDrawer(index)"></span>
                                </div>
                                <div class="drawer_body" :class="'drawer_body_'+index">
                                    <div class="form_group">
                                        <label> {{ $t('Column Name') }}
                                            <el-tooltip placement="right"
                                                        content="Enter a title for the table column, It will show as column header of the table">
                                                <<i class="el-icon-information"></i>
                                            </el-tooltip>

                                        </label>
                                        <input class="form_control" type="text" v-model="column.name"/>
                                    </div>
                                    <div class="form_group">
                                        <label>
                                            {{ $t('Column Key') }}
                                            <el-tooltip placement="right"
                                                        content="This is the column key, It will be used for internal use to mapping data and also for export and import data">
                                                <<i class="el-icon-information"></i>
                                            </el-tooltip>
                                        </label>
                                        <input class="form_control" type="text" v-model="column.key" disabled/>
                                    </div>
                                    <div class="form_group">
                                        <label>
                                            {{ $t('Column Data Type') }}
                                            <el-tooltip placement="right" content="Data Type of the column">
                                                <<i class="el-icon-information"></i>
                                            </el-tooltip>
                                        </label>
                                        <select v-model="column.data_type" class="form_control">
                                            <option v-for="(typeName, typeKey) in dataTypesOptions" :value="typeKey">{{
                                                typeName }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form_group">
                                        <label>
                                            {{ $t('Responsive Breakpoint') }}
                                            <el-tooltip placement="right"
                                                        content="For responsiveness settings of your table columns. For more details check documentation">
                                                <<i class="el-icon-information"></i>
                                            </el-tooltip>
                                        </label>
                                        <select v-model="column.breakpoints" class="form_control">
                                            <option v-for="(option, optionKey) in breakPointsOptions"
                                                    :value="optionKey">{{ option }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form_group">
                                        <button @click="deleteColumn(index)">Delete</button>
                                        <div class="pull-right">
                                            <button @click="storeSettings()" class="button button-primary">
                                                {{ $t('Update') }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </draggable>
                    </div>
                </div>
                <div class="proms">
                    <div class="help_section updated notice notice-success">
                        <p>Need help to configure the columns and responsive breakdowns, Please check tutorial with
                            video <a
                                    href="https://wpmanageninja.com/r/docs/ninja-tables/configure-responsive-breakdowns-for-table/?utm_source=ninja-tables"
                                    target="_blank">here</a></p>
                    </div>
                    <div v-if="!is_fluent_installed" class="notice notice-success">
                        <p>Have you checked out FluentForm yet? We have developed a powerful Drag & Drop WordPress Form
                            Builder plugin with some amazing Premium features <a :href="fluent_url">Download from
                                WordPress.org</a></p>
                    </div>
                </div>
            </div>
            <div class="section-column-3 ninja_sidebar">
                <div class="ninja_widget">
                    <button @click="storeSettings()" class="button button-primary button-block button-large pull-right">
                        {{ $t('Update Configuration') }}
                    </button>
                </div>
                <div class="ninja_widget">
                    <h4 class="title">{{ $t('Pagination') }}</h4>
                    <div class="widget_body">
                        <div class="form_group">
                            <label for="items_per_page">{{ $t('Pagination Items Per Page') }}</label>
                            <input id="items_per_page" class="form_control" type="number"
                                   v-model="tableSettings.perPage" :disabled="tableSettings.show_all == true"/>
                        </div>
                        <div class="form_group">
                            <label for="disable_pagination"><input v-model="tableSettings.show_all"
                                                                   id="disable_pagination" type="checkbox"/> {{
                                $t('Disable Pagination ( Will show all items at once )') }}</label>
                        </div>
                    </div>
                </div>

                <div v-if="size(tableLibs) > 1" class="ninja_widget">
                    <h4 class="title">{{ $t('Table Library') }}</h4>
                    <div class="widget_body">
                        <div class="form_group">
                            <label v-for="(tableLib, tableKey) in tableLibs" :for="tableKey">
                                <input v-model="tableSettings.library" type="radio" :value="tableKey"
                                       name="table_library" :id="tableKey"/> {{ tableLib.title }}
                                <el-tooltip placement="top-end" :content="tableLib.description">
                                    <<i class="el-icon-information"></i>
                                </el-tooltip>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="ninja_widget">
                    <h4 class="title">{{ $t('Table Features') }}</h4>
                    <div class="widget_body">
                        <div class="form_group">

                            <label for="show_title">
                                <input v-model="tableSettings.show_title" type="checkbox" value="1" id="show_title"/> {{
                                $t('Show Table Title') }}
                                <el-tooltip placement="top-end"
                                            content="Enable this if you want to show table title in frontend">
                                    <<i class="el-icon-information"></i>
                                </el-tooltip>
                            </label>
                            <label for="show_description">
                                <input v-model="tableSettings.show_description" type="checkbox" value="1"
                                       id="show_description"/> {{ $t('Show Table Description') }}
                                <el-tooltip placement="top-end"
                                            content="Enable this if you want to show table description in frontend">
                                    <<i class="el-icon-information"></i>
                                </el-tooltip>
                            </label>

                            <label v-if="tableLibs[tableSettings.library].supports.ajax" for="enable_ajax">
                                <input v-model="tableSettings.enable_ajax" type="checkbox" value="1" id="enable_ajax"/>
                                {{ $t('Enable Ajax Loading') }}
                                <el-tooltip placement="top-end"
                                            content="Enable this if you have more than 10,000 records in your table">
                                    <<i class="el-icon-information"></i>
                                </el-tooltip>
                            </label>
                            <label for="enable_search">
                                <input v-model="tableSettings.enable_search" type="checkbox" value="1"
                                       id="enable_search"/> {{ $t('Enable the visitor to filter or search the table.')
                                }}
                            </label>
                            <label v-if="tableLibs[tableSettings.library].supports.sorting && !tableSettings.enable_ajax"
                                   for="column_sorting">
                                <input v-model="tableSettings.column_sorting" type="checkbox" value="1"
                                       id="column_sorting"/> {{ $t('Enable sorting of the table by the visitor') }}
                            </label>
                        </div>
                    </div>
                </div>

                <div class="ninja_widget">
                    <h4 class="title">{{ $t('Data Sorting') }}</h4>
                    <br/>
                    <div class="form_group">
                        <label>
                            <input v-model="tableSettings.sorting_type" type="radio" value="by_created_at"/> Sort By
                            Data Create Date
                        </label>
                        <div v-if="tableSettings.sorting_type == 'by_created_at'" class="">
                            <span>{{ $t('Sort Type') }}
                                <select v-model="tableSettings.default_sorting">
                                    <option value="new_first">{{ $t('Show New Items First') }}</option>
                                    <option value="old_first">{{ $t('Show Old Items First') }}</option>
                                </select>
                            </span>
                        </div>
                        <br/>
                        <label>
                            <input v-model="tableSettings.sorting_type" type="radio" value="by_column"/> Sort By Table
                            Column
                        </label>
                        <div v-if="tableSettings.sorting_type == 'by_column'">
                            <label>{{ $t('Select Column') }}
                                <select v-model="tableSettings.sorting_column">
                                    <option v-for="column in columns" :value="column.key">{{ column.name }}</option>
                                </select>
                            </label>
                            <label>{{ $t('Sort Type') }}
                                <select v-model="tableSettings.sorting_column_by">
                                    <option value="ASC">Ascending Way</option>
                                    <option value="DESC">Descending Way</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="ninja_widget">
                    <h4 class="title">{{ $t('Styling Library') }}</h4>
                    <div class="widget_body">
                        <div class="form_group">
                            <label v-for="(tableLib, libKey) in currentTableLibs" :for="libKey">
                                <input v-model="tableSettings.css_lib" type="radio" name="stylingLib" :id="libKey"
                                       :value="libKey"/>
                                {{ tableLib.title }}
                                <el-tooltip placement="top-end" :content="tableLib.description">
                                    <<i class="el-icon-information"></i>
                                </el-tooltip>
                            </label>
                        </div>
                    </div>
                </div>

                <div v-if="availableStyles" class="ninja_widget">
                    <h4 class="title">{{ $t('Table Styles') }}</h4>
                    <div class="widget_body">
                        <div class="form_group">
                            <label v-for="tableStyle in availableStyles" :for="'table_style_'+tableStyle.key">
                                <input v-model="tableSettings.css_classes" type="checkbox" name="table_styles"
                                       :value="tableStyle.key" :id="'table_style_'+tableStyle.key"/>
                                {{ tableStyle.title }}
                                <el-tooltip placement="top-end" :content="tableStyle.description">
                                    <<i class="el-icon-information"></i>
                                </el-tooltip>
                            </label>
                        </div>
                    </div>
                </div>

                <div v-if="size(colors)" class="ninja_widget">
                    <h4 class="title">{{ $t('Table Color Schema') }} <span v-if="!has_pro">( Pro Feature )</span></h4>
                    <div class="widget_body">

                        <div class="form_group">
                            <label v-for="(colorName, colorKey) in colors" :for="colorKey">
                                <input v-model="tableSettings.table_color" type="radio" :value="colorKey"
                                       name="table_color" :id="colorKey"/> {{ colorName }}
                            </label>
                        </div>

                        <div v-show="tableSettings.table_color == 'ninja_table_custom_color' && has_pro"
                             class="form_group">
                            <br/>
                            <h4 class="title">Select Table Colors</h4>
                            <div class="form_group">
                                <label>Primary color (Background Color)</label>
                                <el-color-picker v-model="tableSettings.table_color_primary"></el-color-picker>
                            </div>
                            <div class="form_group">
                                <label>Secondary color (Text Color)</label>
                                <el-color-picker v-model="tableSettings.table_color_secondary"></el-color-picker>
                                <p>* Use opposite colors for best result</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ninja_widget">
                    <h4 class="title">{{ $t('CSS Class') }}</h4>
                    <div class="widget_body">
                        <div class="form_group">
                            <label for="extra_css_class">{{ $t('Extra CSS Class for the table') }}</label>
                            <input id="extra_css_class" class="form_control" type="text"
                                   v-model="tableSettings.extra_css_class"/>
                        </div>
                    </div>
                </div>
                <div class="ninja_widget">
                    <button @click="storeSettings()" class="button button-primary button-block button-large pull-right">
                        {{ $t('Update Configuration') }}
                    </button>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script type="text/babel">
    import draggable from 'vuedraggable'
    import findIndex from 'lodash/findIndex';
    import get from 'lodash/get'
    import size from 'lodash/size'
    import forEach from 'lodash/forEach'
    import intersection from 'lodash/intersection';
    import snakeCase from 'lodash/snakeCase'
    
    import { tableLibs } from '../data/data'

    export default {
        name: 'TableConfiguration',
        components: {
            draggable
        },
        props: ['config'],
        data() {
            return {
                table_color_primary: '#000',
                table_color_secondary: '#fff',
                tableId: this.$route.params.table_id,
                tableLibs: tableLibs(),
                doingAjax: false,
                addColumnStatus: false,
                new_column: {
                    name: '',
                    key: '',
                    breakpoints: '',
                    data_type: 'text'
                },
                breakPointsOptions: {
                    'xs': this.$t('Initial Hidden Mobile'),
                    'xs sm': this.$t('Initial Hidden Mobile and Tab'),
                    'xs sm md lg': this.$t('Initial Hidden Mobile, Tab and Regular Computers'),
                    '': this.$t('Always show in all devices'),
                    'hidden': this.$t('Totally hidden on all devices'),
                },
                dataTypesOptions: {
                    'text': this.$t('Single Line Text Field'),
                    'textarea': this.$t('Text Area'),
                    'html': this.$t('HTML Field'),
                    'number': this.$t('Numeric Value')
                },
                dateFormats: {
                    'Y-m-d': 'Y-m-d',

                },
                attributeModel: {
                    name: null,
                    key: null,
                    breakpoints: ''
                },
                columns: this.config.columns,
                tableSettings: this.config.settings,
                is_fluent_installed: window.ninja_table_admin.isInstalled,
                fluent_url: window.ninja_table_admin.fluentform_url,
                has_pro: window.ninja_table_admin.hasPro,
                addVisible: false
            }
        },
        computed: {
            currentTableLibs() {
                return this.tableLibs[this.tableSettings.library].css_libs;
            },
            colors() {
                return this.tableLibs[this.tableSettings.library].colors;
            },
            availableStyles() {
                let lib = this.currentTableLibs[this.tableSettings.css_lib];
                if (lib)
                    return lib.styles;
                return false;
            }
        },
        watch: {
            'new_column.name': function () {
                this.new_column.key = snakeCase(this.new_column.name)
            },
            'tableSettings.table_color': function () {
                if (this.has_pro) {
                    return;
                }
                if (this.tableSettings.table_color != 'ninja_no_color_table') {
                    window.ninjaTableBus.$emit('show_pro_popup', 1);
                    this.tableSettings.table_color = 'ninja_no_color_table';
                }
            }
        },
        methods: {
            storeSettings() {
                this.doingAjax = true;
                let filteredTableSettings = this.filterTableSettings(this.tableSettings);
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'update-table-settings',
                    table_id: this.tableId,
                    columns: this.columns,
                    table_settings: this.tableSettings
                };
                jQuery.post(ajaxurl, data)
                    .success((res) => {
                        this.config.columns = this.columns;
                        this.config.settings = filteredTableSettings;
                        this.$message({
                            showClose: true,
                            message: res.message,
                            type: 'success'
                        });
                    })
                    .fail((error) => {

                    })
                    .always(() => {
                        this.doingAjax = false;
                    });
            },
            filterTableSettings(settings) {
                let validStyles = [];
                forEach(this.availableStyles, (style) => {
                    validStyles.push(style.key);
                });
                settings.css_classes = intersection(validStyles, this.tableSettings.css_classes);

                return settings;
            },
            openDrawer(index) {
                jQuery('.drawer_body_' + index).slideToggle();
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
                    this.columns.push(this.new_column);
                    this.new_column = {
                        name: '',
                        key: '',
                        breakpoints: ''
                    };
                    this.addColumnStatus = false;
                    this.storeSettings();
                }
            },
            deleteColumn(index) {
                if (confirm(this.$t('Are you sure, You want to delete this column?'))) {
                    this.columns.splice(index, 1);
                    this.storeSettings();
                }
            },
            showProAd(title) {
                this.addVisible = true;
            },
            size,
            get
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    
    .loading-wrapper {
        padding: 10px;
        background: white;
    }

    .text-center {
        text-align: center;
    }

    .ninja_sidebar {
        margin-top: 10px;
    }

    .add_column_wrapper {
        background: white;
        overflow: hidden;
        padding: 10px;
    }

    .ninja_widget {
        display: block;
        overflow: hidden;
        padding: 15px 10px;
        background: white;
        margin-bottom: 15px;
        border: 1px solid #e5e5e5;
        -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .04);
        box-shadow: 0 1px 1px rgba(0, 0, 0, .04);
        .title {
            margin: -15px -10px 0;
            border-bottom: 1px solid #f1f1f1;
            font-size: 14px;
            padding: 8px 12px;
            line-height: 1.4;
        }
        .widget_body {
            padding-top: 10px;
        }
        .button-block {
            width: 100%;
        }
    }

    .pull-right {
        float: right;
    }

    .section_widget {
        border: 1px solid gray;
        .heading {
            display: block;
            background: white;
            border-bottom: 1px solid gray;
            overflow: hidden;
            padding: 10px;
            .title {
                float: left;
                padding: 0px;
                margin: 0px;
            }
            .inline_action {
                float: right;
            }
        }
        .widget_body {
            background: white;
            padding: 0px;
        }
    }

    .drawer {
        display: block;
        border-bottom: 1px solid gray;
        .drawer_body {
            padding: 10px;
            display: none;
            .form_group {
                padding-right: 20px;
            }
        }
        .header {
            padding: 15px 10px;
            background: #0073aa;
            color: white;
            font-weight: bold;
            font-size: 17px;
            .edit_icon {
                float: right;
                font-size: 12px;
                cursor: pointer;
            }
            .handle {
                cursor: move;
                font-size: 20px;
                margin-right: 5px;
            }
        }

    }

    .form_group {
        overflow: hidden;
        margin-bottom: 10px;
        label {
            display: block;
        }
        .form_control {
            display: block;
            width: 100%;
        }
    }

    .section-container {
        display: flex;
        width: 100%;
    }

    .section-column-9 {
        flex: 3;
        padding: 10px;
    }

    .section-column-3 {
        flex: 1;
    }

    /* mobile layout */
    @media (max-width: 480px) {
        .section-container {
            display: -webkit-box;
            display: -moz-box;
            display: -ms-flexbox;
            display: -webkit-flex;
            display: flex;

            width: 100%;

            -webkit-box-orient: vertical;
            -moz-box-orient: vertical;
            -ms-flex-orient: vertical;
            -webkit-orient: vertical;
            orient: vertical;
        }
        .section-column-9 {
            -webkit-box-ordinal-group: 1;
            -moz-box-ordinal-group: 1;
            -ms-flex-order: 1;
            -webkit-order: 1;
            order: 1;
        }
        .section-column-3 {

            -webkit-box-ordinal-group: 2;
            -moz-box-ordinal-group: 2;
            -ms-flex-order: 2;
            -webkit-order: 2;
            order: 2;
        }
    }

    .section-column:first-child {
        margin-right: 20px;
    }

    .tooltip {
        display: block !important;
        padding: 4px;
        z-index: 10000;

        .tooltip-inner {
            background: black;
            color: white;
            border-radius: 16px;
            padding: 5px 10px 4px;
        }

        .tooltip-arrow {
            display: none;
        }

        &[aria-hidden='true'] {
            visibility: hidden;
            opacity: 0;
            transition: opacity .15s, visibility .15s;
        }

        &[aria-hidden='false'] {
            visibility: visible;
            opacity: 1;
            transition: opacity .15s;
        }
    }

    .help_section {
        margin-top: 45px !important;
    }

</style>