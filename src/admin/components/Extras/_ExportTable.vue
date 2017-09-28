<template>
    <div>
        {{ $t('Format:') }}
        <select v-model="selected">
            <option v-for="(option, key) in exportOptions" :value="key">
                {{ option }}
            </option>
        </select>

        <button class="btn btn-sm btn-primary" @click="doExport()">Export</button>
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