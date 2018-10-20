<template>
	<div>
		<el-steps
        align-center
        :active="activeStep"
        finish-status="success"
        style="margin-bottom: 20px">
            <el-step
            v-for="(stepTitle, key) in steps"
            :title="stepTitle"
            :key="key"
            ></el-step>
        </el-steps>

        <div v-if="activeStep === 0">
            <div class="form-group">
            	<div class="form-group">
                   <label for="name">{{ $t('Title') }}</label>
                   <input type="text" id="name" class="form-control" v-model="table.post_title">
               </div>
               <div class="form-group">
                   <label>{{ $t('Description') }}</label>
                   <wp_editor v-model="table.post_content"></wp_editor>
               </div>
               <input
               type="text"
               class="form-control"
               v-model="table.remote_url"
               placeholder="Enter Remote URL ..." />
           </div>
        </div>

        <div v-if="activeStep === 1">
            <template v-for="(columnValue, columnName) in table.column_mapings">
                <div class="el-input-group">
                    <label style="width:29%;">{{columnName}}</label>
                    <input
                    style="width:70%;display:inline-block;"
                    class="form-control"
                    :placeholder="columnName"
                    v-model="table.column_mapings[columnName]"/>
               </div>
            </template>
        </div>

        <el-button
        :disabled="!activeStep"
        style="margin-top: 12px;"
        @click="prevStep">{{ $t('Prev') }}</el-button>

        <el-button
        type="primary"
        :loading="btnLoading"
        style="margin-top: 12px; float: right;"
        @click="nextStep">{{ activeStep == 0 ? $t('Next') : $t('Save') }}</el-button>
	</div>
</template>

<script>
	import wp_editor from '../../../common/_wp_editor';
	export default {
		name: 'Remote-Data-Source',
		components: { wp_editor },
		props: {
			type: {
				type: String,
				required: true
			},
			steps: {
				type: Array,
				required: true
			}
		},
		data() {
			return {
				activeStep: 0,
				btnLoading: false,
				table: {
					post_title: '',
					post_content: '',
					remote_url: 'https://docs.google.com/spreadsheets/d/1c6SgWh5SgIErKFXbHYeMLtz6LPHHlAWjmXGVPZd7LKk/pub?output=csv',
					column_mapings: null
				}
			}
		},
		methods: {
			prevStep() {
                if (this.activeStep > 0) this.activeStep--;
            },
            nextStep(event) {
            	let promise;
                this.btnLoading = true;
                if (this.activeStep === 0) {
                    promise = jQuery.post(ajaxurl, {
                    	type: this.type,
                        data: this.table,
                        action: 'ninja_tables_ajax_actions',
                        target_action: 'get-external-data-source',
                    })
                    .then(({data}) => {
                        this.activeStep++;
                        this.table.column_mapings = data;
                    });
                } else {
                    promise = jQuery.post(ajaxurl, {
                    	data: this.table,
                    	action: 'ninja_tables_ajax_actions',
                        target_action: 'save-external-data-source',
                    }).then(({data}) => {
                    	console.log(data);
                    });
                }

                promise.fail(error => {
                	let message = '';
                	let messages = error.responseJSON.data.message;
                	for (let key in messages) {
                		message += ' ' + messages[key];
                	}
                	this.$message({showClose: true, message: message, type: 'error'});
                })
                .always(() => this.btnLoading = false);
            },
		}
	};
</script>
