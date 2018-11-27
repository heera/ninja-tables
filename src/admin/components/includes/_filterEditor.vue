<template>
    <el-form ref="form" :model="activeEditor" label-width="250px" class="form-wrapper">
        <el-form-item>
            <template slot="label">
                {{ $t('Filter Title') }}
                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>Filter Title</h3>
                        <p>Just a Name to identify your Filter</p>
                    </div>
                    <i class="el-icon-info el-text-info"></i>
                </el-tooltip>
            </template>
            <el-input size="small" v-model="activeEditor.title" />
        </el-form-item>

        <el-form-item>
            <template slot="label">
                {{ $t('Filter Instruction') }}
                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>Prefix</h3>
                        <p>This will show on your Table Filter</p>
                    </div>
                    <i class="el-icon-info el-text-info"></i>
                </el-tooltip>
            </template>
            <el-input size="small" v-model="activeEditor.filter_prefix" />
            <small>Keep it blank if you don't need any filter instruction at the frontend</small>
        </el-form-item>

        <el-form-item>
            <template slot="label">
                {{ $t('Filter UI Type') }}
                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>Filter UI</h3>
                        <p>Select the filter type that you want to show the filter in the frontend</p>
                    </div>
                    <i class="el-icon-info el-text-info"></i>
                </el-tooltip>
            </template>
            <el-radio-group v-model="activeEditor.type">
                <el-radio label="radio">Radio</el-radio>
                <el-radio label="select">Select Dropdown</el-radio>
                <el-radio label="checkbox">Checkbox</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item v-if="activeEditor.type == 'radio' || activeEditor.type == 'select'">
            <template slot="label">
                {{ $t('Default Label ( Placeholder )') }}
                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <p>This will show on as default placeholder to reset the label ( Ex: All )</p>
                    </div>
                    <i class="el-icon-info el-text-info"></i>
                </el-tooltip>
            </template>

            <el-input size="small" v-model="activeEditor.placeholder"></el-input>

        </el-form-item>

        <el-form-item>
            <template slot="label">
                {{ $t('Filter Options') }}
                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>Options</h3>
                        <p>Provide the values that you want to show on the frontend. Your values should match your table cell data</p>
                    </div>
                    <i class="el-icon-info el-text-info"></i>
                </el-tooltip>
            </template>

            <key-pair-options v-model="activeEditor.options"></key-pair-options>

        </el-form-item>

        <el-form-item>
            <template slot="label">
                {{ $t('Filter Columns') }}
                <el-tooltip class="item" placement="bottom-start" effect="light">
                    <div slot="content">
                        <h3>Columns</h3>
                        <p>Select the columns that you want to apply this filter</p>
                    </div>
                    <i class="el-icon-info el-text-info"></i>
                </el-tooltip>
            </template>
            <el-checkbox-group v-model="activeEditor.columns">
                <el-checkbox v-for="(columnName, columnKey) in columnKeyPairs" :key="columnKey" :label="columnKey">{{columnName}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>
    </el-form>
</template>

<script type="text/babel">
    import KeyPairOptions from './_key_pair_options'
    export default {
        name: 'FilterEditor',
        components: {
            KeyPairOptions
        },
        props: ['activeEditor', 'columnKeyPairs']
    }
</script>
