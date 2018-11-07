<template>
    <div>
        <div style="margin-top: 15px;">
            <el-container>
                <el-aside width="200px">
                    <el-menu background-color="#545c64"
                             :default-active="active_menu"
                             text-color="#fff"
                             active-text-color="#ffd04b">
                        <el-menu-item  @click="active_menu = 'columns'" index="columns">
                            <i class="dashicons dashicons-editor-table"></i>
                            <span>Columns</span>
                        </el-menu-item>
                        
                        <el-menu-item  @click="active_menu = 'rendering_settings'" index="rendering_settings">
                            <i class="dashicons dashicons-album"></i>
                            <span>Rendering Settings</span>
                        </el-menu-item>

                        <el-menu-item  @click="active_menu = 'custom_filters'" index="custom_filters">
                            <i class="dashicons dashicons-filter"></i>
                            <span>Custom Filters</span>
                        </el-menu-item>

                        <el-menu-item  @click="active_menu = 'language_settings'" index="language_settings">
                            <i class="dashicons dashicons-translation"></i>
                            <span>Language Settings</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <template v-if="active_menu == 'columns'">
                        <div class="ninja_header">
                            <h2>Table Column Settings</h2>
                        </div>
                        <div class="ninja_content">
                            <div class="section_widget">
                                <div class="heading">
                                    <h3 v-if="addColumnStatus || !columns.length" class="title">{{ $t('Add Table Column') }}</h3>
                                    <h3 v-else class="title">{{ $t('Available Columns') }}</h3>
                                    <div v-show="!addColumnStatus" class="inline_action">
                                        <el-button size="small" type="primary" v-show="columns.length" @click="addColumnStatus = !addColumnStatus">
                                            {{ $t('Add Column') }}
                                        </el-button>
                                    </div>
                                </div>
                                <div class="widget_body">
                                    <div v-show="addColumnStatus || !columns.length" class="column">
                                        <div class="add_column_wrapper">
                                            <columns-editor :model="new_column" :has-pro="has_pro"
                                                            @add="addNewColumn()"
                                                            @cancel="addColumnStatus = !addColumnStatus"
                                            />
                                        </div>
                                    </div>
                                    <draggable v-model="columns" :options="{handle:'.handle', animation: 150}">
                                        <div class="column drawer"
                                             v-for="(column, index) in columns"
                                             :key="column.key"
                                        >
                                            <div class="header">
                                                <span class="dashicons dashicons-editor-justify handle" />
                                                <span @click="openDrawer(index)">{{ column.name || column.key }}</span>
                                                <span class="dashicons dashicons-edit edit_icon" @click="openDrawer(index)" />
                                            </div>
                                            <div class="drawer_body" :class="'drawer_body_'+index">
                                                <columns-editor :model="column" :has-pro="has_pro" :updating="true"
                                                                @delete="deleteColumn(index)"
                                                                @store="storeSettings()"
                                                />
                                            </div>
                                        </div>
                                    </draggable>
                                </div>
                            </div>
                            <div class="proms">
                                <div class="help_section">
                                    <p>Need help to configure the columns and responsive breakdowns, Please check tutorial with
                                        video <a
                                                href="https://wpmanageninja.com/r/docs/ninja-tables/configure-responsive-breakdowns-for-table/?utm_source=ninja-tables"
                                                target="_blank">here</a></p>
                                </div>
                                <div v-if="!is_fluent_installed" class="help_section">
                                    <p>Have you checked out FluentForm yet? We have developed a powerful Drag & Drop WordPress Form
                                        Builder plugin with some amazing Premium features <a :href="fluent_url">Download from
                                            WordPress.org</a></p>
                                </div>
                            </div>
                        </div>
                    </template>
                    
                    <template v-else-if="active_menu == 'rendering_settings'">
                        <div class="ninja_header">
                            <h2>Table Render Settings</h2>
                            <div class="ninja_actions_action">
                                <el-button size="small" type="primary" @click="storeSettings()"> {{ $t('Update Configuration') }}</el-button>
                            </div>
                        </div>
                        <div class="ninja_style_wrapper">
                            <div class="ninja_section_block_body">
                                <div class="section_block_item">
                                    <p>Please the select the settings for your table render method. Using Legacy table you can use
                                        shortcodes in your cells and it will render the full table from php side. Table styles will be
                                        same for both tables. Most of the cases you will need Ajax Table which is recommended
                                        settings.</p>
                                    <div class="card_block">
                                        <div @click="changeTableType('ajax_table')"
                                             :class="(tableSettings.render_type == 'ajax_table') ? 'selected_type' : ''"
                                             class="section_card">
                                            <div v-show="tableSettings.render_type == 'ajax_table'" class="selected_ribbon">Selected
                                            </div>
                                            <h4>Ajax Table</h4>
                                            <p>
                                                Use this settings if you have lots of data and don't need cell merge features. It will
                                                load your data over ajax. Please note that, shortcodes in table will not work here.
                                            </p>
                                        </div>
                                        <div @click="changeTableType('legacy_table')"
                                             :class="(tableSettings.render_type == 'legacy_table') ? 'selected_type' : ''"
                                             class="section_card">
                                            <div v-show="tableSettings.render_type == 'legacy_table'" class="selected_ribbon">Selected
                                            </div>
                                            <h4>Advanced Table (Legacy)</h4>
                                            <div>
                                                <p>
                                                    Use this table if you have small amount of data and need the following features
                                                </p>
                                                <ul class="ninja_render_features">
                                                    <li><span class="dashicons dashicons-yes"></span> Colspan ( Cell-Merge )</li>
                                                    <li><span class="dashicons dashicons-yes"></span> Server Side Dom-Generation</li>
                                                    <li><span class="dashicons dashicons-yes"></span> Render shortcode into table cells
                                                    </li>
                                                    <li><span class="dashicons dashicons-yes"></span> Better for SEO</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="config.table.hasCacheFeature" class="section_block_item">
                                    <h3>
                                        Disable Caching
                                        <el-tooltip placement="right" effect="light">
                                            <div slot="content">
                                                To optimize and load faster, we cache the table <br>
                                                contents. It's not recommended to disable <br>
                                                caching unless you know what you are doing
                                            </div>
                                            <i class="el-icon-info el-text-info"></i>
                                        </el-tooltip>
                                    </h3>
                                    <div class="caching-block">
                                        <div class="form-group">
                                            <span style="margin-right: 5px;">Disable Caching</span>
                                            <el-switch v-model="tableSettings.shouldNotCache" active-value="yes" inactive-value="no"/>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="config.table.hasExternalCachingInterval" class="section_block_item">
                                    <h3>
                                        Caching Interval
                                        <el-tooltip placement="right" effect="light">
                                            <div slot="content">
                                                To optimize and load faster, You can cache the table data for certain minutes <br/>
                                                so the data will load from cached data. Please Provide the value in minutes.
                                            </div>
                                            <i class="el-icon-info el-text-info"></i>
                                        </el-tooltip>
                                    </h3>
                                    <div class="caching-block">
                                        <div style="max-width: 400px" class="form-group">
                                            <span style="margin-right: 5px;">Caching Interval (In Minutes)</span>
                                            <el-input type="number" size="small" v-model="tableSettings.caching_interval"></el-input>
                                            <p>Keep Blank or 0 to disable caching for table data</p>
                                            <p v-if="tableSettings.caching_interval > 60">Current Caching Interval: <b>{{ (tableSettings.caching_interval / 60).toFixed(2) }} hours</b></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </template>

                    <template v-else-if="active_menu == 'language_settings'">
                        <div class="ninja_header">
                            <h2>Language Settings</h2>
                            <div class="ninja_actions_action">
                                <el-button size="small" type="primary" @click="storeSettings()"> {{ $t('Update Configuration') }}</el-button>
                            </div>
                        </div>
                        <div class="ninja_style_wrapper">
                            <div class="section_block">
                                <div class="language_block">
                                    <div class="form_group">
                                        <label for="no_result_text">Empty Results Text:</label>
                                        <input v-model="tableSettings.no_result_text" id="no_result_text" type="text" class="form_control"
                                               autocomplete="off">
                                        <small>The text to display if the table contains no rows.</small>
                                    </div>
                                    <div class="form_group">
                                        <label for="search_box_placeholder">Search Box Placeholder Text</label>
                                        <input v-model="tableSettings.search_placeholder" id="search_box_placeholder" type="text"
                                               class="form_control" autocomplete="off">
                                        <small>Search Box Placeholder</small>
                                    </div>
                                    <div class="form_group">
                                        <label for="search_box_in">Search Dropdown Heading</label>
                                        <input v-model="tableSettings.search_in_text" id="search_box_in" type="text" class="form_control"
                                               autocomplete="off">
                                        <small>Search Dropdown Box Title</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else-if="active_menu == 'custom_filters'">
                        <ninja-custom-filters :columns="columns" :table_id="tableId"></ninja-custom-filters>
                    </template>
                    
                </el-main>
            </el-container>
        </div>
    </div>
