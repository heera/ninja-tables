<template>
	<div>
        <div class="form-group">
            <div class="form-group">
               <label for="name">{{ $t('Title') }}</label>
               <input type="text" id="name" class="form-control" v-model="table.post_title">
           </div>

           <div class="form-group">
               <label for="remote_url">{{ $t('Data Source URL') }}</label>
               <input id="remote_url" type="text" class="form-control" v-model="table.remote_url" />
           </div>
       </div>

        <el-button
        type="primary"
        :loading="btnLoading"
        style="margin-top: 12px; float: right;"
        @click="save">{{ $t('Save') }}</el-button>
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
					remote_url: 'https://docs.google.com/spreadsheets/d/1c6SgWh5SgIErKFXbHYeMLtz6LPHHlAWjmXGVPZd7LKk/pub?output=csv',
					column_mapings: null
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
