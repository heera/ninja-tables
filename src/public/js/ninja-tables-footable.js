jQuery(document).ready(function ($) {
    let footables = $('.foo-table');
    $.each(footables, function (footable, table) {
        let $table = $(table);
        let tableConfig = {
            table_id: $table.data('footable_id'),
            columns: $table.data('columns'),
            settings: $table.data('config_settings')
        };
       initFooTable($table, tableConfig);
    });
    
    function initFooTable($table, tableConfig) {
        let initConfig = {
            "cascade": true,
            "columns": tableConfig.columns,
            "rows": $.get(window.ninja_tables.ajax_url+'?action=wp_ajax_ninja_tables_public_action&table_id='+tableConfig.table_id+'&target_action=get-all-data')
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
});