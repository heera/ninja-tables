<template>
    <div style="margin-top: 15px;">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="Import Data" name="1">
                <import-table :config="config" :tableId="tableId"></import-table>
            </el-collapse-item>

            <el-collapse-item title="Export Data" name="2">
                <export-table :config="config" :tableId="tableId"></export-table>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import ExportTable from './_ExportTable.vue';
    import ImportTable from './_Csv.vue';

    export default {
        name: 'ExportImport',
        components: {
            ExportTable,
            ImportTable
        },
        props: ['config'],
        data() {
            return {
                tableId: this.$route.params.table_id,
                activeNames: ['1']
            }
        },
        methods: {
            handleChange() {

            }
        }
    }
</script>