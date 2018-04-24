jQuery(document).ready(function ($) {
    const ninja_table_app = {
        initTables: function () {
            window.ninjaFooTablesInstance = [];
            let footables = $('table.foo-table.ninja_footable');
            let that = this;
            $.each(footables, function (footable, table) {
                let $table = $(table);
                $table.hide();
                let tableId = $table.data('footable_id');
                let tableSelector = 'ninja_footables_tables_' + tableId;
                let tableConfig = window[tableSelector];
                jQuery.each(tableConfig.columns, (index, column) => {
                    if (column.type == 'date') {
                        if (tableConfig.render_type != 'legacy_table') {
                            column.sortValue = function (valueOrElement) {
                                if (valueOrElement) {
                                    return moment(valueOrElement, column.formatString);
                                }
                                return null;
                            };
                        } column.formatter = function (value, options, rowData) {
                            if (value._i) {
                                return  value._i;
                            }
                            return null;
                        }
                    } else if (column.type == 'html' && tableConfig.render_type == 'ajax_table') {
                        column.formatter = function (value, options, rowData) {
                            return value;
                        };
                        column.sortValue = function (valueOrElement) {
                            valueOrElement = '<p>'+valueOrElement+'</p>';
                            return jQuery(valueOrElement).text();
                        };
                    }
                });
                if (tableConfig.render_type === 'legacy_table') {
                    that.initLegacyTable($table, tableConfig);
                    return;
                }
                
                that.initResponsiveTable($table, tableConfig);
            });
        },
        initResponsiveTable: function initFooTable($table, tableConfig) {
            let initConfig = {
                "cascade": true,
                "columns": tableConfig.columns,
                "rows": $.get(window.ninja_footables.ajax_url + '?action=wp_ajax_ninja_tables_public_action&table_id=' + tableConfig.table_id + '&target_action=get-all-data&default_sorting=' + tableConfig.settings.default_sorting)
            };

            initConfig.sorting = {
                "enabled": !!tableConfig.settings.sorting
            };

            let enabledSearch = !!tableConfig.settings.filtering;
            if (tableConfig.settings.defualt_filter) {
                enabledSearch = true;
            }
            initConfig.filtering = {
                "enabled": enabledSearch,
                "delay": 1,
                "dropdownTitle": ninja_footables.i18n.search_in,
                "placeholder": ninja_footables.i18n.search,
                "connectors": false,
                "ignoreCase": true
            };

            if (tableConfig.settings.defualt_filter) {
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
                "container": "#footable_parent_" + tableConfig.table_id + " .paging-ui-container"
            };
            initConfig.empty = ninja_footables.i18n.empty_text;
            let $tableInstance = $table
                .on('postinit.ft.table', () => {
                    this.commonTasks($table, tableConfig);
                }).footable(initConfig);
           
            window.ninjaFooTablesInstance['table_' + tableConfig.table_id] = $tableInstance;
            jQuery('body').trigger('footable_loaded', [$tableInstance, tableConfig]);
            jQuery("td:contains('#colspan#')").remove();
        },
        initLegacyTable: function initFooTable($table, tableConfig) {
            $table.css('display', 'table');
            //return;
            let initConfig = {
                "columns": tableConfig.columns,
                "cascade": true
            };

            initConfig.sorting = {
                "enabled": !!tableConfig.settings.sorting
            };
            let enabledSearch = !!tableConfig.settings.filtering;
            if (tableConfig.settings.defualt_filter) {
                enabledSearch = true;
            }
            
            initConfig.filtering = {
                "enabled": enabledSearch,
                "delay": 1,
                "dropdownTitle": ninja_footables.i18n.search_in,
                "placeholder": ninja_footables.i18n.search,
                "connectors": false,
                "ignoreCase": true
            };

            if (tableConfig.settings.defualt_filter) {
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
                "container": "#footable_parent_" + tableConfig.table_id + " .paging-ui-container"
            };
            initConfig.empty = ninja_footables.i18n.empty_text;
            jQuery('#footable_parent_' + tableConfig.table_id).find('.footable-loader').remove();
            let $tableInstance = $table.on('postinit.ft.table', () => {
                this.commonTasks($table, tableConfig);
            }).footable(initConfig);
            window.ninjaFooTablesInstance['table_' + tableConfig.table_id] = $tableInstance;
            jQuery('body').trigger('footable_loaded', [$tableInstance, tableConfig]);
            $table.find('.ninja_temp_cell').remove();
        },
        commonTasks($table, tableConfig) {
            let cssStyles = tableConfig.custom_css;
            jQuery.each(cssStyles, (className, values) => {
                $table.find('.'+className).css(values);
            });
        }
    };
    ninja_table_app.initTables();
});