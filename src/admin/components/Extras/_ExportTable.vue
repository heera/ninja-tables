<template>
    <div>

        <div class="ninja_header">
            <h2>Export Table</h2>
        </div>
        <div class="ninja_content">

            <div class="ninja_block">
                <p>You can download the table data as CSV or JSON format, If you download as json then you can import the table to any Ninja Table Installation</p>
            </div>
            <hr />
            <div class="ninja_export_block">
                {{ $t('Format:') }}
                <select v-model="selected">
                    <option v-for="(option, key) in exportOptions" :value="key">
                        {{ option }}
                    </option>
                </select>
                <button class="btn btn-sm btn-primary" @click="doExport()">Export</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ExportTable',
        props: ['config'],
        data() {
            return {
                tableId: this.$route.params.table_id,
                exportOptions: {
                    csv : 'CSV',
                    json: 'JSON'
                },
                selected: 'csv'
            }
        },
        methods: {
            downloadLink(format = 'csv') {
                const data = {
                    action: 'ninja_tables_ajax_actions',
                    target_action: 'export-data',
                    table_id: this.tableId,
                    format: format
                };

                return ajaxurl+'?'+jQuery.param(data)
            },
            doExport() {
                let url = this.downloadLink(this.selected);

                console.log(url);

                location.href = url;
            }
        }
    }
</script>