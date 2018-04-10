jQuery(document).ready(function ($) {
    const ninja_table_app = {
        initTables: function () {
            let footables = $('table.foo-table.ninja_footable');
            let that = this;
            $.each(footables, function (footable, table) {
                let $table = $(table);
                let tableId = $table.data('footable_id');
                let tableConfig = window.ninja_footables.tables['table_'+tableId];
                if(tableConfig.render_type === 'legacy_table') {
                    that.initLegacyTable($table, tableConfig);
                    return;
                } 
                that.initResponsiveTable($table, tableConfig);
            });
        },
        initResponsiveTable:  function initFooTable($table, tableConfig) {
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
        },
        initLegacyTable:  function initFooTable($table, tableConfig) {
            $table.css('display', 'table');
            let initConfig = {
                "columns": tableConfig.columns,
                "cascade": true
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

            $table.on({
                "init.ft.table": function(e, ft){
                    jQuery('#footable_parent_'+tableConfig.table_id).removeClass('loading_ninja_table');
                }
            })
                .on('footable_breakpoint', function(data) {
                    // rowspan: hide other headers
                    $table.find('td[colspan]').each(function() {
                        var $td = $(this),
                            index = $th.index(),
                            colspan = $th.attr('colspan');

                        // get all cells in the next rows (dependend on the rowspan-value) and hide them
                        $td.parent('tr').find('td:lt(' + rowspan + ')')
                            .find('th:eq(' + index + ')').hide();
                    });
                })
                .footable(initConfig);
        }
    };
    ninja_table_app.initTables(); 
});