<template>
    <el-form ref="form" :model="model" label-width="200px" class="form-wrapper">
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
            <el-input v-model="model.name" />
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
            <el-input v-model="model.key" :disabled="updating" />
        </el-form-item>

        <!-- Data Type -->
        <el-form-item>
            <template slot="label">
                {{ $t('Data Type') }}

                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>Data Type</h3>

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
        </el-form-item>

        <!--Date Format -->
        <el-form-item v-if="model.data_type == 'date'">
            <template slot="label">
                {{ $t('Date Format') }}

                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>Date Format</h3>

                        <p>
                            Pattern of the date value.
                        </p>
                    </div>

                    <i class="el-icon-info el-text-info" />
                </el-tooltip>
            </template>

            <el-radio-group v-model="formatType">
                <el-radio label="standard">Standard</el-radio>
                <el-radio label="custom" @click.native="showProPopUp" :disabled="!hasPro">Custom</el-radio>
            </el-radio-group>

            <!-- Format dropdown -->
            <el-form-item v-if="formatType == 'standard'" >
                <select v-model="model.dateFormat">
                    <option value="">Select a Format</option>
                    <option v-for="(format, i) in dateFormats" :value="i" :key="i">
                        {{ i }} - (Ex: {{ format }})
                    </option>
                </select>
            </el-form-item>

            <!-- Format input -->
            <el-form-item v-else>
                <el-input v-model="model.dateFormat" placeholder="Enter moment.js supported format" />
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
        
        <div v-if="moreSettings" class="advanced-settings">
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

                <el-input v-model="model.classes" :disabled="!hasPro" />
            </el-form-item>

            <!-- Max width -->
            <el-form-item>
                <template slot="label">
                    {{ $t("Max Width") }}

                    <el-tooltip class="item" placement="bottom-start" effect="light">
                        <div slot="content">
                            <h3>Maximum Width</h3>

                            <p>
                                Enter the maximum width of the column. This will be applied for the entire column
                            </p>
                        </div>

                        <i class="el-icon-info el-text-info" />
                    </el-tooltip>
                </template>
                
                <el-input type="number" v-model="model.width" />
            </el-form-item>
            <!-- Text alignment -->
            <el-form-item>
                <template slot="label">
                    {{ $t("Text Align") }}

                    <el-tooltip class="item" placement="bottom-start" effect="light">
                        <div slot="content">
                            <h3>Text Alignment</h3>

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

            <!-- Enable / Disable Table HTML -->
            <el-form-item>
                <el-checkbox v-model="model.enable_html_content" :value="true" label="Enable HTML Table Header Content"></el-checkbox>
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
            
            
        </div>

        <div class="form_group">
            <button class="button" @click.prevent="toggleAdvancedSettings">
                Advanced Settings

                <i class="el-icon-setting el-text-info" />
            </button>

            <div class="pull-right">
                <template v-if="!updating">
                    <button @click.prevent="cancel" class="button">
                        Cancel
                    </button>

                    <button @click.prevent="addColumn" class="button button-primary">Add Column</button>
                </template>

                <template v-else>
                    <button @click.prevent="deleteColumn" class="button">Delete</button>

                    <button @click.prevent="store" class="button button-primary">
                        {{ $t('Update') }}
                    </button>
                </template>
            </div>
        </div>
    </el-form>
</template>

<script>
    import wpEditor from '../../../common/_wp_editor';
    export default {
        name: "ColumnsEditor",
        components: {
          'wp_editor':  wpEditor
        },
        props: {
            "model": {
                type: Object,
                default: {}
            },
            "hasPro": {
                type: Boolean,
                default: false
            },
            "updating": {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dataTypesOptions: {
                    text: this.$t("Single Line Text Field"),
                    textarea: this.$t("Text Area"),
                    html: this.$t("HTML Field"),
                    number: this.$t("Numeric Value"),
                    date: this.$t("Date Field")
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
                moreSettings: false,
                alignmentOptions: {
                    'center': 'Center',
                    'left': 'Left',
                    'right': 'Right',
                    'justify': 'Justify',
                    'start': 'Start',
                    'end': 'End',
                }
            };
        },
        watch: {
            formatType() {
                if (this.formatType === "custom") {
                    this.model.dateFormat = "";
                }
            }
        },
        mounted() {
            this.model.dateFormat = this.model.dateFormat || "";
            this.model.enable_html_content = ( this.model.enable_html_content == 'true') ? true : false;
            this.model.header_html_content =  this.model.header_html_content || '';
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
            toggleAdvancedSettings() {
                if (!this.moreSettings) {
                    this.showProPopUp();
                }
                
                this.moreSettings = !this.moreSettings;
            },
            showProPopUp() {
                if (!this.hasPro) {
                    window.ninjaTableBus.$emit('show_pro_popup', 1);
                }
            }
        }
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

        .advanced-settings {
            margin-left: 15px;
            border-left: 1px dashed #c0c4cc;
        }
    }
</style>

