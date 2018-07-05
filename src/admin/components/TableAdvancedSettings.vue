<template>
    <div>
        <div class="section_block">
            <h3>Table Render Type</h3>
            <p>Please the select the settings for your table render method. Using Legacy table you can use shortcodes in your cells and it will render the full table from php side. Table styles will be same for both tables. Most of the cases you will need Ajax Table which is recommended settings.</p>
            <div class="card_block">
                <div @click="changeTableType('ajax_table')" :class="(tableSettings.render_type == 'ajax_table') ? 'selected_type' : ''" class="section_card">
                    <div v-show="tableSettings.render_type == 'ajax_table'" class="selected_ribbon">Selected</div>
                    <h4>Ajax Table</h4>
                    <p>
                        Use this settings if you have lots of data and don't need cell merge features. It will load your data over ajax. Please note that, shortcodes in table will not work here.
                    </p>
                </div>
                <div @click="changeTableType('legacy_table')" :class="(tableSettings.render_type == 'legacy_table') ? 'selected_type' : ''" class="section_card">
                    <div v-show="tableSettings.render_type == 'legacy_table'" class="selected_ribbon">Selected</div>
                    <h4>Legacy Table (Advanced)</h4>
                    <div>
                        <p>
                        Use this table if you have small amount of data and need the following features
                        </p>
                        <ul>
                            <li>Colspan ( Cell-Merge )</li>
                            <li>Rendering table using PHP</li>
                            <li>Rendering table using PHP</li>
                            <li>Render shortcode into table cells</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="section_block">
            <h3>Row Details ( Responsive Drawer ) Details</h3>
            <div class="card_block expand_blocks">
                <div @click="changeDrawerType('default')" :class="(tableSettings.expand_type == 'default') ? 'selected_type' : ''" class="section_card expand_card">
                    <div v-show="tableSettings.expand_type == 'default'" class="selected_ribbon">Selected</div>
                    <h4>Default</h4>
                    <p>Show All the responsive columns data into the responsive drawer</p>
                </div>
                <div @click="changeDrawerType('expandFirst')" :class="(tableSettings.expand_type == 'expandFirst') ? 'selected_type' : ''" class="section_card expand_card">
                    <div v-show="tableSettings.expand_type == 'expandFirst'" class="selected_ribbon">Selected</div>
                    <h4>Expand First Row</h4>
                    <p>This will automatically expand the first row of the table when displayed on a device that hides any columns.</p>
                </div>
                <div @click="changeDrawerType('expandAll')" :class="(tableSettings.expand_type == 'expandAll') ? 'selected_type' : ''" class="section_card expand_card">
                    <div v-show="tableSettings.expand_type == 'expandAll'" class="selected_ribbon">Selected</div>
                    <h4>Expand All Rows</h4>
                    <p>This will automatically expand all rows of the table when displayed on a device that hides any columns.</p>
                </div>
            </div>
        </div>
        
        <div v-if="hasPro" class="section_block">
            <h3>Language Settings</h3>
            <div class="language_block">
                <div class="form_group">
                    <label for="no_result_text">Empty Results Text:</label>  
                    <input v-model="tableSettings.no_result_text" id="no_result_text" type="text" class="form_control" autocomplete="off">
                    <small>The text to display if the table contains no rows.</small>
                </div>
                <div class="form_group">
                    <label for="search_box_placeholder">Search Box Placeholder Text</label>
                    <input v-model="tableSettings.search_placeholder" id="search_box_placeholder" type="text" class="form_control" autocomplete="off">
                    <small>Search Box Placeholder</small>
                </div>
                <div class="form_group">
                    <label for="search_box_in">Search Dropdown Heading</label>
                    <input v-model="tableSettings.search_in_text" id="search_box_in" type="text" class="form_control" autocomplete="off">
                    <small>Search Dropdown Box Title</small>
                </div>
            </div>
        </div>

        <div class="section_block">
            <h3>Caching</h3>
            <div class="caching-block">
                <div class="form-group">
                    <span style="margin-right: 5px;">Disable Caching</span>
                    <el-switch v-model="tableSettings.shouldNotCache" active-value="yes" inactive-value="no" />
                </div>
            </div>
        </div>
        
        <el-button @click="storeSettings()" size="small" type="primary">Update Settings</el-button>
    </div>
</template>

<script type="text/babel">
    import ElButton from "element-ui/packages/button/src/button";

    export default {
        components: {ElButton},
        name: 'advanced_settings',
        props: ['config'],
        data() {
            return {
                doingAjax: false,
                tableId: this.$route.params.table_id,
                tableSettings: this.config.settings,
                hasPro: !!window.ninja_table_admin.hasPro
            }
        },
        methods: {
            changeTableType(tableType) {
                if(!this.hasPro && tableType == 'legacy_table') {
                    window.ninjaTableBus.$emit('show_pro_popup', 1);
                    this.tableSettings.render_type = 'ajax_table';
                   return;
                }
                this.tableSettings.render_type  = tableType;
            },
            storeSettings() {
                this.doingAjax = true;
                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'update-table-settings',
                    table_id: this.tableId,
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
            changeDrawerType(type) {
                if(!this.hasPro && type != 'default') {
                    window.ninjaTableBus.$emit('show_pro_popup', 1);
                    this.tableSettings.expand_type = 'default';
                    return;
                }
                this.tableSettings.expand_type = type;
            }
        },
        mounted() {
            if(this.tableSettings.render_type == undefined) {
                this.$set(this.tableSettings, 'render_type', 'ajax_table');
            }
            if(this.tableSettings.expand_type == undefined) {
                this.$set(this.tableSettings, 'expand_type', 'default');
            }
            if(this.hasPro) {
                if(this.tableSettings.search_placeholder == undefined) {
                    this.tableSettings.search_placeholder = 'Search';
                }
                if(this.tableSettings.search_in_text == undefined) {
                    this.tableSettings.search_in_text = 'Search in';
                }
                if(this.tableSettings.no_result_text == undefined) {
                    this.tableSettings.no_result_text = 'No Result Found';
                }
            }
        }
    }
</script>