</template>
<script type="text/babel">
    import draggable from 'vuedraggable'
    import findIndex from 'lodash/findIndex';
    import get from 'lodash/get'
    import size from 'lodash/size'
    import snakeCase from 'lodash/snakeCase'
    import ColumnsEditor from './includes/ColumnsEditor';
    import NinjaCustomFilters from './includes/CustomFilter';

    import { tableLibs } from '../data/data'

    export default {
        name: 'TableConfiguration',
        components: {
            draggable,
            ColumnsEditor,
            NinjaCustomFilters
        },
        props: ['config'],
        data() {
            return {
                hasPro: !!window.ninja_table_admin.hasPro,
                active_menu: 'columns',
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
                    data_type: 'text',
                    dateFormat: '',
                    header_html_content: "",
                    enable_html_content: false
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
                    'number': this.$t('Numeric Value'),
                    'date': this.$t('Date Field'),
                    'selection': this.$t('Select Field')
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
                has_pro: !!window.ninja_table_admin.hasPro,
                hasSortable: !!window.ninja_table_admin.hasSortable,
                addVisible: false,
                sortableUpgradeNotice: false
            }
        },
        watch: {
            'new_column.name': function () {
                this.new_column.key = snakeCase(this.new_column.name)
            },
        },
        methods: {
            storeSettings() {
                this.doingAjax = true;
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'update-table-settings',
                    table_id: this.tableId,
                    columns: this.columns,
                    table_settings: this.tableSettings
                };
                jQuery.post(ajaxurl, data)
                    .success((res) => {
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
                        breakpoints: '',
                        data_type: 'text',
                        dateFormat: '',
                        header_html_content: "",
                        enable_html_content: false
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
                window.ninjaTableBus.$emit('show_pro_popup', 1);
            },
            size,
            get,
            initManualSorting() {
                let promise = new Promise((resolve, reject) => {
                    window.ninjaTableBus.$emit('initManualSorting', {
                        table_id: this.tableId,
                        noData: true
                    }, resolve, reject);
                })
            },
            headerColorsClick() {
                if (!this.has_pro) {
                    this.showProAd();
                }
            },
            changeTableType(tableType) {
                if(!this.hasPro && tableType == 'legacy_table') {
                    window.ninjaTableBus.$emit('show_pro_popup', 1);
                    this.tableSettings.render_type = 'ajax_table';
                    return;
                }
                this.tableSettings.render_type  = tableType;
            },
        }
    }
</script>
