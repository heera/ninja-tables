<template>
    <div>
        <div class="intro">
            <p>
                {{ $t('NinjaTables can import tables from existing data, like from a CSV or JSON file. You can also import existing tables from the other WordPress table plugins.') }}
            </p>
        </div>

        <el-collapse v-model="activeNames">
            <el-collapse-item title="Import Table" name="1">
                <p>
                    Browse and locate a CSV/JSON file you backed up before.
                </p>
                <p>
                    Select the intended format and click <strong>Import</strong> button, we will do
                    the rest for you.
                </p>

                <div class="form">
                    <!--Import data-->
                    <div class="form-item">
                        <template v-if="imports.source == 'file'">
                            <label>{{ $t('Select file:') }}</label>
                            <input type="file" id="fileUpload" @click="clear">
                        </template>
                        <template v-else-if="imports.source == 'url'">
                            File upload url
                        </template>
                        <template v-else>
                            <label>{{ $t('Import data:') }}</label>
                            <textarea rows="10"></textarea>
                        </template>
                    </div>

                    <!--Import format-->
                    <div class="form-item">
                        <label for="import_format">{{ $t('Import Format:') }}</label>
                        <select id="import_format" v-model="imports.format">
                            <option :value="format"
                                    v-for="(option, format) in imports.formatOptions"
                            >{{ $t(option) }}</option>
                        </select>
                    </div>

                    <div class="form-item">
                        <button class="btn btn-primary btn-sm" @click="importTable">
                            {{ $t('Import') }}
                            <i v-if="btnLoading" class="fooicon fooicon-spin fooicon-circle-o-notch"></i>
                        </button>
                    </div>
                </div>
            </el-collapse-item>

            <el-collapse-item title="Import Other Tables" name="2">
                <p>
                    To import from other WordPress plugins click the respective <strong>Import</strong> button.
                </p>
                <table style="min-width: 400px;">
                    <tbody>
                    <tr v-for="plugin in otherPlugins">
                        <td>{{ plugin }}</td>
                        <td>
                            <button class="btn btn-default btn-sm"
                                    @click="importFromOtherPlugin(plugin)"
                            >
                                <template v-if="btnsLoading[plugin]">
                                    {{ $t('Importing...') }}
                                    <i class="fooicon fooicon-spin fooicon-circle-o-notch"></i>
                                </template>
                                <template v-else>
                                    {{ $t('Import') }}
                                </template>
                            </button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    export default {
        name: 'Tools',
        data() {
            return {
                activeNames: [
                    '1',
                    '2'
                ],
                imports: {
                    source: 'file',
                    sourceOptions: ['file'],
                    formatOptions: {
                        'csv' : this.$t('CSV - Comma-separated values'),
                        'json' : this.$t('JSON - JavaScript Object Notation'),
                        'ninjaJson': this.$t('JSON - Exported From Ninja Tables'),
                    },
                    format: 'csv'
                },
                btnLoading: false,
                otherPlugins: [
                    'Table Press'
                ],
                btnsLoading: {
                    'Table Press': false
                }
            }
        },
        methods: {
            clear() {
                jQuery('#fileUpload').val('');
            },
            importTable() {
                this.btnLoading = true;

                // For now only execute when the import source is `file`
                if (! this.imports.source == 'file') {
                    this.btnLoading = true;
                    return;
                }

                var file = jQuery('#fileUpload')[0].files[0];

                if (! file) {
                    this.btnLoading = false;
                    return;
                }

                var formData = new FormData();

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
                            params: { table_id: response.tableId }
                        });
                    },
                    error: (error) => {
                        this.btnLoading = false;
                        alert(error.responseJSON.message);
                    }
                });
            },
            importFromOtherPlugin(plugin) {
                this.btnsLoading[plugin] = true;

                let data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'import-table-from-plugin',
                    plugin
                }

                jQuery.ajax({
                    url: ajaxurl,
                    data: data,
                    type: 'POST',
                    success: (response) => {
                        this.btnsLoading[plugin] = false;
                        this.$message.success(response.message);
                    },
                    error: (error) => {
                        this.btnsLoading[plugin] = false;
                        this.$message.error(error.responseJSON.message);
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .form-item {
        margin: 10px 0;
    }

    .form-item label {
        width: 100px;
    }
</style>