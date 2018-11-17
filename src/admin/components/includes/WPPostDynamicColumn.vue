<template>
    <div v-if="column.source_type == 'custom'" class="wp_posts_dynamic_field">
        <h4>{{ $t('Dynamic Post Data Settings') }}</h4>
        <hr />
        <el-form-item>
            <template slot="label">
                {{ $t("Dynamic Field") }}
                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>Dynamic Field</h3>

                        <p>You can use ...</p>
                    </div>

                    <i class="el-icon-info el-text-info" />
                </el-tooltip>
            </template>
            <el-input
                placeholder="Enter Value"
                v-model="column.wp_post.field.value"
                class="input-with-select"
                >
                    <el-select
                        v-model="column.wp_post.field.name"
                        slot="prepend"
                        placeholder="Select Field"
                        >
                            <el-option
                                v-for="type in column.wp_post.field_types"
                                :value="type.key"
                                :key="type.key"
                            >{{ type.label }}</el-option>
                    </el-select>
            </el-input>
        </el-form-item>
    </div>
</template>

<script>
    export default {
        name: "WPPostDYnamicColumn",
        props: ['column'],
        data() {
            return {
                // ...
            };
        }
    };
</script>

<style lang="scss">
    .wp_posts_dynamic_field {
        .el-select,.el-input__inner {
            width: 170px !important;
        }
        .input-with-select .el-input-group__prepend {
            background-color: #fff;
        }
        .el-input-group__prepend .el-select {
            display: inline-block;
            margin: -10px -21px;
        }
    }
</style>
