<template>
    <div class="external-source-nav">
        <el-collapse>
            <el-collapse-item name="1">
                <template slot="title">
                    <i class="header-icon el-icon-info el-text-info"></i>
                    Sync
                </template>

                <div v-html="isEditableMessage"></div>

                <div style="margin-top: 15px;">
                    <el-input placeholder="Remote URL..."
                              size="small"
                              v-model="url"
                              v-on:keyup.enter="sync"
                    >
                        <el-button :loading="loading"
                                   @click="sync"
                                   slot="append"
                                   size="small"
                                   type="success"
                                   plain
                        >
                            Sync Settings
                        </el-button>
                    </el-input>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    export default {
        name: "External",
        props: {
            isEditableMessage: {
                required: true,
            },
            loading: {
                required: true
            },
            value: {
                required: true
            }
        },
        data() {
            return {
                state: false,
                url: this.value
            }
        },
        watch: {
            url() {
                this.$emit('input', this.url);
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
    .external-source-nav {
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
