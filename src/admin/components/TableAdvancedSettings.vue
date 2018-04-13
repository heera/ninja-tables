<template>
    <div>
        <div class="section_block">
            <h3>Table Render Type</h3>
            <p>Please the select the settings for your table render method. Using Legacy table you can use shortcodes in your cells and it will render the full table from php side. Table styles will be same for both tables. Most of the cases you will need Ajax Table which is recommended settings.</p>
            <div class="card_block">
                <div @click="changeTableType('ajax_table')" :class="(tableSettings.render_type == 'ajax_table') ? 'selected_type' : ''" class="section_card">
                    <div v-show="tableSettings.render_type == 'ajax_table'" class="selected_ribbon">Selected</div>
                    <h4>Ajax Table ( Recommended )</h4>
                    <p>
                        Use this settings if you have lots of data and don't need cell merge features. It will load your data over ajax
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
        <el-button  @click="storeSettings()" size="small" type="primary">Update Settings</el-button>
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
            }
        },
        mounted() {
            if(this.tableSettings.render_type == undefined) {
                this.$set(this.tableSettings, 'render_type', 'ajax_table');
            }
        }
    }
</script>
