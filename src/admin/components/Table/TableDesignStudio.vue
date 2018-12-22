<template>
    <div class="ninja_design">
        <div class="ninja_title_section">
            <div class="ninja_title">
                <h3 style="margin-right: 15px;">Table Style Customization</h3>
                <el-radio-group class="ninja_resp_tabs" size="mini" v-model="showingDevice">
                    <el-radio-button label="desktop"><span class="dashicons dashicons-desktop"></span> Desktop
                    </el-radio-button>
                    <el-radio-button label="tablet"><span class="dashicons dashicons-tablet"></span> Tablet
                    </el-radio-button>
                    <el-radio-button label="mobile"><span class="dashicons dashicons-smartphone"></span> Mobile
                    </el-radio-button>
                </el-radio-group>
            </div>
            <el-button :loading="savingSettings" :disabled="savingSettings" size="small" type="primary"
                       @click="storeSettings()">Update Settings
            </el-button>
        </div>
        <div class="ninja_design_wrapper">
            <div v-loading="!app_ready" style="background: white; padding: 10px 20px;" class="design_preview">
                <div class="ninja_upgrade_bar" v-if="showProNotice">
                    {{ $t('Color customization is a PRO feature. Please upgrade to pro apply this feature.') }}
                    <a target="_blank"
                       href="https://wpmanageninja.com/downloads/ninja-tables-pro-add-on/?utm_source=ninja-tables&utm_medium=wp&utm_campaign=wp_plugin&utm_term=upgrade_studio">{{
                        $t('Upgrade To Pro') }}</a>
                </div>
                <div
                        :id="'footable_parent_'+tableId"
                        class="footable_parent ninja_table_wrapper loading_ninja_table wp_table_data_press_parent"
                        :class="wrapperClasses"
                >

                    <h3 v-if="tableSettings.show_title" class="table_title footable_title">{{ config.table.post_title
                        }}</h3>
                    <div v-if="tableSettings.show_description" class="table_description footable_description"
                         v-html="config.table.post_content"></div>
                    <table
                            v-show="app_ready"
                            :id="'footable_'+tableId"
                            :class="tableClasses"
                            class="table foo-table ninja_footable">
                        <colgroup>
                            <col
                                    v-for="(column, column_index) in formattedColumns"
                                    :key="column_index"
                                    :class="['ninja_column_'+column_index, column.breakpoints]"></col>
                        </colgroup>
                        <thead></thead>
                    </table>
                </div>
                <div class="ninja_demo_disclaimer">
                    <p>
                        <b>Note: </b> For preview purpose, you are seeing up to 25 latest rows here and and per page 10
                        items if you enable paginate. Also note that, The table style may differ at the frontend as your
                        theme may overwrite few css elements.
                    </p>
                </div>
            </div>
            <div class="design_controls">
                <el-tabs v-model="activeDesign" type="border-card">
                    <el-tab-pane label="Styling" name="features">
                        <div class="form_group">
                            <label>Select Styling Library</label>
                            <el-radio-group size="mini" v-model="tableSettings.css_lib">
                                <el-radio-button
                                        v-for="(tableLib, libKey) in currentTableLibs"
                                        :key="libKey"
                                        :label="libKey">
                                    {{ tableLib.title }}
                                    <el-tooltip placement="top-end" effect="light" :content="tableLib.description">
                                        <i class="el-icon-info el-text-info"></i>
                                    </el-tooltip>
                                </el-radio-button>
                            </el-radio-group>
                        </div>
                        <div v-if="availableStyles" class="form_group label-normalize">
                            <h3 class="ninja_inner_title">Styles</h3>
                            <label
                                    v-for="tableStyle in availableStyles"
                                    :key="tableStyle.key"
                                    :for="'table_style_'+tableStyle.key">
                                <input v-model="tableSettings.css_classes" type="checkbox" name="table_styles"
                                       :value="tableStyle.key" :id="'table_style_'+tableStyle.key"/>
                                {{ tableStyle.title }}
                                <el-tooltip placement="top-end" effect="light" :content="tableStyle.description">
                                    <i class="el-icon-info el-text-info"></i>
                                </el-tooltip>
                            </label>
                        </div>
                        <div class="form_group label-normalize">
                            <h3 class="ninja_inner_title">Features</h3>
                            <label for="show_title">
                                <input v-model="tableSettings.show_title" type="checkbox" value="1" id="show_title"/> {{
                                $t('Show Table Title') }}
                                <el-tooltip placement="top-end" effect="light"
                                            content="Enable this if you want to show table title in frontend">
                                    <i class="el-icon-info el-text-info"></i>
                                </el-tooltip>
                            </label>
                            <label for="show_description">
                                <input v-model="tableSettings.show_description" type="checkbox" value="1"
                                       id="show_description"/> {{ $t('Show Table Description') }}
                                <el-tooltip placement="top-end" effect="light"
                                            content="Enable this if you want to show table description in frontend">
                                    <i class="el-icon-info el-text-info"></i>
                                </el-tooltip>
                            </label>
                            <label v-if="tableLibs[tableSettings.library].supports.ajax" for="enable_ajax">
                                <input v-model="tableSettings.enable_ajax" type="checkbox" value="1" id="enable_ajax"/>
                                {{ $t('Enable Ajax Loading') }}
                                <el-tooltip placement="top-end" effect="light"
                                            content="Enable this if you have more than 10,000 records in your table">
                                    <i class="el-icon-info el-text-info"></i>
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
                            <label><input v-model="tableSettings.hide_header_row" type="checkbox">
                                Hide Header Row
                            </label>
                            <label><input v-model="tableSettings.hide_all_borders" type="checkbox">
                                Hide All Borders
                            </label>
                        </div>

                        <div class="form_group label-normalize">
                            <h3 class="ninja_inner_title">
                                Stackable Table Configuration
                                <el-tooltip placement="top-end" effect="light"
                                            content="With stackable table, You can show your rows as list item. You can target by device width">
                                    <i class="el-icon-info el-text-info"></i>
                                </el-tooltip>
                            </h3>

                            <div class="form_group">
                                <el-checkbox true-label="yes" false-label="no" v-model="tableSettings.stackable">Enable
                                    Stackable Table
                                </el-checkbox>
                                <template v-if="tableSettings.stackable == 'yes'">
                                    <h3 style="margin-top: 15px" class="ninja_inner_title">Target Devices
                                        <el-tooltip placement="top-end" effect="light"
                                                    content="Select the device by width in where the stackable tables will be enabled">
                                            <i class="el-icon-info el-text-info"></i>
                                        </el-tooltip>
                                    </h3>
                                    <el-checkbox-group
                                            v-model="tableSettings.stacks_devices">
                                        <el-checkbox label="xs">Mobile Device</el-checkbox>
                                        <el-checkbox label="sm">Tablet Device</el-checkbox>
                                        <el-checkbox label="md">Laptop</el-checkbox>
                                        <el-checkbox label="lg">Large Devices (imac)</el-checkbox>
                                    </el-checkbox-group>

                                    <h3 style="margin-top: 15px" class="ninja_inner_title">Stacked Appearance
                                        <el-tooltip placement="top-end" effect="light"
                                                    content="You can customize the appearance in stacked view of your table">
                                            <i class="el-icon-info el-text-info"></i>
                                        </el-tooltip>
                                    </h3>
                                    <el-checkbox-group
                                            v-model="tableSettings.stacks_appearances">
                                        <el-checkbox label="hide_stacked_th">Hide column headings</el-checkbox>
                                        <el-checkbox label="ninja_stacked_no_cell_border">Hide internal borders</el-checkbox>
                                    </el-checkbox-group>
                                </template>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Table Colors" name="color_customization">
                        <div class="form_group">
                            <label>Select Color Scheme</label>
                            <el-radio-group size="mini" v-model="tableSettings.table_color_type">
                                <el-radio-button label="pre_defined_color">Pre Defined Scheme</el-radio-button>
                                <el-radio-button label="custom_color">Custom Scheme</el-radio-button>
                            </el-radio-group>
                        </div>
                        <div v-if="tableSettings.table_color_type == 'pre_defined_color'" class="form_group">
                            <select class="form_control" v-model="tableSettings.table_color">
                                <option v-for="(colorName, colorKey) in colors" :key="colorKey" :value="colorKey">{{
                                    colorName }}
                                </option>
                            </select>
                        </div>
                        <div v-else class="form_group ninja_color_customization">
                            <h3 class="ninja_inner_title">Search Bar Colors</h3>
                            <div class="ninja_color_blocks">
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Background"
                                            v-model="tableSettings.table_search_color_primary"
                                    ></ninja-color-picker>
                                </div>
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Text"
                                            v-model="tableSettings.table_search_color_secondary"
                                    ></ninja-color-picker>
                                </div>
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Border"
                                            v-model="tableSettings.table_search_color_border"
                                    ></ninja-color-picker>
                                </div>
                            </div>

                            <h3 class="ninja_inner_title">{{ $t('Table Header Colors') }}</h3>
                            <div class="ninja_color_blocks">
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Background"
                                            v-model="tableSettings.table_header_color_primary"
                                    ></ninja-color-picker>
                                </div>
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Text"
                                            v-model="tableSettings.table_color_header_secondary"
                                    ></ninja-color-picker>
                                </div>
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Border"
                                            v-model="tableSettings.table_color_header_border"
                                    ></ninja-color-picker>
                                </div>
                            </div>

                            <h3 class="ninja_inner_title">{{ $t('Table Body Colors') }}</h3>
                            <div class="ninja_color_blocks">
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Background"
                                            v-model="tableSettings.table_color_primary"
                                    ></ninja-color-picker>
                                </div>
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Text"
                                            v-model="tableSettings.table_color_secondary"
                                    ></ninja-color-picker>
                                </div>
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Border"
                                            v-model="tableSettings.table_color_border"
                                    ></ninja-color-picker>
                                </div>
                            </div>
                            <div class="ninja_switch_wrapper">
                                <el-switch
                                        inactive-color="gray"
                                        active-text="Use Alternate Color Schema for Table Rows"
                                        active-value="yes" inactive-value="no"
                                        v-model="tableSettings.alternate_color_status"></el-switch>
                            </div>
                            <div class="ninja_alternate_colors" v-if="tableSettings.alternate_color_status == 'yes'">
                                <h3 class="ninja_inner_title">{{ $t('Odd Row Colors') }}</h3>
                                <div class="ninja_color_blocks">
                                    <div class="ninja_color_block">
                                        <ninja-color-picker
                                                label="Background"
                                                v-model="tableSettings.table_alt_2_color_primary"
                                        ></ninja-color-picker>
                                    </div>
                                    <div class="ninja_color_block">
                                        <ninja-color-picker
                                                label="Text"
                                                v-model="tableSettings.table_alt_2_color_secondary"
                                        ></ninja-color-picker>
                                    </div>
                                    <div class="ninja_color_block">
                                        <ninja-color-picker
                                                label="Hover Background"
                                                v-model="tableSettings.table_alt_2_color_hover"
                                        ></ninja-color-picker>
                                    </div>
                                </div>
                                <h3 class="ninja_inner_title">{{ $t('Even Row Colors') }}</h3>
                                <div class="ninja_color_blocks">
                                    <div class="ninja_color_block">
                                        <ninja-color-picker
                                                label="Background"
                                                v-model="tableSettings.table_alt_color_primary"
                                        ></ninja-color-picker>
                                    </div>
                                    <div class="ninja_color_block">
                                        <ninja-color-picker
                                                label="Text"
                                                v-model="tableSettings.table_alt_color_secondary"
                                        ></ninja-color-picker>
                                    </div>
                                    <div class="ninja_color_block">
                                        <ninja-color-picker
                                                label="Hover Background"
                                                v-model="tableSettings.table_alt_color_hover"
                                        ></ninja-color-picker>
                                    </div>
                                </div>
                            </div>
                            <h3 class="ninja_inner_title">{{ $t('Footer Colors') }}</h3>
                            <div class="ninja_color_blocks">
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Background"
                                            v-model="tableSettings.table_footer_bg"
                                    ></ninja-color-picker>
                                </div>
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Active"
                                            v-model="tableSettings.table_footer_active"
                                    ></ninja-color-picker>
                                </div>
                                <div class="ninja_color_block">
                                    <ninja-color-picker
                                            label="Border"
                                            v-model="tableSettings.table_footer_border"
                                    ></ninja-color-picker>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Other" name="other_settings">

                        <div class="ninja_switch_wrapper">
                            <el-switch
                                    inactive-color="gray"
                                    active-text="Hide Pagination (Show all data at once)"
                                    active-value="1" inactive-value="0"
                                    v-model="tableSettings.show_all"></el-switch>
                        </div>

                        <div class="form_group">
                            <label for="items_per_page">{{ $t('Pagination Items Per Page') }}</label>
                            <input id="items_per_page" class="form_control" type="number"
                                   v-model="tableSettings.perPage"
                                   :disabled="tableSettings.show_all == true || tableSettings.show_all == '1'"/>
                        </div>
                        <div class="form_group">
                            <label>{{ $t('Pagination Position') }}</label>
                            <el-radio-group
                                    :disabled="tableSettings.show_all == true || tableSettings.show_all == '1'"
                                    size="mini" v-model="tableSettings.pagination_position">
                                <el-radio-button label="left">Left</el-radio-button>
                                <el-radio-button label="center">Center</el-radio-button>
                                <el-radio-button label="right">Right</el-radio-button>
                            </el-radio-group>
                        </div>

                        <div class="form_group">
                            <label>{{ $t('Search Bar Position') }}</label>
                            <el-radio-group
                                    :disabled="!has_pro"
                                    size="mini" v-model="tableSettings.search_position">
                                <el-radio-button label="left">Left</el-radio-button>
                                <el-radio-button label="center">Center</el-radio-button>
                                <el-radio-button label="right">Right</el-radio-button>
                                <el-radio-button label="">Default</el-radio-button>
                            </el-radio-group>
                        </div>

                        <div class="form_group">
                            <label>Select Sorting Method</label>
                            <el-radio-group size="mini" v-model="tableSettings.sorting_type">
                                <el-radio-button :disabled="!config.table.isCreatedSortable" label="by_created_at">By
                                    Created at
                                </el-radio-button>
                                <el-radio-button label="by_column">By Column</el-radio-button>
                                <el-radio-button :disabled="!config.table.isSortable" label="manual_sort">Manual Sort
                                </el-radio-button>
                            </el-radio-group>
                            <div v-if="tableSettings.sorting_type == 'by_created_at'" class="">
                                <span>{{ $t('Sort Type') }}
                                    <select v-model="tableSettings.default_sorting">
                                        <option value="new_first">{{ $t('Show New Items First') }}</option>
                                        <option value="old_first">{{ $t('Show Old Items First') }}</option>
                                    </select>
                                </span>
                            </div>
                            <div v-else-if="tableSettings.sorting_type == 'by_column'">
                                <label>{{ $t('Select Column') }}
                                    <select v-model="tableSettings.sorting_column">
                                        <option v-for="column in config.columns" :key="column.key" :value="column.key">
                                            {{ column.name }}
                                        </option>
                                    </select>
                                </label>
                                <label>{{ $t('Sort Type') }}
                                    <select v-model="tableSettings.sorting_column_by">
                                        <option value="ASC">Ascending Way</option>
                                        <option value="DESC">Descending Way</option>
                                    </select>
                                </label>
                            </div>
                            <div v-else-if="tableSettings.sorting_type == 'manual_sort'">
                                <p>You can sort the table data from <b>Table Rows</b> Manually. Click Sort Manually
                                    checkbox to sort the data using drag and drop feature</p>
                            </div>

                            <el-button v-if="tableSettings.sorting_type" size="mini"
                                       @click="tableSettings.sorting_type = ''">reset
                            </el-button>

                        </div>

                        <div class="form_group">
                            <label>{{ $t('Row Details (Responsive drawer)') }} <span
                                    v-show="!has_pro">(PRO)</span></label>
                            <el-radio-group size="mini" v-model="tableSettings.expand_type">
                                <el-radio-button label="default">
                                    Default
                                    <el-tooltip placement="top-end" effect="light"
                                                content="Show All the responsive columns data into the responsive drawer">
                                        <i class="el-icon-info el-text-info"></i>
                                    </el-tooltip>
                                </el-radio-button>
                                <el-radio-button label="expandFirst">
                                    Expand First
                                    <el-tooltip placement="top-end" effect="light" content="This will automatically expand the first row of the table when displayed on a device that
                            hides any columns.">
                                        <i class="el-icon-info el-text-info"></i>
                                    </el-tooltip>
                                </el-radio-button>
                                <el-radio-button label="expandAll">
                                    Expand All
                                    <el-tooltip placement="top-end" effect="light" content="This will automatically expand all rows of the table when displayed on a device that hides
                            any columns.">
                                        <i class="el-icon-info el-text-info"></i>
                                    </el-tooltip>
                                </el-radio-button>
                            </el-radio-group>
                        </div>

                        <div class="form_group">
                            <label>{{ $t('Position toggle') }}</label>
                            <el-radio-group size="mini" v-model="tableSettings.togglePosition">
                                <el-radio-button label="first">
                                    First Column
                                    <el-tooltip placement="top-end" effect="light"
                                                content="If you use responsive breakdown then the '+' icon will show at the first visible column">
                                        <i class="el-icon-info el-text-info"></i>
                                    </el-tooltip>
                                </el-radio-button>
                                <el-radio-button label="last">
                                    Last Column
                                    <el-tooltip placement="top-end" effect="light"
                                                content="If you use responsive breakdown then the '+' icon will show at the last visible column">
                                        <i class="el-icon-info el-text-info"></i>
                                    </el-tooltip>
                                </el-radio-button>
                            </el-radio-group>
                        </div>

                        <div class="form_group">
                            <label for="extra_css_class">{{ $t('Extra CSS Class for the table') }}</label>
                            <input id="extra_css_class" class="form_control" type="text"
                                   v-model="tableSettings.extra_css_class"/>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <div class="ninja_design_tips" v-if="design_tips.length">
                    <ul class="ninja_design_tips_lists">
                        <li v-for="design_tip in design_tips"><i class="el-icon-warning"></i> <span
                                v-html="design_tip"></span></li>
                    </ul>
                </div>

                <div v-if="!has_pro" class="upgrade_box">
                    <a target="_blank"
                       href="https://wpmanageninja.com/downloads/ninja-tables-pro-add-on/?utm_source=ninja-tables&utm_medium=wp&utm_campaign=wp_plugin&utm_term=upgrade_studio"
                       class="el-button el-button--danger el-button--small">
                        <i class="dashicons dashicons-shield"></i> {{ $t('Upgrade To Pro to unlock advanced features')
                        }}
                    </a>
                </div>
            </div>
        </div>
        <sortable-upgrade-notice :show="sortableUpgradeNotice"
                                 @close="sortableUpgradeNotice = false"></sortable-upgrade-notice>
    </div>
