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

	        <el-col :sm="4" :md="4" v-model="condition.conditionalValue">
	            <el-input size="small" placeholder="Please Enter Value"></el-input>
	        </el-col>

	        <el-col :sm="1" :md="1">
	            <div class="if-cell-value text-center">Then</div>
	        </el-col>

	        <el-col :sm="4" :md="4">
	            <el-select size="small" v-model="condition.targetAction">
	                <el-option label="Set cell color" value="set-cell-color"></el-option>
	                <el-option label="Reset cell color to default" value="set-cell-color-default"></el-option>
	                <el-option label="Set Cell Content" value="set-cell-content"></el-option>
	                <el-option label="Set Cell CSS Class" value="set-cell-css-class"></el-option>
	                <el-option label="Remove Cell CSS Class" value="remove-cell-css-class"></el-option>
	            </el-select>
	        </el-col>

	        <el-col :sm="4" :md="4">
	            <el-input
		            size="small"
		            placeholder="Please Enter Value"
		            v-model="condition.targetValue"
	            ></el-input>
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
	export default {
		name: "Conditional",
		props: ['column'],
		data() {
			return {
				defaultCondition: {
					conditionalOperator: null,
					conditionalValue: null,
					targetAction: null,
					targetValue: null,
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
</style>
