<template>
    <table class="ninja_filter_table">
        <thead>
            <tr>
                <th>Label</th>
                <th>Filter Value</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(filter, index) in value">
                <td>
                    <el-input size="mini" v-model="filter.label" type="text"></el-input>
                </td>
                <td>
                    <el-input size="mini" v-model="filter.value" type="text"></el-input>
                </td>
                <td>
                    <el-button :disabled="value.length == 1" @click="deleteItem(index)" type="danger" size="mini">-</el-button>
                    <el-button @click="add()" v-show="(index + 1) == value.length" type="success" size="mini">+</el-button>
                </td>
            </tr>
        </tbody>
    </table>
</template>
<script type="text/babel">
    export default {
        name: 'ninja_key_pair_options',
        props: ['value'],
        data() {
            return {
                filterArray: []
            }
        },
        methods: {
            deleteItem(index) {
                this.value.splice(index, 1);
            },
            add() {
                this.value.push({
                    label: '',
                    value: ''
                });
            }
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    table.ninja_filter_table {
        width: 100%;
        text-align: left;
        border-collapse: collapse;
        tr, td, th {
            border: 1px solid #eaeaea;
            padding: 2px 10px;
        }
    }
</style>