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
                        <li>Get VIP Support for any Issue</li>
                        <li>Lifetime Updates</li>
                        <li>Incremental New Premium Features</li>
                    </ul>
                </div>
                <span slot="footer" class="dialog-footer">
                    <a href="#" class="buy_now_button el-button el-button--danger el-button--mini">Buy Pro Now</a>
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

<style>
    .el-message {
        z-index: 999999 !important;
        top: 5px;
    }
</style>