<template>
    <div class="fluent-form-nav">
        <el-collapse>
            <el-collapse-item name="1">
                <template slot="title">
                    <i class="header-icon el-icon-info el-text-info"></i>
                    Sync
                </template>

                <div v-html="isEditableMessage"></div>

                <el-button :loading="loading"
                           @click="sync"
                           class="sync-settings"
                           type="success"
                           size="small"
                           plain
                >
                    Sync Settings
                </el-button>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    export default {
        name: "Fluentform",
        props: {
            isEditableMessage: {
                required: true,
            },
            loading: {
                required: true
            }
        },
        data() {
            return {
                state: false
            }
        },
        methods: {
            sync() {
                this.$emit('sync', true);
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
