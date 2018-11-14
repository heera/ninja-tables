<template>
    <div class="ninja_date_picker">
        <input
                :placeholder="column.dateFormat"
                type="text"
                size="small"
                v-model="new_column[column.key]"
                :id="slugify(column.key)"
                class="form-control"
        >
        <el-date-picker
                type="date"
                size="small"
                v-model="new_column[column.key]"
                :value-format="elementFormat"
                :format="elementFormat"
                placeholder="Pick a day">
        </el-date-picker>
    </div>
</template>

<script type="text/babel">
    export default {
        name: 'ninjaDatePicker',
        props: ['column', 'new_column'],
        computed: {
            elementFormat() {
                let originalFormat  = this.column.dateFormat;
                return originalFormat.replace(/Y/g, 'y').replace(/D/g, 'd');
            }
        },
        methods: {
            slugify(text) {
                return text.toString().toLowerCase()
                    .replace(/\s+/g, '-')           // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                    .replace(/^-+/, '')             // Trim - from start of text
                    .replace(/-+$/, '');            // Trim - from end of text
            },
        },
    }
</script>

<style lang="scss">
    .ninja_date_picker {
        > .form-control {
            width: 90%;
            float: left;
        }
        > .el-date-editor {
            width: 8px !important;
            padding: 0px;
            margin: 0px;
            cursor: pointer;
            .el-input__inner {
                width: 10px !important;
                padding: 15px;
                background: rgb(128, 128, 128);
                height: 34px;
            }
        }
    }
</style>
