<template>
    <div>
        <div class="ninja_modal-body">

            <template v-if="type == 'google-csv'">
                <h3>
                    Construct Table from Google Sheets
                </h3>
                <p class="ninja_subtitle">
                    Whenever your Google Sheets data changes it will be automatically reflected here. You won't have to do a thing.
                </p>
            </template>
            <template v-if="type == 'csv'">
                <h3>
                    Construct Table from Remote CSV File
                </h3>
                <p class="ninja_subtitle">
                    Whenever your remote CSV data changes it will be synced here automatically.
                </p>
            </template>

            <div class="form-group">
                <label for="name">{{ $t('Table Title') }}</label>
                <input v-model="table.post_title"
                       type="text" 
                       id="name" 
                       class="form-control"
                       placeholder="Enter a title to identify your table"
                       :disabled="!hasPro"
                >
            </div>

            <div class="form-group">
                <label for="remote_url">{{ $t('Data Source URL') }}</label>
                <input v-model="table.remote_url"
                       id="remote_url" 
                       type="text" 
                       class="form-control"
                       placeholder="Enter your source URL"
                       :disabled="!hasPro"
                />
            </div>
        </div>
        
        <template v-if="!hasPro">
            <premium-notice />
        </template>

        <div class="modal-footer">
            <el-button type="primary" 
                       :loading="btnLoading" 
                       @click="save"
                       :disabled="!hasPro"
            >
                {{ $t('Continue') }}
            </el-button>
        </div>
    </div>
</template>

<script>
    import PremiumNotice from '../includes/PremiumNotice';
    export default {
        name: 'Remote-Data-Source',
        components: {
            PremiumNotice
        },
        props: {
            type: {
                type: String,
                required: true
            },
            tableCreated: {
                type: Function,
                required: true
            },
            hasPro: {
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
