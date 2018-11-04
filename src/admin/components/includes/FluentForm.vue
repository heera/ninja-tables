<template>
    <div v-if="has_FluentForm">
        <div class="form-group">
           <label for="name">{{ $t('Title') }}</label>
           <input type="text" id="name" class="form-control" v-model="post_title">
       </div>

       <div class="form-group">
            <el-select
            filterable
            v-model="form.id"
            style="width:100%"
            placeholder="Select a Form"
            @change="handleFormSelectionChange">
                <el-option
                  v-for="form in forms"
                  :key="form.id"
                  :label="form.title"
                  :value="form.id">
                </el-option>
            </el-select>
       </div>

       <div class="form-group">
            <el-table
            :data="fields"
            style="width:100% !important"
            @selection-change="handleFieldsSelectionChange">
                <el-table-column type="selection" style="width:10% !important"></el-table-column>
                <el-table-column label="Columns" style="width:90% !important">
                    <template slot-scope="scope">{{ scope.row.name }}</template>
                </el-table-column>
            </el-table>
       </div>

       <div class="form-group">
           <el-button
            type="primary"
            size="small"
            :loading="btnLoading"
            style="margin-top: 12px; float: right;"
            @click="save">{{ $t('Save') }}</el-button>
       </div>
   </div>

   <div v-else>
       Intro about FluentForm...
   </div>
</template>

<script>
    export default {
        name: 'FluentForm',
        props: ['tableCreated'],
        props: {
            tableCreated: {
                type: Function,
                required: true
            }
        },
        data() {
            return {
                forms: [],
                fields: [],
                btnLoading: false,
                post_title: '',
                form: {
                    id: null,
                    fields: []
                },
                has_FluentForm: !!window.ninja_table_admin.hasFluentForm,
            };
        },
        methods: {
            fetchForms() {
                jQuery.getJSON(ajaxurl, {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'get-fluentform-forms'
                }).then(res => {
                    this.forms = [];
                    jQuery.each(res.data, (i, form) => {
                        let fields = JSON.parse(form.form_fields).fields
                        .map(field => ({name: field.attributes.name}))
                        .filter(field => !!field.name);

                        this.forms.push({
                            id: form.id,
                            title: form.title,
                            fields: fields
                        });
                    });
                });
            },
            handleFormSelectionChange(val) {
                this.fields = this.forms.find(form => form.id == val).fields;
            },
            handleFieldsSelectionChange(val) {
                this.form.fields = val;
            },
            save() {
                this.btnLoading = true;
                jQuery.post(ajaxurl, {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'set-fluent-form-data-source',
                    post_title: this.post_title,
                    form: this.form
                })
                .then(res => {
                    this.tableCreated(res.data.table_id);
                })
                .fail(error => {
                    let message = '';
                    let messages = error.responseJSON.data.message;
                    for (let key in messages) {
                        message += ' ' + messages[key];
                    }
                    this.$message({showClose: true, message: message, type: 'error'});
                })
                .always(res => this.btnLoading = false);
            }
        },
        created() {
            this.fetchForms();
        },
    };
</script>
