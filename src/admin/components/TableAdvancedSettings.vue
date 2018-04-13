<template>
    <div>
        <div class="section_block">
            <h3>Table Type</h3>
            <div class="card_block">
                <div class="section_card">
                    <h4>Ajax Table ( Recommended )</h4>
                    <p>
                        Use this settings if you have lots of data and don't need cell merge features. It will load your data over ajax
                    </p>
                </div>
                <div class="section_card">
                    <h4>Legacy Table</h4>
                    <div>
                        Use this table if you have small amount of data and need the following features
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
        <button @click="storeSettings()">Update Settings</button>
        <label>
            <input type="radio" value="legacy_table" v-model="tableSettings.render_type" />
             Legacy Table
        </label>
        <label>
            <input type="radio" value="ajax_table" v-model="tableSettings.render_type" />
            Ajax Table
        </label>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'advanced_settings',
        props: ['config'],
        data() {
            return {
                doingAjax: false,
                tableId: this.$route.params.table_id,
                tableSettings: this.config.settings,
            }
        },
        methods: {
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
            if(!this.tableSettings.render_type) {
                this.tableSettings.render_type = 'ajax_table';
            }
        }
    }
</script>