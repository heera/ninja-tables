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
            let initConfig = {
                "cascade": true,
                "columns": tableConfig.columns,
                "rows": $.get(window.ninja_footables.ajax_url+'?action=wp_ajax_ninja_tables_public_action&table_id='+tableConfig.table_id+'&target_action=get-all-data')
            };

            initConfig.sorting = {
                "enabled": !!tableConfig.settings.sorting
            };
            initConfig.filtering = {
                "enabled":  !!tableConfig.settings.filtering,
                "delay": 1,
                "dropdownTitle": "Search in:",
                "connectors": false
            };

            initConfig.paging = {
                "enabled": !!tableConfig.settings.paging,
                "position": "right",
                "size": tableConfig.settings.paging,
                "container": "#footable_parent_"+tableConfig.table_id+" .paging-ui-container"
            };
            $table.footable(initConfig);
        }
    };
    ninja_table_app.initTables(); 
});