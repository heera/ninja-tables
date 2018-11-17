<template>
    <div class="wp_posts_dynamic_field">
        <h4>{{ $t('Dynamic Post Data Settings') }}</h4>
        <hr />
        <template v-if="column.source_type == 'custom'">
            <el-form-item>
                <template slot="label">
                    {{ $t("Field Type") }}
                    <el-tooltip class="item" placement="bottom-start" effect="light">
                        <div slot="content">
                            <h3>Field Type</h3>

                            <p>You can use ...</p>
                        </div>

                        <i class="el-icon-info el-text-info" />
                    </el-tooltip>
                </template>
                <el-select
                        v-model="column.wp_post_custom_data_type"
                        placeholder="Select Field"
                        size="small"
                >
                    <el-option
                            v-for="type in post_data_types"
                            :value="type.key"
                            :key="type.key"
                    >{{ type.label }}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <template slot="label">
                    {{ $t("Field Value") }}
                    <el-tooltip class="item" placement="bottom-start" effect="light">
                        <div slot="content">
                            <h3>Field Value</h3>
                        </div>

                        <i class="el-icon-info el-text-info" />
                    </el-tooltip>
                </template>
                <el-input
                        placeholder="Enter Value"
                        size="small"
                        v-model="column.wp_post_custom_data_value"
                >
                </el-input>
            </el-form-item>
        </template>
        <template v-else-if="column.source_type == 'post_data'">
            <el-form-item>
                <template slot="label">
                    {{ $t("Link") }}
                    <el-tooltip class="item" placement="bottom-start" effect="light">
                        <div slot="content">
                            <h3>Link to Post/Author Permalink</h3>
                            <p>
                                Enable this if you want to link to post/Author permalink
                            </p>
                        </div>
                        <i class="el-icon-info el-text-info" />
                    </el-tooltip>
                </template>
                <el-checkbox v-if="column.original_name == 'post_author'" v-model="column.permalinked" true-label="yes" false-label="no" value="yes" label="Link to Author Permalink"></el-checkbox>
                <el-checkbox v-else="column.original_name != 'post_author'" v-model="column.permalinked" true-label="yes" false-label="no" value="yes" label="Link to post permalink"></el-checkbox>
            </el-form-item>
            <template v-if="column.permalinked == 'yes'">
                <el-form-item v-if="column.original_name == 'post_author'">
                    <template slot="label">
                        {{ $t("Permalink Action") }}
                        <el-tooltip class="item" placement="bottom-start" effect="light">
                            <div slot="content">
                                <h3>Permalink Action Type</h3>
                                <p>
                                    Enable this if you want to make the author as table filter action. So when user click on those filters then they will see only the selected author posts.
                                </p>
                            </div>
                            <i class="el-icon-info el-text-info" />
                        </el-tooltip>
                    </template>
                    <el-checkbox v-model="column.filter_permalinked" true-label="yes" false-label="no" value="yes" label="Make Taxonomies as Table Filter"></el-checkbox>
                </el-form-item>
                <el-form-item v-if="column.filter_permalinked != 'yes'">
                    <template slot="label">
                        {{ $t("Open Link To New tab") }}
                        <el-tooltip class="item" placement="bottom-start" effect="light">
                            <div slot="content">
                                <h3>Open Link To New tab</h3>
                                <p>
                                    Enable this if you want to open the links to new tab
                                </p>
                            </div>
                            <i class="el-icon-info el-text-info" />
                        </el-tooltip>
                    </template>
                    <el-checkbox v-model="column.permalink_target" true-label="_blank" false-label="" value="_blank" label="Open link to new tab"></el-checkbox>
                </el-form-item>
            </template>
        </template>
        <template v-else-if="column.source_type == 'tax_data'">
            <el-form-item>
                <template slot="label">
                    {{ $t("Link") }}
                    <el-tooltip class="item" placement="bottom-start" effect="light">
                        <div slot="content">
                            <h3>Link to Taxonomy Permalink</h3>
                            <p>
                                Enable this if you want to link to Taxonomy permalink
                            </p>
                        </div>
                        <i class="el-icon-info el-text-info" />
                    </el-tooltip>
                </template>
                <el-checkbox v-model="column.permalinked" true-label="yes" false-label="no" value="yes" label="Link to Taxonomy"></el-checkbox>
            </el-form-item>
            <el-form-item>
                <template slot="label">
                    {{ $t("Taxonomy Separator") }}
                    <el-tooltip class="item" placement="bottom-start" effect="light">
                        <div slot="content">
                            <h3>Taxonomy Separator</h3>
                            <p>Taxonomy Separator for Multiple Items</p>
                        </div>

                        <i class="el-icon-info el-text-info" />
                    </el-tooltip>
                </template>
                <el-input
                        placeholder="Enter Value"
                        size="small"
                        v-model="column.taxonomy_separator"
                >
                </el-input>
            </el-form-item>
            <template v-if="column.permalinked == 'yes'">
                <el-form-item>
                    <template slot="label">
                        {{ $t("Permalink Action") }}
                        <el-tooltip class="item" placement="bottom-start" effect="light">
                            <div slot="content">
                                <h3>Permalink Action Type</h3>
                                <p>
                                    Enable this if you want to make the taxonomies as table filter action. So when user click on those filters then they will see only those type of posts.
                                </p>
                            </div>
                            <i class="el-icon-info el-text-info" />
                        </el-tooltip>
                    </template>
                    <el-checkbox v-model="column.filter_permalinked" true-label="yes" false-label="" value="yes" label="Make Taxonomies as Table Filter"></el-checkbox>
                </el-form-item>
                <el-form-item v-if="column.filter_permalinked != 'yes'">
                    <template slot="label">
                        {{ $t("Open Link To New tab") }}
                        <el-tooltip class="item" placement="bottom-start" effect="light">
                            <div slot="content">
                                <h3>Open Link To New tab</h3>
                                <p>
                                    Enable this if you want to open the links to new tab
                                </p>
                            </div>
                            <i class="el-icon-info el-text-info" />
                        </el-tooltip>
                    </template>
                    <el-checkbox v-model="column.permalink_target" true-label="_blank" false-label="" value="_blank" label="Open link to new tab"></el-checkbox>
                </el-form-item>
            </template>
        </template>
    </div>
</template>

<script>
    export default {
        name: "WPPostDYnamicColumn",
        props: ['column'],
        data() {
            return {
                post_data_types: [
                    {
                        key: 'acf_field',
                        label: 'ACF Field',
                        instruction: ''
                    },
                    {
                        key: 'post_meta',
                        label: 'Post Meta',
                        instruction: ''
                    },
                    {
                        key: 'shortcode',
                        label: 'Shortcode',
                        instruction: ''
                    }
                ]
            };
        }
    };
</script>

<style lang="scss">
    .wp_posts_dynamic_field {

    }
</style>
