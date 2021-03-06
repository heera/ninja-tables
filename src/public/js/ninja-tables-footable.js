jQuery(document).ready(function ($) {
    const ninja_table_app = {
        initTables: function () {
            window.ninjaFooTablesInstance = [];
            let footables = $('table.foo-table.ninja_footable');
            let that = this;
            $.each(footables, function (index, table) {
                let $table = $(table);
                $table.hide();
                let tableId = $table.data('footable_id');
                let tableSelector = 'ninja_footables_tables_' + tableId;
                // The config is stored in an array since there
                // could be more than one shortcode for a table.
                let tableDataName = $(this).attr('data-ninja_table_instance');
                
                let tableConfig = window[tableDataName];
                if(!tableConfig) {
                    return;
                }
                jQuery.each(tableConfig.columns, (index, column) => {
                    if (column.type == 'date') {
                        column.sortValue = function (valueOrElement) {
                            if (FooTable.is.element(valueOrElement) || FooTable.is.jq(valueOrElement)) {
                                valueOrElement = jQuery(valueOrElement).text();
                            }
                            return moment( valueOrElement, column.formatString).format("X");
                        };
                        column.formatter = function (value, options, rowData) {
                            if (value._i) {
                                return  value._i;
                            }
                            return value;
                        }
                    } else if (column.type == 'html' || column.type == 'text') {
                        column.sortValue = function (valueOrElement) {
                            if (FooTable.is.element(valueOrElement) || FooTable.is.jq(valueOrElement)) {
                                return jQuery(valueOrElement).text();
                            } else {
                                return jQuery('<div>'+valueOrElement+"</div>").text();
                            }
                        };
                        column.type = 'text';
                    }  else if(column.type == 'numeric') {
                        column.sortValue = function (valueOrElement) {
                            if (FooTable.is.element(valueOrElement)  || FooTable.is.jq(valueOrElement)) {
                                valueOrElement = jQuery(valueOrElement).text();
                            }
                            let numberValue = Number(valueOrElement.replace(/[^0-9\.-]+/g,""));
                            
                            console.log(numberValue);
                            return numberValue;
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
                "rows": $.get(window.ninja_footables.ajax_url + '?action=wp_ajax_ninja_tables_public_action&table_id=' + tableConfig.table_id + '&target_action=get-all-data&default_sorting=' + tableConfig.settings.default_sorting),
                "expandFirst": tableConfig.settings.expandFirst,
                "expandAll": tableConfig.settings.expandAll,
                "empty" : tableConfig.settings.i18n.no_result_text
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
                "dropdownTitle": tableConfig.settings.i18n.search_in,
                "placeholder": tableConfig.settings.i18n.search,
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
                "cascade": true,
                "expandFirst": tableConfig.settings.expandFirst,
                "expandAll": tableConfig.settings.expandAll,
                "empty" : tableConfig.settings.i18n.no_result_text
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
                "dropdownTitle": tableConfig.settings.i18n.search_in,
                "placeholder": tableConfig.settings.i18n.search,
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