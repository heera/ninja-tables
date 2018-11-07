<template>
    <div>
        <div class="ninja_modal-body">

            <template v-if="type == 'google-csv'">
                <h3>Connect your table with Google Spreadsheet</h3>
                <p class="ninja_subtitle">In this table type, whenever you update your data on google spreadsheet the data will be updated in your site automatically (within 5 minutes max)</p>
            </template>
            <template v-if="type == 'csv'">
                <h3>Connect your external CSV file as Data Source</h3>
                <p class="ninja_subtitle">In this table type, Your Table data will be linked with provided CSV URL. When you update the data in the origin csv, Your table data will be updated automatically.</p>
            </template>

            <div class="form-group">
                <label for="name">{{ $t('Table Title') }}</label>
                <input type="text" id="name" class="form-control" v-model="table.post_title">
            </div>

            <div class="form-group">
                <label for="remote_url">{{ $t('Data Source URL') }}</label>
                <input id="remote_url" type="text" class="form-control" v-model="table.remote_url"/>
            </div>
        </div>
        <div class="modal-footer">
            <el-button
                    type="primary"
                    size="small"
                    :loading="btnLoading"
                    @click="save">{{ $t('Continue') }}
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Remote-Data-Source',
        props: {
            type: {
                type: String,
                required: true
            },
            tableCreated: {
                type: Function,
                required: true
            }
        },
        data() {
            return {
                table: {
                    post_title: '',
                    remote_url: ''
                },
                btnLoading: false
            }
        },
        methods: {
            save(event) {
                this.btnLoading = true;
                jQuery.post(ajaxurl, {
                    ...this.table,
                    type: this.type,
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'set-external-data-source',
                })
                    .then(({data}) => this.tableCreated(data.table_id))
                    .fail(error => {
                        let message = '';
                        let messages = error.responseJSON.data.message;
                        for (let key in messages) {
                            message += ' ' + messages[key];
                        }
                        this.$message({showClose: true, message: message, type: 'error'});
                    })
                    .always(() => this.btnLoading = false);
            }
        }
    };
</script>
