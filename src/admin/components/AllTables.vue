<template>
    <div>
        <div class="row">
            <h1 class="wp-heading-inline">{{ $t('All Tables') }}</h1>
            <div style="margin-top:10px" class="pull-right">
                <label class="form_group search_action" for="search">
                    <input v-on:keyup.enter="getData" id="search" class="form-control inline" v-model="searchString" placeholder="Search"  type="text"/>
                    <i @click="getData" class="el-icon-search"></i>
                </label>
                <a href="#" class="btn btn-primary btn-sm" @click="modalVisible = !modalVisible">
                    <span class="">{{ $t('Add Table') }}</span>
                </a>
                <a href="#tools" class="btn btn-danger btn-sm">
                    <span class="">{{ $t('Import from CSV') }}</span>
                </a>
            </div>
        </div>
        <hr />
        <list-all-tables :searchString="searchString" :searchAction="searchAction"></list-all-tables>
        <add-table-modal @table_inserted="addTableAction" @modal_close="modalVisible = false" :modal_visible.sync="modalVisible"></add-table-modal>
        <br/>
        <fluentpromoad dismisable="1"></fluentpromoad>
    </div>
</template>

<script type="text/babel">
    const ListAllTables = require('./_ListAllTables.vue');
    const AddTableModal = require('./_AddTable.vue');
   
    import FluentPromoAdd from './Extras/FluentPromoAdd.vue';
    
    export default {
        name: 'all_tables',
        components: {
            'list-all-tables' : ListAllTables,
            'add-table-modal': AddTableModal,
           'fluentpromoad': FluentPromoAdd
        },
        data() {
            return {
                modalVisible: false,
                name: 'Jewel',
                searchAction: 0,
                searchString: ''
            }
        },
        methods: {
            addTableAction(tableId) {
                this.$router.push({ name: 'data_columns', params: { table_id: tableId } });
                this.modalVisible = false;
            },

            getData() {
                this.searchAction++;
            }
        },
        mounted: function () {

        },
        beforeMount() {
            this.$options.components['home-extra'] =  (resolve, reject) => {
                // Pass the component definition to the resolve callback
                jQuery.get(ajaxurl, {  action: 'ninja_tables_ajax_actions', target_action: 'get-dynamic-obj', name: this.name  })
                    .done((res) => {
                        resolve(JSON.parse(res))
                    })
                    .fail((error) => {
                        console.log(error);
                    });
            };
        }
    }
</script>

<style lang="scss">
    label.form_group.search_action {
        padding-top: 0;
    }
</style>
