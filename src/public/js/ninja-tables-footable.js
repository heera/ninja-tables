jQuery(document).ready(function ($) {
    const ninja_table_app = {
        initTables: function () {
            let footables = $('table.foo-table.ninja_footable');
            let that = this;
            $.each(footables, function (footable, table) {
                let $table = $(table);
                let tableId = $table.data('footable_id');
                let tableSelector = 'ninja_footables_tables_'+tableId;
                let tableConfig = window[tableSelector];
                if(tableConfig.render_type === 'legacy_table') {
                    that.initLegacyTable($table, tableConfig);
                    return;
                }
                that.initResponsiveTable($table, tableConfig);
            });
        },
        initResponsiveTable:  function initFooTable($table, tableConfig) {
            jQuery.each(tableConfig.columns, (index, column) => {
                if (column.type == 'date') 
                {
                    column.sortValue = function (valueOrElement) {
                        if(valueOrElement) {
                            return moment(valueOrElement, column.formatString);
                        }
                        return null;
                    };
                    column.formatter = function (value, options, rowData) {
                        console.log(value);
                        if(value._i) {
                            return value._i;
                        }
                        return null;
                    }
                }
            });
            
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
            }).footable(initConfig);
                $table.find('.ninja_temp_cell').remove();
        }
    };
    ninja_table_app.initTables(); 
});