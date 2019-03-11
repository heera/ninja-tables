<template>
    <div class="privacy">
        <div class="ninja_header">
            <h2>Global Settings</h2>
        </div>

        <div v-loading="loading" class="ninja_content">
            <div class="ninja_block">
                <h3>Global Javascript Error Handling</h3>
                <el-radio-group class="spaced_new_line" v-model="ninja_suppress_error">
                    <el-radio label="log_silently">Console Log JS Errors Silently (Recommended)</el-radio>
                    <el-radio label="yes">Handle Error But don't Log</el-radio>
                    <el-radio label="no">Don't Handle Global Javascript Errors</el-radio>
                </el-radio-group>
            </div>
            <el-button @click="storeSettings()" size="small" type="success">Update Global Settings</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "GlobalSettings",
        data() {
            return {
                loading: false,
                ninja_suppress_error: 'log_silently'
            };
        },
        methods: {
            getSettings() {
                this.loading = true;

                jQuery.get(ajaxurl,{
                    action: "ninja_tables_ajax_actions",
                    target_action: 'get_global_settings'
                })
                    .then(response => {
                        this.ninja_suppress_error = response.data.ninja_suppress_error;
                    })
                    .fail(error => {})
                    .always(() => {
                        this.loading = false;
                    });
            },
            storeSettings() {
                let data = {
                    action: "ninja_tables_ajax_actions",
                    target_action: 'update_global_settings',
                    suppress_error: this.ninja_suppress_error
                };
                jQuery
                    .post(ajaxurl, data)
                    .then(response => {
                        this.$message({
                            showClose: true,
                            message: response.data.message,
                            type: "success"
                        });
                    })
                    .fail(e => {});
            }
        },
        mounted() {
            this.getSettings();
        }
    };
</script>
