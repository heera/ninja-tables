<template>
    <div class="ninja_modal-body">
        <h3 v-if="!editing">
            Construct Table from WP Fluent Form Entries
        </h3>

        <template v-if="isFluentFormUpdated">
            <p class="ninja_subtitle" v-if="!editing">
                Prepare your table from your existing WP Fluent Forms submissions. It can be used to easily showcase your form submissions.
            </p>

            <div class="form-group" v-if="!editing">
                <label for="name">{{ $t('Table Title') }}</label>
                <input
                        v-model="post_title"
                        type="text" id="name" class="form-control"
                        placeholder="Enter a title to identify your table"
                >
            </div>

            <div class="form-group" v-if="!editing">
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

            <div v-if="form.id" class="form-group">
                <el-table
                        ref="rowSelectableTable"
                        :data="fields"
                        style="width:100% !important"
                        @selection-change="handleFieldsSelectionChange"
                >
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="name" label="Select Entry Fields"></el-table-column>
                </el-table>
            </div>

            <div class="form-group">
                <el-button
                        size="small"
                        type="primary"
                        :loading="btnLoading"
                        style="margin-top: 12px; float: right;"
                        @click="save">{{ $t('Continue') }}</el-button>
            </div>
        </template>

        <template v-else-if="hasFluentForm">
            <p>To use this feature your WP Fluent Form need to be updated. Please update WP Fluent From from plugins screen</p>
        </template>

        <div v-else class="fluent-form-promo">
            <p>
                <a href="https://wordpress.org/plugins/fluentform" target="_blank">WP Fluent Form</a> is a WordPress Contact Form plugin packed with all the premium features you would need to create
                a responsive, customizable, drag and drop form. Using this module, You can easily show your form entries in Ninja Tables.
            </p>
            <div>
                <el-button v-loading="installing" @click="installFluentFrom" type="success"><span v-if="installing">Installing WP Fluent From...</span><span v-else>Install Fluent Form Now</span></el-button>
                <p v-if="installing">Please wait while installing WP Fluent From</p>
            </div>
            <h4>See the form in action:</h4>
            <br />
            <div style="position: relative;padding-bottom: 56.25%;padding-top: 25px;height: 0;">
                <iframe style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" width="700" height="394" src="https://www.youtube.com/embed/nY5sfzfyDnI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
   </div>
</template>

<script>
    export default {
        name: 'FluentForm',
        props: {
            tableCreated: {
                type: Function,
                required: true
            },
            editing: {
                type: Boolean
            },
            config: {
                type: Object
            }
        },
        data() {
            return {
                installing: false,
                forms: [],
                fields: [],
                btnLoading: false,
                post_title: '',
                form: {
                    id: null,
                    fields: []
                },
                hasFluentForm: !!window.ninja_table_admin.hasFluentForm,
                isFluentFormUpdated: !!window.ninja_table_admin.isFluentFormUpdated,
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

                    if (this.editing) {
                        this.handleFormSelectionChange(
                            this.form.id = this.config.table.fluentFormFormId
                        );

                        this.$nextTick(() => {
                            let selected = this.config.columns.map(c => c.original_name);
                            this.fields.filter(f => selected.indexOf(f.name) != -1).forEach(row => {
                                this.$refs.rowSelectableTable.toggleRowSelection(row);
                            });
                        });

                    }
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
                    form: this.form,
                    table_Id: this.config && this.config.table.ID || null
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
            },
            installFluentFrom() {
                this.installing = true;
                jQuery.post(ajaxurl, {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'install_fluent_form'
                })
                    .then(response => {
                        this.$message.success(response.data.message);
                        if(response.data.redirect_url) {
                            window.location.href = response.data.redirect_url;
                        }
                    })
                    .fail( error => {
                        this.$message.error( error.responseJSON.message );
                    })
                    .always(() => {
                        this.installing = false;
                    });
            }
        },
        created() {
            this.hasFluentForm && this.fetchForms();
        },
    };
</script>

<style lang="scss">
    .fluent-form-promo {
        p {
            font-size: initial;
        }
    }
</style>