</template>

<script type="text/babel">
    import {tableLibs} from '../../data/data'
    import get from 'lodash/get'
    import size from 'lodash/size'
    import forEach from 'lodash/forEach'
    import intersection from 'lodash/intersection';
    import SortableUpgradeNotice from '../includes/SortableUpgradeNotice.vue';
    import NinjaColorPicker from '../Extras/ColorPicker';

    export default {
        name: 'table_preview',
        props: ['config'],
        components: {
            SortableUpgradeNotice,
            NinjaColorPicker
        },
        data() {
            return {
                rows: [],
                activeDesign: 'features',
                tableId: this.$route.params.table_id,
                tableSettings: this.config.settings,
                table_body_html: '',
                data_loaded: false,
                script_loaded: false,
                footableLoading: false,
                tableLibs: tableLibs(),
                has_pro: !!window.ninja_table_admin.hasPro,
                savingSettings: false,
                tableInnerHtml: '',
                showingDevice: 'desktop',
                hasSortable: !!window.ninja_table_admin.hasSortable,
                sortableUpgradeNotice: false,
                columnCss: ''
            }
        },
        computed: {
            wrapperClasses() {
                let classes = [];
                classes.push(this.tableSettings.css_lib);
                classes.push('ninja_device_' + this.showingDevice);
                if (this.tableSettings.table_color_type == 'custom_color' || this.tableSettings.table_color != 'ninja_no_color_table') {
                    classes.push('colored_table');
                }
                return classes;
            },
            tableClasses() {
                let classes = [];
                classes.push('foo_table_' + this.tableId);

                if (this.tableSettings.table_color_type == 'custom_color') {
                    classes.push('inverted');
                    classes.push('ninja_custom_color');
                } else {
                    if (this.tableSettings.table_color && this.tableSettings.table_color != 'ninja_no_color_table') {
                        classes.push('inverted');
                    }
                    classes.push(this.tableSettings.table_color);
                }

                if (this.tableSettings.pagination_position) {
                    classes.push('footable-paging-' + this.tableSettings.pagination_position);
                } else {
                    classes.push('footable-paging-right');
                }

                if (this.tableSettings.hide_header_row) {
                    classes.push('ninjatable_hide_header_row');
                }
                if (this.tableSettings.hide_all_borders) {
                    classes.push('hide_all_borders');
                }
                classes.push('ninja_table_pro');

                if (this.tableSettings.search_position) {
                    classes.push('ninja_search_' + this.tableSettings.search_position);
                }

                let table_css_classes = [];
                if (this.tableSettings.css_classes) {
                    table_css_classes = this.availableCssClasses.filter(value => -1 != this.tableSettings.css_classes.indexOf(value));
                }

                if (this.tableSettings.css_lib == 'semantic_ui') {
                    classes.push('ui');
                }

                return [...table_css_classes, ...classes];
            },
            formattedColumns() {
                let columns = this.config.columns;
                let formattedColumns = [];
                jQuery.each(columns, (index, column) => {
                    formattedColumns.push({
                        name: column.key,
                        title: column.name,
                        breakpoints: column.breakpoints,
                        type: column.data_type,
                        sortable: true,
                        classes: ['ninja_column_' + index],
                        visible: (column.breakpoints == 'hidden') ? false : true
                    });
                });
                return formattedColumns;
            },
            app_ready() {
                return this.data_loaded && this.script_loaded
            },
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
            },
            availableCssClasses() {
                let cssClasses = [];
                forEach(this.availableStyles, (style) => {
                    cssClasses.push(style.key);
                });
                return cssClasses;
            },
            showProNotice() {
                if (this.has_pro) {
                    return false;
                }
                if (
                    (
                        this.tableSettings.table_color_type == 'custom_color' &&
                        this.activeDesign == 'color_customization'
                    )
                    ||
                    (
                        this.activeDesign == 'color_customization' &&
                        this.tableSettings.table_color &&
                        this.tableSettings.table_color != 'ninja_no_color_table')
                ) {
                    return true;
                }
                return false;
            },
            design_tips() {
                let tips = [];
                if (this.tableSettings.table_color_type == 'custom_color') {
                    if (
                        !this.tableSettings.table_search_color_primary ||
                        !this.tableSettings.table_header_color_primary ||
                        !this.tableSettings.table_color_primary ||
                        !this.tableSettings.table_color_secondary
                    ) {
                        tips.push('You should set colors at <b>"Table Colors"</b> Tab');
                    }
                }
                return tips;
            }
        },
        watch: {
            data_loaded() {
                if (this.app_ready) {
                    this.reInitFootables();
                }
            },
            script_loaded() {
                if (this.app_ready) {
                    this.reInitFootables();
                }
            },
            showingDevice() {
                this.$nextTick(() => {
                    this.reInitFootables();
                });
            },
            tableClasses: {
                handler(val) {
                    this.$nextTick(() => {
                        this.reInitFootables();
                    });
                },
                deep: true
            },
            tableSettings: {
                handler(val) {
                    this.$nextTick(() => {
                        this.generateColorCss();
                    });
                },
                deep: true
            },
            'tableSettings.enable_search'() {
                this.$nextTick(() => {
                    this.reInitFootables();
                });
            },
            'tableSettings.column_sorting'() {
                this.$nextTick(() => {
                    this.reInitFootables();
                });
            },
            'tableSettings.show_all'() {
                this.$nextTick(() => {
                    this.reInitFootables();
                });
            },
            'tableSettings.expand_type': function (new_val, old_val) {
                if (new_val != 'default') {
                    if (!this.has_pro) {
                        this.tableSettings.expand_type = 'default';
                        window.ninjaTableBus.$emit('show_pro_popup', 1);
                        return;
                    }
                }
                this.$nextTick(() => {
                    this.reInitFootables();
                });
            },
            'tableSettings.sorting_type': function (newVal, oldVal) {
                if (newVal === 'manual_sort') {
                    if (!this.has_pro) {
                        this.tableSettings.sorting_type = oldVal;
                        window.ninjaTableBus.$emit('show_pro_popup', 1);
                    } else if (!this.hasSortable) {
                        if (!this.hasSortable) {
                            this.tableSettings.sorting_type = oldVal;
                            this.sortableUpgradeNotice = true
                        }
                    } else {
                        this.initManualSorting();
                    }
                }
            },
            activeDesign() {
                this.checkColorPro();
            },
            'tableSettings.stackable'() {
                if( ! Array.isArray(this.tableSettings.stacks_devices) ) {
                    this.$set(this.tableSettings, 'stacks_devices', []);
                }

                if( ! Array.isArray(this.tableSettings.stacks_appearances) ) {
                    this.$set(this.tableSettings, 'stacks_appearances', []);
                }
            }
        },
        methods: {
            fetchTableBody() {
                jQuery.get(ajaxurl, {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'get_table_preview_html',
                    table_id: this.tableId
                })
                    .then(response => {
                        this.tableInnerHtml = response;
                        this.data_loaded = true;
                    })
                    .fail(error => {
                        jQuery('#footable_' + this.tableId).append('<h1>Error Loading</h1>');
                    });
            },
            initManualSorting() {
                let promise = new Promise((resolve, reject) => {
                    window.ninjaTableBus.$emit('initManualSorting', {
                        table_id: this.tableId,
                        noData: true
                    }, resolve, reject);
                })
            },
            storeSettings() {
                this.checkColorPro();
                this.savingSettings = true;
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
                        this.$message({
                            showClose: true,
                            message: res.message,
                            type: 'success'
                        });
                    })
                    .fail((error) => {

                    })
                    .always(() => {
                        this.savingSettings = false;
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

            reInitFootables() {
                if (!this.app_ready) {
                    return;
                }
                if (typeof FooTable == 'object') {
                    let ft = FooTable.get('#footable_' + this.tableId);
                    if (ft) {
                        ft.destroy();
                    }
                }
                jQuery('#footable_' + this.tableId).find('thead,tbody,tfoot').remove();
                this.footableLoading = false;
                jQuery('#footable_' + this.tableId).append(this.tableInnerHtml);
                this.initFootables();
            },

            initFootables() {
                if (this.footableLoading) {
                    return;
                }
                this.footableLoading = true;

                let paginateStatus = true;
                if (this.tableSettings.show_all == 'true' || this.tableSettings.show_all == '1') {
                    paginateStatus = false;
                }
                let perPage = 10;
                if (this.tableSettings.perPage < 10) {
                    perPage = this.tableSettings.perPage;
                }

                let isParentWidth = false;
                if (this.showingDevice != 'desktop') {
                    isParentWidth = true;
                }
                let initConfig = {
                    "columns": this.formattedColumns,
                    "cascade": false,
                    "useParentWidth": isParentWidth,
                    "expandFirst": this.tableSettings.expand_type == 'expandFirst',
                    "expandAll": this.tableSettings.expand_type == 'expandAll',
                    sorting: {
                        enabled: !!this.tableSettings.column_sorting
                    },
                    filtering: {
                        "enabled": !!this.tableSettings.enable_search,
                        "delay": 1,
                        "connectors": false,
                        "ignoreCase": true
                    },
                    paging: {
                        "enabled": paginateStatus,
                        "size": perPage,
                        "container": "#footable_parent_" + this.tableId + " .paging-ui-container"
                    }
                };
                let $table = jQuery('#footable_' + this.tableId);
                $table.footable(initConfig);
                this.generateColorCss();
                this.footableLoading = false;
                jQuery("td:contains('#colspan#')").remove();

                this.config.columns.forEach((column, index) => {
                    $table.find('th.ninja_column_' + index)
                        .css('text-align', column.textAlign)
                        .css('width', column.width + 'px');
                });

            },

            dysel(options) {
                // get options
                var links = options.links;
                var callback = options.callback;
                var nocache = options.nocache;
                var debug = options.debug;

                // js and css file loader
                var loadjscssfile = function (filename, cb) {
                    filename = filename.toString();
                    var ext = filename.split('.').pop();
                    var fileref = null;
                    if (ext == "js") {
                        // for Javascript
                        fileref = document.createElement('script');
                        fileref.setAttribute("type", "text/javascript");
                        fileref.setAttribute("src", filename);
                    } else if (ext == "css" || filename.indexOf('googleapis.com/css?') > -1) {
                        // for CSS + google fonts
                        fileref = document.createElement("link");
                        fileref.setAttribute("rel", "stylesheet");
                        fileref.setAttribute("type", "text/css");
                        fileref.setAttribute("href", filename);
                    }
                    // callback trigger (w/debug if needed)
                    if (typeof fileref != "undefined") {
                        if (cb) {
                            var mycallback = cb;
                            if (debug) { // if debug redefine callback and add console.log
                                mycallback = function () {

                                    cb();
                                }
                            }
                            // trigger the callback when resource is loaded
                            fileref.onreadystatechange = mycallback;
                            fileref.onload = mycallback
                        }
                        if (debug) {

                        }
                        // push it into the header
                        document.getElementsByTagName("head")[0].appendChild(fileref);
                    }
                }

                // START HERE, i nest the final callback at the deepest
                // (callbacks will be stacked in reverse order from here)
                var totalScript = callback;

                // create nested functions as callbacks,
                // at the end, if needed, the callback from options is executed
                // like func_1(loadfile_1, func_2(loadfile_2, func_3(loadfile_3, cbFromOptions)))
                for (var i = links.length - 1; i >= 0; i--) {
                    var old = totalScript;
                    let currentLink = links[i];
                    if (nocache) {
                        currentLink += '?' + +new Date().getTime();
                    }
                    totalScript = function (oldcb) {
                        loadjscssfile(this, oldcb);
                    }.bind(currentLink, old);
                }
                // execute the nested callbacks
                totalScript();
            },
            loadRequiredScripts() {
                let that = this;
                this.dysel({
                    links: window.ninja_table_admin.preview_required_scripts,
                    callback() {
                        that.script_loaded = true;
                    }
                })
            },
            size,
            get,
            generateColorCss() {
                if (this.tableSettings.table_color_type == 'pre_defined_color') {
                    jQuery('#table_designer_css').html('');
                    return;
                }
                let prefix = '#footable_' + this.tableId;
                let css = `
                    ${prefix} {
                        background-color: ${this.tableSettings.table_color_primary} !important;
                        color: ${this.tableSettings.table_color_secondary} !important;
                    }
                     ${prefix} thead tr.footable-filtering th {
                        background-color: ${this.tableSettings.table_search_color_primary} !important;
                        color: ${this.tableSettings.table_search_color_secondary} !important;
                    }
                    ${prefix}:not(.hide_all_borders) thead tr.footable-filtering th {
                        ${this.tableSettings.table_search_color_border ? `
                         border : 1px solid ${this.tableSettings.table_search_color_border} !important;
                        ` : `
                        border : 1px solid transparent !important;
                        `}
                    }
                    ${prefix} .input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle) {
                         background-color: ${this.tableSettings.table_search_color_secondary} !important;
                         color: ${this.tableSettings.table_search_color_primary} !important;
                    }
                     ${prefix} tr.footable-header, ${prefix} tr.footable-header th {
                        background-color: ${this.tableSettings.table_header_color_primary} !important;
                        color: ${this.tableSettings.table_color_header_secondary} !important;
                    }
                    ${prefix}:not(.hide_all_borders) tr.footable-header th {
                        border-color: ${this.tableSettings.table_color_header_border} !important;
                    }
                    ${prefix}:not(.hide_all_borders) tbody tr td {
                       border-color: ${this.tableSettings.table_color_border} !important;
                    }

                     ${(this.tableSettings.alternate_color_status == 'yes') ? `
                         ${prefix} tbody tr:nth-child(even) {
                             background-color: ${this.tableSettings.table_alt_color_primary};
                             color: ${this.tableSettings.table_alt_color_secondary};
                         }
                         ${prefix} tbody tr:nth-child(odd) {
                             background-color: ${this.tableSettings.table_alt_2_color_primary};
                             color: ${this.tableSettings.table_alt_2_color_secondary};
                         }
                         ${prefix} tbody tr:nth-child(even):hover {
                             background-color: ${this.tableSettings.table_alt_color_hover};
                         }
                         ${prefix} tbody tr:nth-child(odd):hover {
                             background-color: ${this.tableSettings.table_alt_2_color_hover};
                         }
                     ` : `
                     `}

                     ${prefix} tfoot .footable-paging {
                       background-color: ${this.tableSettings.table_footer_bg} !important;
                    }
                    ${prefix} tfoot .footable-paging .footable-page.active a {
                        background-color: ${this.tableSettings.table_footer_active} !important;
                    }
                    ${prefix}:not(.hide_all_borders) tfoot .footable-paging td {
                        border-color: ${this.tableSettings.table_footer_border} !important;
                    }
                `;
                jQuery('#table_designer_css').html(css);
            },
            changeColor(color, element) {
                this.$set(this.tableSettings, element, color);
            },
            checkColorPro() {
                if (this.has_pro) {
                    return;
                }
                if (this.tableSettings.table_color &&
                    this.tableSettings.table_color != 'ninja_no_color_table' ||
                    this.tableSettings.table_color_type != 'pre_defined_color'
                ) {
                    this.tableSettings.table_color_type = 'pre_defined_color';
                    this.tableSettings.table_color = 'ninja_no_color_table';
                }
            },
            generateDefaultCss() {
                let columnContentCss = this.config.table.custom_css;
                this.config.columns.forEach((column, index) => {
                    if (column.background_color || column.text_color || column.contentAlign) {
                        columnContentCss += `#footable_parent_${this.tableId} thead tr th.ninja_column_${index}, #footable_parent_${this.tableId} tbody tr td.ninja_column_${index} { background-color: ${column.background_color}; color: ${column.text_color}; }`;
                        columnContentCss += `#footable_parent_${this.tableId} tbody tr td.ninja_column_${index} { text-align: ${column.contentAlign}; }`;
                    }
                });
                jQuery('#ninja_table_designer_common_css').html(columnContentCss);
            }
        },
        mounted() {
            this.fetchTableBody();
            this.loadRequiredScripts();
            if (!this.tableSettings.table_color_type) {
                if (this.tableSettings.table_color == 'ninja_table_custom_color') {
                    this.$set(this.tableSettings, 'table_color_type', 'custom_color');
                } else {
                    this.$set(this.tableSettings, 'table_color_type', 'pre_defined_color');
                }
            }

            jQuery('.ninja_design_wrapper').css('width', jQuery('.wrap').width() + 'px');
            jQuery(window).on('resize', function () {
                jQuery('.ninja_design_wrapper').css('width', jQuery('.wrap').width() + 'px');
            });
            this.generateDefaultCss();
        }
    }
</script>
<style lang="scss">
    .striped > tbody > :nth-child(odd) {
        background: transparent;
    }

    .footable_parent.ninja_device_mobile {
        width: 480px;
        margin: 0 auto;
    }

    .footable_parent.ninja_device_tablet {
        max-width: 768px;
        padding: 0px 20px;
        margin: 0 auto;
    }

    .design_preview .footable_parent {
        .footable-header th {
            // word-break: break-all;
        }
    }
</style>
