<template>
    <el-form ref="form" :model="model" label-width="200px" class="form-wrapper">
        <el-tabs v-model="activeTab" @tab-click="onTabClick">
            <!-- Basic Settings -->
            <el-tab-pane label="Basic Settings" name="basic">
                <!-- Column Name -->
                <el-form-item>
                    <template slot="label">
                        {{ $t('Column Name') }}
                        <el-tooltip class="item" placement="bottom-start" effect="light">
                            <div slot="content">
                                <h3>Column Name</h3>
                                <p>
                                    Enter a column name to set the header title.
                                </p>
                            </div>
                            <i class="el-icon-info el-text-info" />
                        </el-tooltip>
                    </template>
                    <el-input size="small" v-model="model.name" />
                </el-form-item>

                <!-- Column Key -->
                <el-form-item>
                    <template slot="label">
                        {{ $t('Column Key') }}

                        <el-tooltip class="item" placement="bottom-start" effect="light">
                            <div slot="content">
                                <h3>Column Key</h3>

                                <p>
                                    Column key is for data mapping, export and import table data.
                                </p>
                            </div>

                            <i class="el-icon-info el-text-info" />
                        </el-tooltip>
                    </template>
                    <el-input size="small" v-model="model.key" :disabled="updating" />
                </el-form-item>

                <!-- Data Type -->
                <el-form-item>
                    <template slot="label">
                        {{ $t('Data Type') }}

                        <el-tooltip class="item" placement="bottom-start" effect="light">
                            <div slot="content">
                                <h3> {{ $t('Data Type') }}</h3>
                                <p>
                                    Choose the data type of the column.
                                </p>
                            </div>
                            <i class="el-icon-info el-text-info" />
                        </el-tooltip>
                    </template>
                    <select v-model="model.data_type">
                        <option v-for="(typeName, typeKey) in dataTypesOptions" :value="typeKey" :key="typeKey">
                            {{ typeName }}
                        </option>
                    </select>
                    <p v-show="hasPro">Select HTML Field if you want to add Link, media or any type of html</p>
                </el-form-item>

                <!--Date Format -->
                <el-form-item v-if="model.data_type == 'date'">
                    <template slot="label">
                        {{ $t('Date Format') }}

                        <el-tooltip class="item" placement="bottom-start" effect="light">
                            <div slot="content">
                                <h3> {{ $t('Date Format') }}</h3>

                                <p>
                                    Pattern of the date value.
                                </p>
                            </div>

                            <i class="el-icon-info el-text-info" />
                        </el-tooltip>
                    </template>

                    <el-radio-group v-model="model.formatType">
                        <el-radio label="standard">{{ $t('Standard') }}</el-radio>
                        <el-radio label="custom" @click.native="showProPopUp" :disabled="!hasPro">Custom</el-radio>
                    </el-radio-group>

                    <!-- Format dropdown -->
                    <el-form-item v-if="model.formatType != 'custom'" >
                        <select v-model="model.dateFormat">
                            <option value="">{{ $t('Select a Format') }}</option>
                            <option v-for="(format, i) in dateFormats" :value="i" :key="i">
                                {{ i }} - (Ex: {{ format }})
                            </option>
                        </select>
                    </el-form-item>

                    <!-- Format input -->
                    <el-form-item v-else>
                        <el-input size="small" v-model="model.dateFormat" placeholder="Enter moment.js supported format" />
                    </el-form-item>
                </el-form-item>

                <!--Number Format -->
                <template v-else-if="model.data_type == 'number' && hasPro">
                    <el-form-item>
                        <template slot="label">
                            {{ $t('Thousand Separator') }}

                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <h3> {{ $t('Thousand Separator') }}</h3>
                                    <p>
                                        Please Provide The Thousand Separator If Any.
                                    </p>
                                </div>

                                <i class="el-icon-info el-text-info" />
                            </el-tooltip>
                        </template>
                        <el-radio-group v-model="model.thousandSeparator">
                            <el-radio label="">None</el-radio>
                            <el-radio label=".">Dot (.)</el-radio>
                            <el-radio label=",">Comma (,)</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <template slot="label">
                            {{ $t('Decimal Separator') }}

                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <h3> {{ $t('Thousand Separator') }}</h3>
                                    <p>
                                        Please Provide The Decimal Separator If Any.
                                    </p>
                                </div>

                                <i class="el-icon-info el-text-info" />
                            </el-tooltip>
                        </template>
                        <el-radio-group v-model="model.decimalSeparator">
                            <el-radio label="">None</el-radio>
                            <el-radio label=".">Dot (.)</el-radio>
                            <el-radio label=",">Comma (,)</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </template>

                <!--Selection Field -->
                <el-form-item v-else-if="model.data_type == 'selection'">
                    <template slot="label">
                        {{ $t('Select Items') }}

                        <el-tooltip class="item" placement="bottom-start" effect="light">
                            <div slot="content">
                                <h3>Select Field</h3>
                                <p>
                                    Use Select Field to add data in your table from predefined list
                                </p>
                            </div>

                            <i class="el-icon-info el-text-info" />
                        </el-tooltip>
                    </template>

                    <!-- Format input -->
                    <el-form-item>
                        <p v-if="!has_pro"><b>Selection feature is only available on Pro version Please upgrade to pro to unlock this feature</b></p>
                        <el-input type="textarea"
                                  size="small"
                                  :disabled="!has_pro"
                                  v-model="model.selections"
                                  placeholder="Enter Select items one per line"
                                  :autosize="{ minRows: 4, maxRows: 8}"
                        />
                        <small>Enter Select items one per line</small>
                    </el-form-item>
                </el-form-item>

                <!-- Responsive Breakpoint -->
                <el-form-item>
                    <template slot="label">
                        {{ $t("Responsive Breakpoint") }}
                        <el-tooltip class="item" placement="bottom-start" effect="light">
                            <div slot="content">
                                <h3>Responsive Breakpoint</h3>

                                <p>
                                    Choose responsive breakpoints of your table columns. <br>
                                    For more details check <a href="https://wpmanageninja.com/r/docs/ninja-tables/configure-responsive-breakdowns-for-table/?utm_source=ninja-tables">documentation</a>.
                                </p>
                            </div>

                            <i class="el-icon-info el-text-info" />
                        </el-tooltip>
                    </template>

                    <select v-model="model.breakpoints">
                        <option v-for="(option, optionKey) in breakPointsOptions" :value="optionKey" :key="optionKey">
                            {{ option }}
                        </option>
                    </select>
                </el-form-item>

                <wp-post-dynamic-column
                    v-if="dataSourceType == 'wp-posts'"
                    :columns="columns"
                    :column="model"
                />
            </el-tab-pane>

            <!-- Advanced Settings -->
            <el-tab-pane label="Advanced Settings" name="advanced">
                <div class="advanced-settings">

                    <div class="ninja_table_inline_upgrade" v-if="!hasPro">

                        <H3>Advanced Column Settings</H3>
                        <p>
                            Customize your table's column's width, custom css class, content alignments, column styling with this feature.
                            Advanced Column Settings is a pro feature and You can use it once you upgrade to Ninja Tables Pro.
                            Ninja Table Pro has lots of features that will help you to build any type of Tables.
                        </p>

                        <a href="https://wpmanageninja.com/ninja-tables/ninja-tables-pro-pricing/?utm_source=ninja-tables&utm_medium=wp&utm_campaign=advanced_column&utm_term=upgrade"
                           target="_blank">
                            <button type="button" class="el-button el-button--danger">
                                <span>Buy Pro and Enable This Module</span>
                            </button>
                        </a>
                    </div>

                    <!-- Extra classes -->
                    <el-form-item>
                        <template slot="label">
                            {{ $t("Extra Classes") }}

                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <h3>Extra CSS Classes</h3>

                                    <p>
                                        Enter extra CSS classes to the column. <br>
                                        Use `space` to separate each class.
                                    </p>
                                </div>

                                <i class="el-icon-info el-text-info" />
                            </el-tooltip>
                        </template>

                        <el-input size="small" v-model="model.classes" :disabled="!hasPro" />
                    </el-form-item>

                    <!-- Max width -->
                    <el-form-item>
                        <template slot="label">
                            {{ $t("Max Width") }}

                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <h3>{{ $t('Maximum Width') }}</h3>

                                    <p>
                                        Enter the maximum width of the column. This will be applied for the entire column
                                    </p>
                                </div>

                                <i class="el-icon-info el-text-info" />
                            </el-tooltip>
                        </template>
                        <el-input size="small" type="number" :disabled="!hasPro" v-model="model.width" />
                    </el-form-item>

                    <!-- Header Text alignment -->
                    <el-form-item>
                        <template slot="label">
                            {{ $t("Header Text Align") }}

                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <h3>Header Text Alignment</h3>

                                    <p>
                                        Choose the text alignment. This will be applied only for header
                                    </p>
                                </div>

                                <i class="el-icon-info el-text-info" />
                            </el-tooltip>
                        </template>

                        <select v-model="model.textAlign" :disabled="!hasPro">
                            <option v-for="(alignmentLabel, alignmentVal) in alignmentOptions"
                                    :value="alignmentVal" :key="alignmentVal"
                            >{{ alignmentLabel }}</option>
                        </select>
                    </el-form-item>

                    <!-- Content Text alignment -->
                    <el-form-item>
                        <template slot="label">
                            {{ $t("Row Content Text Align") }}

                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <h3>Content Text Alignment</h3>
                                    <p> Choose the text alignment for Column Rows</p>
                                </div>
                                <i class="el-icon-info el-text-info"></i>
                            </el-tooltip>
                        </template>

                        <select v-model="model.contentAlign" :disabled="!hasPro">
                            <option v-for="(alignmentLabel, alignmentVal) in contentAlignmentOptions"
                                    :value="alignmentVal" :key="alignmentVal"
                            >{{ alignmentLabel }}</option>
                        </select>
                    </el-form-item>

                    <!-- Enable / Disable Table HTML -->
                    <el-form-item>
                        <el-checkbox :disabled="!hasPro" v-model="model.enable_html_content" :value="true" label="Enable HTML Table Header Content"></el-checkbox>
                    </el-form-item>

                    <!-- model.header_html_content -->
                    <el-form-item v-if="model.enable_html_content">
                        <template slot="label">
                            {{ $t("Header HTML Content") }}
                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <h3>Header HTML Content</h3>
                                    <p>
                                        Provide content for table column header if you want to show html content.
                                    </p>
                                </div>
                                <i class="el-icon-info el-text-info" />
                            </el-tooltip>
                        </template>

                        <wp_editor v-model="model.header_html_content"></wp_editor>
                    </el-form-item>

                    <el-form-item>
                        <template slot="label">
                            {{ $t("Filterable") }}

                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <h3>Filterable</h3>

                                    <p>
                                        If You enable this then this column data will not be filterable at the frontend.
                                    </p>
                                </div>

                                <i class="el-icon-info el-text-info" />
                            </el-tooltip>
                        </template>
                        <el-checkbox :disabled="!hasPro" v-model="model.unfilterable" true-label="yes" false-label="no" value="yes" label="Disable frontend search for this column data"></el-checkbox>
                    </el-form-item>

                    <el-form-item>
                        <template slot="label">
                            {{ $t("Sortable") }}

                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <h3>Sortable</h3>

                                    <p>
                                        If You enable this then this column data will not be sortable at the frontend.
                                    </p>
                                </div>

                                <i class="el-icon-info el-text-info" />
                            </el-tooltip>
                        </template>
                        <el-checkbox :disabled="!hasPro" v-model="model.unsortable" true-label="yes" false-label="no" value="yes" label="Disable frontend sorting for this column"></el-checkbox>
                    </el-form-item>

                    <el-form-item>
                        <template slot="label">
                            {{ $t("Column Background") }}
                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <h3>Background color</h3>

                                    <p>
                                       You can set background color of this particular column that will show on the frontend table.
                                    </p>
                                </div>
                                <i class="el-icon-info el-text-info" />
                            </el-tooltip>
                        </template>
                        <el-color-picker
                                :disabled="!hasPro"
                                v-model="model.background_color"
                                show-alpha
                        ></el-color-picker>
                    </el-form-item>

                    <el-form-item>
                        <template slot="label">
                            {{ $t("Column Text Color") }}
                            <el-tooltip class="item" placement="bottom-start" effect="light">
                                <div slot="content">
                                    <h3>Text Color color</h3>

                                    <p>
                                        You can set Column Text color of this particular column that will show on the frontend table.
                                    </p>
                                </div>
                                <i class="el-icon-info el-text-info" />
                            </el-tooltip>
                        </template>
                        <el-color-picker
                                :disabled="!hasPro"
                                v-model="model.text_color"
                                show-alpha
                        ></el-color-picker>
                    </el-form-item>

                </div>
            </el-tab-pane>

            <!-- Conditional Settings -->
            <el-tab-pane label="Conditional Formatting" name="conditional">
                <condition :column="model" :has-pro="hasPro" />
            </el-tab-pane>

            <!-- Transform Value -->
            <el-tab-pane label="Transform Value" name="transformer">
                <content-transformer :columns="columns" :column="model" />
            </el-tab-pane>

            <hr style="margin:10px 0">

            <!-- Buttons -->
            <div class="form_group">
                <div class="pull-right">
                    <template v-if="!updating">
                        <el-button @click.prevent="cancel" type="danger" size="small" v-if="!hideCancel">
                            {{ $t('Cancel') }}
                        </el-button>

                        <el-button
                        @click.prevent="addColumn"
                        type="primary"
                        size="small">Add Column</el-button>
                    </template>

                    <template v-else>
                        <el-popover
                            v-if="!hideDelete"
                            placement="top"
                            width="170"
                            v-model="showConfirm"
                            trigger="click"
                        >
                            <p>Are you sure to delete this?</p>
                            <div style="text-align: right; margin: 0">
                                <el-button
                                    type="text"
                                    size="mini"
                                    @click="showConfirm = false"
                                >cancel</el-button>

                                <el-button
                                    type="primary"
                                    size="mini"
                                    @click="deleteColumn"
                                >confirm</el-button>
                            </div>
                            <el-button
                                v-if="!hideDelete"
                                type="danger"
                                size="small"
                                slot="reference"
                                >{{ $t('Delete') }}</el-button>
                        </el-popover>

                        <el-button @click.prevent="store" type="primary" size="small">
                            {{ $t('Update') }}
                        </el-button>
                    </template>
                </div>
            </div>
        </el-tabs>
    </el-form>
