<template>
    <div class="wp-post-conditions">
        <el-row>
            <el-col :md="21">
                <el-alert
                    type="info"
                    title=""
                    :closable="false"
                    description="You can add additional conditions/where clauses here."
                    show-icon>
                </el-alert>
            </el-col>

            <el-col :md="3" style="text-align:right;">
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="small"
                    style="margin-top:4px;"
                    @click="addCondition($event)"
                ></el-button>
            </el-col>
        </el-row>

        <template v-for="(condition, i) in conditions">
            <el-row :gutter="20">
                <el-col :md="7" :sm="7">
                    <el-select
                    v-model="condition.field"
                    placeholder="Select"
                    @change="setOperators($event, condition)">
                        <el-option
                          v-for="field in fields"
                          :key="field.key"
                          :label="field.label"
                          :value="field.key">
                        </el-option>
                    </el-select>
                </el-col>

                <el-col :md="7" :sm="7">
                    <el-select v-model="condition.operator" placeholder="Select">
                        <el-option
                          v-for="operator in condition.operators"
                          :key="operator.key"
                          :label="operator.value"
                          :value="operator.key">
                        </el-option>
                    </el-select>
                </el-col>

                <el-col :md="7" :sm="7">
                    <el-input
                        v-if="!isSelectable(condition) && !isDateField(condition)"
                        placeholder="Value"
                        v-model="condition.value"
                    ></el-input>

                     <el-date-picker
                     popper-class="wp-post-conditions-el-picker"
                     v-else-if="!isSelectable(condition) && isDateField(condition)"
                      type="datetime"
                      placeholder="Pick a date"
                      v-model="condition.value"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      ></el-date-picker>

                    <el-select
                    v-else-if="isSelectable(condition)"
                    multiple
                    v-model="condition.value"
                    placeholder="Select">
                        <el-option
                          v-for="selectable in condition.selectableOptions"
                          :key="selectable.key"
                          :label="selectable.label"
                          :value="selectable.key">
                        </el-option>
                    </el-select>
                </el-col>

                <el-col :md="3" :sm="3" style="text-align:right;">
                    <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="small"
                        style="margin-top:4px;"
                        @click="removeCondition(i, $event)"
                    ></el-button>
                </el-col>
            </el-row>
        </template>
    </div>
</template>

<script>
    export default {
        name: 'WPPostConditions',
        props: ['fields', 'conditions', 'authors', 'allPostTypes', 'postStatuses'],
        data() {
            return {
                default_condition: {
                    field: null,
                    operator: null,
                    value: null,
                    operators: [],
                    selectableOptions: [],
                    is_selectable: 'false',
                },
                operators: [],
                common_operators: [
                    { key: '=', value: 'Equal To' },
                    { key: '!=', value: 'Not Equal To' },
                ],
                uncommon_operators: [
                    { key: 'IN', value: 'In' },
                    { key: 'NOT IN', value: 'Not In' },
                ],
                other_operators: [
                    { key: '>', value: 'Greater Than' },
                    { key: '>=', value: 'Greater Than Or Equal To' },
                    { key: '<', value: 'Less Than' },
                    { key: '<=', value: 'Less Than Or Equal To' },
                ],
            };
        },
        methods: {
            addCondition(event) {
                this.conditions.push({...this.default_condition});
            },
            removeCondition(i, $event) {
                this.conditions.splice(i, 1);
            },
            setOperators(column, condition) {
                const fields = [
                    'ID',
                    'comment_count',
                    'post_date',
                    'post_modified',
                ];

                condition.operators = [...this.common_operators];

                if (column == 'comment_count') {
                    condition.operators.map((operator, i) => {
                        if (operator.key == '!=') {
                            condition.operators.splice(i, 1);
                        }
                    });
                }

                if (fields.indexOf(column) != -1) {
                    condition.operators = [...condition.operators.concat(this.other_operators)];
                } else if (column.indexOf('.') != -1 || ['post_author', 'post_status'].indexOf(column) != -1) {
                    condition.operators = [...this.uncommon_operators];
                }

                this.setValueField(column, condition);
            },
            setValueField(column, condition) {
                if ('post_status' == column) {
                    condition.value = [];
                    condition.is_selectable = 'true';
                    condition.selectableOptions = this.postStatuses;
                } else if ('post_author' == column) {
                    condition.value = [];
                    condition.is_selectable = 'true';
                    condition.selectableOptions = this.authors.map(author => {
                        return { key: author.ID, label: author.display_name };
                    });
                } else if (column.indexOf('.') != -1) {
                    condition.value = [];
                    condition.is_selectable = 'true';
                    let [columnName, taxonomy] = [...column.split('.')];
                    let terms = this.allPostTypes[columnName]['taxonomies'][taxonomy];
                    condition.selectableOptions = terms.map(term => {
                        return { key: term.slug, label: term.name };
                    });
                } else {
                    condition.value = null;
                    condition.is_selectable = 'false';
                    condition.selectableOptions = [];
                }
            },
            isDateField(c) {
                return ['post_date', 'post_modified'].indexOf(c.field) != -1;
            },
            isSelectable(c) {
                return c.is_selectable == 'true';
            }
        },
    };
</script>

<style>
    .el-row {
        margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
    }
    .wp-post-conditions-el-picker {
        z-index:9999 !important;
    }
</style>
