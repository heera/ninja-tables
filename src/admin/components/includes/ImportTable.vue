<template>
    <div>
        <div class="ninja_modal-body">
            <h3>Import Table</h3>

            <p class="ninja_subtitle">
                Import table from existing CSV or JSON file.
            </p>

            <div class="form">
                <!--Import data-->
                <div class="form-group">
                    <template v-if="imports.source === 'file'">
                        <label for="fileUpload">{{ $t('Select file:') }}</label>
                        <br>
                        <input type="file" id="fileUpload" @click="clear">
                    </template>

                    <template v-else-if="imports.source === 'url'">
                        File upload url
                    </template>

                    <template v-else>
                        <label>{{ $t('Import data:') }}</label>
                        <textarea rows="10"></textarea>
                    </template>
                </div>

                <!--Import format-->
                <div class="form-group">
                    <label for="import_format">{{ $t('Import Format:') }}</label>

                    <select id="import_format" v-model="imports.format" class="form-control">
                        <option :value="format"
                                v-for="(option, format) in imports.formatOptions"
                        >{{ $t(option) }}
                        </option>
                    </select>

                    <p v-show="imports.format === 'csv'" class="hint">
                        Check tutorial for importing data from CSV file

                        <a href="https://wpmanageninja.com/docs/ninja-tables/import-table-data-from-csv/?utm_source=ninja-tables"
                           target="_blank"
                        >here</a>
                    </p>

                    <p v-show="imports.format === 'json' || imports.format === 'ninjaJson'" class="hint">
                        Check tutorial for importing Table from JSON file

                        <a href="https://wpmanageninja.com/docs/ninja-tables/import-table-data-from-csv/?utm_source=ninja-tables"
                           target="_blank"
                        >here</a>
                    </p>
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <el-button
                size="small"
                type="primary"
                :loading="btnLoading"
                @click="importTable"
            >
                {{ $t('Import') }}
            </el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ImportTable",
        data() {
            return {
                imports: {
                    source: 'file',
                    sourceOptions: ['file'],
                    formatOptions: {
                        'csv': this.$t('CSV - Comma-separated values'),
                        'json': this.$t('JSON - JavaScript Object Notation'),
                        'ninjaJson': this.$t('JSON - Exported From Ninja Tables'),
                    },
                    format: 'csv'
                },
                btnLoading: false
            }
        },
        methods: {
            clear() {
                jQuery('#fileUpload').val('');
            },
            importTable() {
                this.btnLoading = true;

                // For now only execute when the import source is `file`
                if (this.imports.source !== 'file') {
                    this.btnLoading = true;
                    return;
                }

                let file = jQuery('#fileUpload')[0].files[0];

                if (!file) {
                    this.btnLoading = false;
                    return;
                }

                let formData = new FormData();

                formData.append('format', this.imports.format);
                formData.append('file', file);
                formData.append('action', 'ninja_tables_ajax_actions');
                formData.append('target_action', 'import-table');

                jQuery.ajax({
                    url: ajaxurl,
                    data: formData,
                    type: 'POST',
                    contentType: false,
                    processData: false,
                    success: (response) => {
                        alert(response.message);

                        this.$router.push({
                            name: 'data_items',
                            params: {table_id: response.tableId}
                        });
                    },
                    error: (error) => {
                        this.btnLoading = false;

                        alert(error.responseJSON.message);
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .hint {
        width: 100%;
        background-color: #f4f4f5;
        color: #909399;
        padding: 8px 16px;
    }
</style>