</template>

<script>
    import wpEditor from '../../../common/_wp_editor';
    import conditional from './_conditional';
    import WPPostDynamicColumn from './WPPostDynamicColumn';
    import ContentTransformer from './ContentTransformer';

    export default {
        name: "ColumnsEditor",
        components: {
            'wp_editor':  wpEditor,
            'condition': conditional,
            'wp-post-dynamic-column': WPPostDynamicColumn,
            'content-transformer': ContentTransformer,
        },
        props: {
            model: {
                type: Object,
                default: () => ({})
            },
            hasPro: {
                type: Boolean,
                default: false
            },
            updating: {
                type: Boolean,
                default: false
            },
            moreSettings: {
                type: Boolean,
                default: false
            },
            hideDelete: {
                type: Boolean,
                default: false
            },
            hideCancel: {
                type: Boolean,
                default: false
            },
            dataSourceType: {
                type: String,
                default: 'default'
            },
            columns: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                dataTypesOptions: {
                    text: this.$t("Single Line Text Field"),
                    textarea: this.$t("Text Area"),
                    html: this.$t("HTML Field"),
                    number: this.$t("Numeric Value"),
                    date: this.$t("Date Field"),
                    selection: this.$t("Select Field")
                },
                breakPointsOptions: {
                    'xs': this.$t('Initial Hidden Mobile'),
                    'xs sm': this.$t('Initial Hidden Mobile and Tab'),
                    'xs sm md lg': this.$t('Initial Hidden Mobile, Tab and Regular Computers'),
                    '': this.$t('Always show in all devices'),
                    'hidden': this.$t('Totally hidden on all devices'),
                },
                dateFormats: {
                    'M/D/YYYY' : "4/28/2018",
                    'M/D/YY': "4/28/18",
                    'MM/DD/YY' : "04/28/18",
                    'MM/DD/YYYY': "04/28/2018",
                    'MMM/DD/YYYY' : "Apr/28/2018",
                    'YY/MM/DD': "18/04/28",
                    'YYYY-MM-DD': "2018-04-28",
                    'DD-MMM-YY' : "28-Apr-18"
                },
                formatType: 'standard',
                has_pro: !!window.ninja_table_admin.hasPro,
                alignmentOptions: {
                    '': 'Default',
                    'center': 'Center',
                    'left': 'Left',
                    'right': 'Right',
                    'justify': 'Justify',
                    'start': 'Start',
                    'end': 'End',
                },
                contentAlignmentOptions: {
                    '' : 'Default',
                    'center': 'Center',
                    'left': 'Left',
                    'right': 'Right',
                },
                activeTab: 'basic',
                showConfirm: false,
            };
        },
        watch: {
            formatType() {
                if (this.formatType === "custom") {
                    this.model.dateFormat = "";
                }
            },
            hideDelete(oldValue, newValue) {
                this.hideDelete = this.activeTab != 'basic';
            }
        },
        mounted() {
            if (!this.model) return;
            this.model.dateFormat = this.model.dateFormat || "";
            this.model.enable_html_content = ['true', true].indexOf(this.model.enable_html_content) !== -1;
            this.model.header_html_content =  this.model.header_html_content || '';
            if(!this.model.contentAlign) {
                this.$set(this.model, 'contentAlign', '');
            }
            if(!this.model.textAlign) {
                this.$set(this.model, 'textAlign', '');
            }
        },
        methods: {
            addColumn() {
                this.$emit('add');
            },
            cancel() {
                this.$emit('cancel');
            },
            deleteColumn() {
                this.$emit('delete');
            },
            store() {
                this.$emit('store');
            },
            onTabClick(tab, event) {
                if (tab.name == 'basic') {
                    this.hideDelete = false;
                } else {
                    this.hideDelete = true;
                    if (this.moreSettings) {
                        this.moreSettings = !this.moreSettings;
                    }
                }
            },
            showProPopUp() {
                if (!this.hasPro) {
                    window.ninjaTableBus.$emit('show_pro_popup', 1);
                }
            }
        },
    };
</script>

<style lang="scss">
    .form-wrapper {
        padding: 10px;

        label {
            display: initial;
            max-width: initial;
            margin-bottom: initial;
        }

        .el-form-item {
            margin-bottom: 15px;
        }

        .more-settings {
            &:hover {
                cursor: pointer;
            }

            i {
                font-size: 1.5em;
            }
        }
        .form_group {
            margin-top: 10px;
        }
    }
</style>
