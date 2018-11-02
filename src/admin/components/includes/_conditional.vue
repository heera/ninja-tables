<template>
	<div class="column-condition-config">
		<el-row>
			<el-col>
				<el-col :sm="20" :md="20">
					<el-alert
						:closable=false
						title="Note:"
					    type="info"
					    show-icon>
					    You can add conditions for the column here. To add conditions, just click the <b>Add Condition</b> button and then set the rules for the condition when it will be applied.
					</el-alert>
		        </el-col>

            	<el-button
		            size="medium"
		            type="primary"
		            @click="addCondition"
	            >Add Condition</el-button>

	        </el-col>
		</el-row>
		<hr>
		<el-row v-for="(condition, index) in column.conditions" :key="index">
	        <el-col :sm="2" :md="2">
	            <div class="if-cell-value">If Cell Value</div>
	        </el-col>

	        <el-col :sm="4" :md="4">
	            <el-select size="small" v-model="condition.conditionalOperator">

	                <el-option label="Equal" value="equal"></el-option>
	                <el-option label="Not Equal" value="not-equal"></el-option>
	                
	                <el-option
		                v-if="['number', 'date'].indexOf(column.data_type) == -1"
		                label="Contains"
		                value="contains"
	                ></el-option>

	                <el-option
		                v-if="['number', 'date'].indexOf(column.data_type) == -1"
		                label="Does Not Contain"
		                value="does-not-contain"
	                ></el-option>

	                <el-option
		               v-if="['number', 'date'].indexOf(column.data_type) != -1"
		                label="Less Than"
		                value="less-than"
	                ></el-option>

	                <el-option
		               v-if="['number', 'date'].indexOf(column.data_type) != -1"
		                label="Greater Than"
		                value="greater-than"
	                ></el-option>

	                <el-option
		               v-if="['number', 'date'].indexOf(column.data_type) != -1"
		                label="Less Than Or Equal To"
		                value="less-than-or-equal-to"
	                ></el-option>

	                <el-option
		                v-if="['number', 'date'].indexOf(column.data_type) != -1"
		                label="Greater Than Or Equal To"
		                value="greater-than-or-equal-to"
	                ></el-option>

	                <el-option
		                v-if="['number', 'date'].indexOf(column.data_type) != -1"
		                label="Between (Min & Max Values)"
		                value="between"
	                ></el-option>

	            </el-select>
	        </el-col>

	        <el-col :sm="4" :md="4">
	            <el-input
		            size="small"
		            :placeholder="condition.conditionalOperator == 'between' ? 'Min value' : 'Enter Value'"
		            v-model="condition.conditionalValue"
	            ></el-input>
	        </el-col>

	        <el-col :sm="4" :md="4" v-if="condition.conditionalOperator == 'between'">
	            <el-input
		            size="small"
		            placeholder="Max Value"
		            v-model="condition.conditionalValue2"
	            ></el-input>
	        </el-col>

	        <el-col :sm="1" :md="1">
	            <div class="if-cell-value text-center">Then</div>
	        </el-col>

	        <el-col :sm="4" :md="4">
	            <el-select size="small" v-model="condition.targetAction">
	                <el-option label="Set cell content" value="set-cell-content"></el-option>
	                <el-option label="Set cell color" value="set-cell-color"></el-option>
	                <el-option label="Reset cell color to default" value="reset-cell-color-to-default"></el-option>
	                <el-option label="Set cell CSS class" value="set-cell-css-class"></el-option>
	                <el-option label="Remove cell CSS class" value="remove-cell-css-class"></el-option>
	                <el-option label="Set row color" value="set-row-color"></el-option>
	                <el-option label="Reset row color to default" value="reset-row-color-to-default"></el-option>
	                <el-option label="Set row CSS class" value="set-row-css-class"></el-option>
	                <el-option label="Remove row CSS class" value="remove-row-css-class"></el-option>
	                <el-option label="Set column color" value="set-column-color"></el-option>
	                <el-option label="Add column CSS class" value="add-column-css-class"></el-option>
	            </el-select>
	        </el-col>

	        <el-col :sm="4" :md="4">
	            <el-input
		            size="small"
		            placeholder="Enter Value"
		            v-model="condition.targetValue"
		            v-show="!shouldShowColorPicker(condition)"
	            ></el-input>
				
	            <div class="conditional_color_block" v-show="shouldShowColorPicker(condition)">
                    <ninja-color-picker
                        size="mini"
                        v-model="condition.targetValueColor"
                    ></ninja-color-picker>
                </div>
	        </el-col>

	        <el-col :sm="2" :md="2">
	            <el-button
		            size="mini"
		            type="danger"
		            icon="el-icon-minus"
		            @click="removeCondition(index)"
	            ></el-button>
	        </el-col>
	    </el-row>

	    <el-row v-if="!column.conditions.length">
	    	<el-alert
	    		center
	    		:closable=false
				title="You didn't add any conditions for this colimn yet!"
			    type="info"></el-alert>
	    </el-row>
	</div>
</template>

<script>
	import NinjaColorPicker from '../Extras/ColorPicker';
	export default {
		name: "Conditional",
		props: ['column'],
		components: {
			NinjaColorPicker,
		},
		data() {
			return {
				defaultCondition: {
					conditionalOperator: null,
					conditionalValue: null,
					conditionalValue2: null,
					targetAction: null,
					targetValue: null,
					targetValueColor: null,
				},
			};
		},
		methods: {
			addCondition() {
				this.column.conditions.push({...this.defaultCondition});
			},
			removeCondition(index) {
				this.column.conditions.splice(index, 1);
			},
			shouldShowColorPicker(condition) {
				return [
					'set-cell-color',
					'set-row-color',
					'set-column-color'
				].indexOf(condition.targetAction) != -1;
			},
		},
		created() {
			if (!this.column.conditions) {
				this.$set(this.column, 'conditions', []);
			}
		}
	}	
</script>

<style lang="scss">
	.column-condition-config {
		.el-row{
			display: flex;
			margin-bottom: 5px;
		}
		.el-col {
			margin: 0 5px;
			display: flex;
			.conditional_color_block{
				width: 100%;
                .el-color-picker__trigger{
                    width: 100%;
                    height: 33px;
                }
			}
		}
		.el-col:first-child > .if-cell-value{
			white-space: nowrap;
			/*text-transform: uppercase;*/
		}
		.if-cell-value {
			margin-top: 10px;
			font-weight: 400;
		}
		.form_group {
			margin:0;
			height: 35px;
		}
		.el-color-picker {
			width: 100% !important;
		}

		.el-button--mini {
		    padding: 5px 13px;
		}
	}
</style>
