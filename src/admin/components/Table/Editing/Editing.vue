<template>
    <div class="table_editing">
        <div v-if="!config.table.isEditable">
            <h3>This table can not be editable on frontend</h3>
            <p>Only "Default" data source tables can be editable</p>
        </div>
        <div class="el-main-editing" v-else>
            <div class="ninja_header_editing">
                <h2 class="">
                    Frontend Editing Settings
                </h2>
                <div class="heading_actions">
                    <el-button @click="updateSettings()" size="small" type="success">Update Settings</el-button>
                </div>
            </div>
            <div class="editing_body">

                <div class="editing_sub_section">
                    <el-checkbox true-label="yes" false-label="no" v-model="settings.allow_frontend">
                        Enable Frontend editing
                    </el-checkbox>
                </div>

                <template v-if="settings.allow_frontend == 'yes'">
                    <div class="editing_sub_section">
                        <div class="ninja_section_block_header">
                            <h3>Data Editing Permissions</h3>
                            <p>
                                Please specific user roles to be able to edit/delete this table. Only selected user
                                roles
                                can edit/delete the data.
                            </p>
                        </div>
                        <div class="form_row_full">
                            <div class="form_group form_row_half">
                                <label>User Roles for Edit/Add Table Rows</label>
                                <el-checkbox-group v-model="settings.user_roles_editing">
                                    <el-checkbox v-for="(role, role_key) in user_roles" :label="role_key"
                                                 :key="role_key">
                                        {{role}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                            <div class="form_group form_row_half">
                                <label>User Roles for Deleting Table Rows</label>
                                <el-checkbox-group v-model="settings.user_roles_deleting">
                                    <el-checkbox v-for="(role, role_key) in user_roles" :label="role_key"
                                                 :key="role_key">
                                        {{role}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Own Data Only</label>
                            <div class="form-group">
                                <el-checkbox true-label="yes" false-label="no" v-model="settings.own_data_only">
                                    Users can see and edit/delete only own data
                                </el-checkbox>
                            </div>
                        </div>
                    </div>
                    <div class="editing_sub_section">
                        <div class="ninja_section_block_header">
                            <h3>Editing Column Options</h3>
                            <p>
                                Please Specify which columns can be editable from front-end and also, You can specify
                                which
                                columns will be required
                            </p>
                        </div>

                        <div class="ninja_editing_pref">
                            <table class="wp-list-table ninja_editing_table widefat fixed striped">
                                <thead>
                                <tr>
                                    <th>Column Name</th>
                                    <th>Editable?</th>
                                    <th>Required?</th>
                                    <th>Default Value</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="column in columns" :key="column.key">
                                    <th>{{ column.name }}</th>
                                    <td>
                                        <el-switch active-value="yes" inactive-value="no"
                                                   v-model="editing_items[column.key]"></el-switch>
                                    </td>
                                    <td>
                                        <el-switch active-value="yes" inactive-value="no"
                                                   v-model="required_items[column.key]"></el-switch>
                                    </td>
                                    <td>
                                        <el-input :placeholder="'Default Value for '+column.name" size="mini"
                                                  v-model="default_values[column.key]"></el-input>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </template>

                <div style="text-align: right" class="form_group">
                    <el-button @click="updateSettings()" size="small" type="success">Update Settings</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'frontend-editing-settings',
        props: ['config'],
        data() {
            return {
                fetching: false,
                saving: false,
                tableId: this.config.table.ID,
                columns: this.config.columns,
                settings: {
                    allow_frontend: 'no',
                    user_roles_editing: [],
                    user_roles_deleting: [],
                },
                user_roles: {},
                editing_items: {},
                required_items: {},
                default_values: {}
            }
        },
        methods: {
            getEditSettings() {
                this.fetching = true;
                this.$get({
                    action: 'ninja_table_pro_get_editing_settings',
                    table_id: this.tableId
                })
                    .then(response => {
                        this.settings = response.data.settings;
                        this.user_roles = response.data.user_roles;
                        this.editing_items = response.data.editor_pref.editing_items;
                        this.required_items = response.data.editor_pref.required_items;
                        this.default_values = response.data.editor_pref.default_values;
                    })
                    .fail(error => {

                    })
                    .always(() => {
                        this.fetching = false;
                    });
            },
            updateSettings() {
                this.saving = true;
                const data = {
                    action: 'ninja_table_pro_update_editing_settings',
                    table_id: this.tableId,
                    settings: this.settings,
                    editing_items: this.editing_items,
                    required_items: this.required_items,
                    default_values: this.default_values
                };
                this.$post(data)
                    .then(response => {
                        this.$message({
                            type: 'success',
                            message: response.data.message
                        });
                    })
                    .fail(error => {
                        this.$message({
                            type: 'error',
                            message: 'Something is wrong! Please try again'
                        });
                    })
                    .always(() => {
                        this.saving = false;
                    });
            }
        },
        mounted() {
            this.getEditSettings();
        }
    }
</script>
