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
        </el-collapse>
    </div>
</template>

<script>
    import WPPosts from '../includes/WPPosts';
    export default {
        name: "WPPostsNav",
        components: { WPPosts },
        props: {
            config: {
                type: Object
            },
            tableCreated: {
                type: Function
            },
            isEditableMessage: {
                required: true,
            }
        },
        data() {
            return {
                // ...
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
