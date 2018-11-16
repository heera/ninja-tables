<template>
    <div class="wrap">
        <router-view></router-view>

        <div class="pro_feature_dialog">
            <el-dialog
                    title="NinjaTable Pro Features"
                    :visible.sync="addVisible">
                <div class="add_content">
                    <ul class="list_features">
                        <li>Use Unlimited Colors in Your Tables</li>
                        <li>Add Media to Your Table Cells</li>
                        <li>Drag and Drop Table Data Sorting</li>
                        <li>Use Advanced Date Sorting</li>
                        <li>Colspan/Cell Merging Feature</li>
                        <li>Create Custom Filter UI in Table</li>
                        <li>Use Shortcode in your table cell</li>
                        <li>Use Advanced Data Filtering</li>
                        <li>Use Advanced Customization Features</li>
                        <li>Get VIP Support for any Issue</li>
                        <li>Incremental New Premium Features</li>
                        <li>And Many More feature</li>
                    </ul>
                </div>
                <span slot="footer" class="dialog-footer">
                    <a href="https://wpmanageninja.com/downloads/ninja-tables-pro-add-on/?utm_source=ninja-tables&utm_medium=wp&utm_campaign=wp_plugin&utm_term=upgrade" class="buy_now_button el-button el-button--danger el-button--mini">Buy Pro Now</a>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script type="text/babel">

    export default {
        name: 'TableApp',
        data() {
            return {
                addVisible: false
            }
        },
        mounted() {
            window.ninjaTableBus.$on('show_pro_popup', (val) => {
                this.addVisible = true;
            });
        },
    }

</script>

<style lang="scss">
    .el-message {
        z-index: 999999 !important;
        top: 5px;
    }

    .pro_feature_dialog {
        .el-dialog__wrapper {
            z-index: 10000 !important;
        }
    }
</style>
