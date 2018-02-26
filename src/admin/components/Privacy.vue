<template>
    <div class="privacy">
        <div class="ninja_header">
            <h2>Permission <span v-show="!hasPro">(Pro Feature)</span></h2>
            <p>Provide other user roles to manage tables</p>
        </div>

        <div class="ninja_content">
            <template v-if="hasPro">
                <label for="capability">
                    Select Role
                    <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">
                            <h3>Select Role</h3>

                            <p>
                                The users with the selected role(s) will be <br> able to manage Ninja Tables.
                            </p>
                        </div>

                        <i class="el-icon-info el-text-info"></i>
                    </el-tooltip>
                </label>

                <select name="capability" id="capability" v-model="capability">
                    <option v-for="(role, capabilityOption) in roles" :key="capabilityOption" :value="capabilityOption">
                        {{ role }}
                    </option>
                </select>
                <button @click="store" class="btn btn-primary btn-sm">Update</button>
            </template>
            
            <template v-else>
                Activate Ninja Tables Pro Add-on plugin to unlock this feature
                <p><a target="_blank" href="https://wpmanageninja.com/downloads/ninja-tables-pro-add-on/?utm_source=ninja-tables&utm_medium=wp&utm_campaign=wp_plugin&utm_term=upgrade">Buy Ninja Tables Pro Add-On</a></p>
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
                roles: {
                    manage_options: "Administrator",
                    edit_others_posts: "Administrator + Editor",
                    edit_published_posts: "Administrator + Editor + Author",
                    edit_posts: "Administrator + Editor + Author + Contributor"
                },
                capability: "manage_options"
            };
        },
        methods: {
            get() {
                let data = {
                    action: "ninja_tables_get_permission",
                };

                jQuery
                    .get(ajaxurl, data)
                    .then(response => {
                        this.capability = response.capability || 'manage_options'
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


