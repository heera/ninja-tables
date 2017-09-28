<template>
    <div>
        <div v-if="columns.length">
            <form action="" id="fileUploadForm" class="mb20">
                <div class="form-group">
                    <input type="file" id="fileUpload" @click="clear">

                    <button type="submit" class="btn btn-primary btn-flex btn-sm" @click.prevent="upload">
                        {{ $t('Upload CSV') }}
                        <i v-if="btnLoading" class="fooicon fooicon-spin fooicon-circle-o-notch"></i>
                    </button>
                </div>
            </form>

            <h3>
                {{ $t('CSV Header Structure') }}

                <button type="button" class="btn btn-primary btn-sm"
                        style="float: right"
                        @click="download">
                    {{ $t('Download Sample CSV') }}
                </button>
            </h3>

            <el-table :data="sampleData" style="width: 100%" stripe>
                <el-table-column v-for="column in columns"
                                 :prop="column.key"
                                 :label="column.key"
                                 :key="column.key"
                ></el-table-column>
            </el-table>
        </div>
        <div v-else="" class="error">
            <p>{{ $t('Please set table configuration first.') }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'CsvUpload',
        props: ['config', 'tableId'],
        data() {
            return {
                btnLoading: false,
            }
        },
        computed: {
            columns() {
                return this.config && this.config.columns ? this.config.columns : [];
            },
            sampleData() {
                let row = {};
                _.each(this.columns, item => {
                    row[item.key] = 'column value';
                })

                return Array(3).fill(row);
            }
        },
        methods: {
            clear() {
                jQuery('#fileUpload').val('');
            },
            upload() {
                var that = this;

                that.btnLoading = true;

                var file = jQuery('#fileUpload')[0].files[0];

                if (! file) {
                    that.btnLoading = false;
                    return;
                }

                var formData = new FormData();

                formData.append('file', file);
                formData.append('action', 'ninja_tables_ajax_actions');
                formData.append('target_action', 'upload-data');
                formData.append('table_id', this.tableId);

                jQuery.ajax({
                    url: ajaxurl,
                    data: formData,
                    type: 'POST',
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        that.$emit('csvUploaded');

                        that.clear();

                        that.$message.success(response.message)
                    },
                    error: function(error) {
                        that.$message.error(error.responseJSON.message)
                    }
                })
                    .always(function () {
                        that.btnLoading = false;
                    });
            },
            download: function () {
                var rows = [1, 2];

                var samples = [];

                var headers = this.config.columns.map(item => {
                    return item.key;
                });

                samples.push(headers);

                rows.forEach(function (row, rowIndex) {
                    var item = [];

                    headers.forEach(function (header, headerIndex) {
                        item.push('content_' + rowIndex + '_' + headerIndex);
                    })

                    samples.push(item);
                })

                var csv = "data:text/csv;charset=utf-8,";

                samples.forEach(function(item, index){
                    var dataString = item.join(",");
                    csv += index < samples.length ? dataString+ "\n" : dataString;
                });

                var encodedUri = encodeURI(csv);

                var link = document.createElement("a");

                link.setAttribute("href", encodedUri);

                link.setAttribute("download", "sample.csv");

                document.body.appendChild(link);

                link.click();
            }
        }
    }
</script>

<style scoped>
    #fileUpload {
        max-width: 200px;
    }
</style>