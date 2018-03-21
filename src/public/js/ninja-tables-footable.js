jQuery(document).ready(function ($) {
    const ninja_table_app = {
        initTables: function () {
            let footables = $('table.foo-table.ninja_footable');
            let that = this;
            $.each(footables, function (footable, table) {
                let $table = $(table);
                let tableId = $table.data('footable_id');
                let tableConfig = window.ninja_footables.tables['table_'+tableId];
                that.initResponsiveTable($table, tableConfig);
            });
        },
        initResponsiveTable:  function initFooTable($table, tableConfig) {
            
            let tableColumnNames = [];
            jQuery.each(tableConfig.columns, (index, column) => {
                tableColumnNames.push(column.name);
            });
            
            console.log(tableColumnNames);
            
            let initConfig = {
                "cascade": true,
                "columns": tableConfig.columns,
                "rows": $.get(window.ninja_footables.ajax_url+'?action=wp_ajax_ninja_tables_public_action&table_id='+tableConfig.table_id+'&target_action=get-all-data&default_sorting='+tableConfig.settings.default_sorting)
            };
            
            initConfig.sorting = {
                "enabled": !!tableConfig.settings.sorting
            };
            
            let enabledSearch = !!tableConfig.settings.filtering;
            if(tableConfig.settings.defualt_filter) {
                enabledSearch = true;
            }
            initConfig.filtering = {
                "enabled":  enabledSearch,
                "delay": 1,
                "dropdownTitle": ninja_footables.i18n.search_in,
                "placeholder": ninja_footables.i18n.search,
                "connectors": false,
                "ignoreCase": true
            };
            
            if(tableConfig.settings.defualt_filter) {
                initConfig.filtering.filters = [{
                    "name": "ninja_table_custom_filter",
                    "query": tableConfig.settings.defualt_filter,
                    "columns": []
                }];
            }
            
            
            initConfig.paging = {
                "enabled": !!tableConfig.settings.paging,
                "position": "right",
                "size": tableConfig.settings.paging,
                "container": "#footable_parent_"+tableConfig.table_id+" .paging-ui-container"
            };
            initConfig.empty = ninja_footables.i18n.empty_text;
            
            
            
            $table.footable(initConfig);
        }
    };
    ninja_table_app.initTables(); 
});