<template>
    <div class="fluent-form-nav">
        <el-collapse>
            <el-collapse-item name="1">
                <template slot="title">
                    <i class="header-icon el-icon-info el-text-info"></i>
                    <strong>Edit:</strong> {{isEditableMessage}}
                </template>
                <WPPosts :hasPLainLayout="true" :config="config" :tableCreated="tableCreated" />
            </el-collapse-item>

            <el-collapse-item name="2">
                <template slot="title">
                    <i class="header-icon el-icon-info el-text-info"></i>
                    <strong>Add Column</strong> You may add aditional dynamic columns here.
                </template>

                <columns-editor
                    :model="model"
                    :hasPro="hasPro"
                    :hideCancel="true"
                    dataSourceType="wp-posts"
                    @add="addNewColumn()"
                />
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    import WPPosts from '../includes/WPPosts';
    import columnsEditor from '../includes/ColumnsEditor';
    export default {
        name: "WPPostsNav",
        components: { WPPosts, columnsEditor },
        props: {
            config: {
                type: Object
            },
            tableCreated: {
                type: Function
            },
            isEditableMessage: {
                required: true,
            },
            model: {
                type: Object,
            },
            hasPro: {
                type: Boolean
            },
        },
        data() {
            return {
                // ...
            }
        },
        methods: {
            addNewColumn() {
                this.$emit('add');
            }
        }
    }
</script>

<style lang="scss">
    .fluent-form-nav {
        .el-collapse-item__header,
        .el-collapse-item__wrap {
            padding: 0 15px;
        }

        .sync-settings {
            margin-top: 15px;
        }

        .el-collapse-item__content {
            padding-bottom: 15px;
        }
    }
</style>
