<template>
	<div>
		<el-row v-for="(condition, index) in column.conditions" :key="index">
	        <el-col :sm="2" :md="2">
	            <div class="if-cell-value">If Cell Value</div>
	        </el-col>

	        <el-col :sm="4" :md="4">
	            <el-select size="small" v-model="condition.conditionalOperator">
	                <el-option label="Equal" value="equal"></el-option>
	                <el-option label="Not Equal" value="not-equal"></el-option>
	                <el-option label="Contains" value="contains"></el-option>
	                <el-option label="Does Not Contain" value="does-not-contain"></el-option>
	            </el-select>
	        </el-col>

	        <el-col :sm="4" :md="4">
	            <el-input
		            size="small"
		            placeholder="Please Enter Value"
		            v-model="condition.conditionalValue"
	            ></el-input>
	        </el-col>

	        <el-col :sm="1" :md="1">
	            <div class="if-cell-value text-center">Then</div>
	        </el-col>

	        <el-col :sm="4" :md="4">
	            <el-select size="small" v-model="condition.targetAction">
	                <el-option label="Set cell color" value="set-cell-color"></el-option>
	                <el-option label="Reset cell color to default" value="reset-cell-color-to-default"></el-option>
	                <el-option label="Set cell content" value="set-cell-content"></el-option>
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
		            placeholder="Please Enter Value"
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

	        <el-col :sm="3" :md="3">
	            <el-button
		            size="small"
		            type="primary"
		            icon="el-icon-plus"
		            @click="addCondition"
	            ></el-button>

	            <el-button
		            size="small"
		            type="danger"
		            icon="el-icon-minus"
		            @click="removeCondition(index)"
	            ></el-button>
	        </el-col>
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
				if (this.column.conditions.length > 1) {
					this.column.conditions.splice(index, 1);
				}
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
				this.$set(this.column, 'conditions', [{...this.defaultCondition}]);
			}
		}
	}	
</script>

<style scoped>
	.el-col {
		margin: 0 5px;
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
	
</style>
