<template>
    <div class="privacy">
        <div class="ninja_header">
            <h2>Permission <span v-show="!hasPro">(Pro Feature)</span></h2>
            <p>By default, Only Administrator have access to manage the tables. By selecting additional roles bellow, You can give access to manage your Tables to other user roles.</p>
        </div>

        <div class="ninja_content">
            <template v-if="hasPro">
                <div class="form-group">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                        Check all
                    </el-checkbox>
                </div>

                <div class="form-group">
                    <el-checkbox-group v-model="capability" @change="handleCheckedCapabilitiesChange">
                        <el-checkbox v-for="role in roles" :label="role.key" :key="role.key">
                            {{ role.name }}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>

                <div class="form-group">
                    <el-button @click="store" type="primary" size="small">Save</el-button>
                </div>
            </template>
            
            <template v-else>
                Activate Ninja Tables Pro Add-on plugin to unlock this feature
                <p>
                    <a target="_blank" :href="upgrade">Buy Ninja Tables Pro Add-On</a>
                </p>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Privacy",
        data() {
            return {
                hasPro: false,
                roles: [],
                checkAll: false,
                capability: ["administrator"],
                isIndeterminate: false,
                upgrade: `https://wpmanageninja.com/downloads/ninja-tables-pro-add-on/?utm_source=ninja-tables&utm_medium=wp&utm_campaign=wp_plugin&utm_term=upgrade`
            };
        },
        methods: {
            get() {
                let data = {
                    action: "ninja_tables_ajax_actions",
                    target_action: 'get_access_roles'
                };
                
                jQuery.get(ajaxurl, data)
                    .then(response => {
                        this.capability = response.capability;
                        this.roles = response.roles;
                        this.handleCheckedCapabilitiesChange(this.capability);
                    })
                    .fail(e => {});
            },
            store() {
                let data = {
                    action: "ninja_tables_set_permission",
                    capability: this.capability
                };
                jQuery
                    .post(ajaxurl, data)
                    .then(response => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: "success"
                        });
                    })
                    .fail(e => {});
            },
            handleCheckAllChange(val) {
                this.capability = val ? this.roles.map(item => item.key) : [];
                this.isIndeterminate = false;
            },
            handleCheckedCapabilitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.roles.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.roles.length;
            }
        },
        mounted() {
            this.hasPro = window.ninja_table_admin.hasPro === "1";
            this.get();
        }
    };
</script>

<style>
    .el-text-info {
        color: #58b7ff;
    }

    .privacy label {
        margin-bottom: initial;
    }

    #capability {
        margin-left: 75px;
    }
</style>


