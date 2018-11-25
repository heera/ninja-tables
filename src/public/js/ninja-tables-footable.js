import Event from './EventBus';
import './ninja-tables-footable-custom-event';

jQuery(document).ready(function ($) {
    const ninja_table_app = {
        initTables: function () {
            let that = this;
            window.ninjaFooTablesInstance = [];
            let footables = $('table.foo-table.ninja_footable');
            const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
            $.each(footables, function (index, table) {
                let $table = $(table);
                $table.hide();
                let tableId = $table.data('footable_id');
                let tableSelector = 'ninja_footables_tables_' + tableId;
                // The config is stored in an array since there
                // could be more than one shortcode for a table.
                let tableDataName = $(this).attr('data-ninja_table_instance');

                let tableConfig = window[tableDataName];
                if (!tableConfig) {
                    return;
                }

                jQuery.each(tableConfig.columns, (index, column) => {
                    if (column.type == 'date') {
                        column.sortValue = function (valueOrElement) {
                            if (FooTable.is.element(valueOrElement) || FooTable.is.jq(valueOrElement)) {
                                valueOrElement = jQuery(valueOrElement).text();
                            }
                            if (!valueOrElement) {
                                return 0;
                            }
                            return moment(valueOrElement, column.formatString).valueOf();
                        };
                    } else if (column.type == 'numeric') {
                        column.sortValue = function (valueOrElement) {
                            if (FooTable.is.element(valueOrElement) || FooTable.is.jq(valueOrElement) || isHTML(valueOrElement)) {
                                valueOrElement = jQuery(valueOrElement).text();
                            }
                            if (!valueOrElement) {
                                return '';
                            }
                            if (typeof (valueOrElement) != 'number') {
                                valueOrElement = valueOrElement.replace(/[^0-9\.,-]+/g, "");
                            } else {
                                valueOrElement = valueOrElement.toString();
                            }

                            if (valueOrElement && column.thousandSeparator) {
                                valueOrElement = valueOrElement.split(column.thousandSeparator).join("");
                            }
                            if (valueOrElement && column.decimalSeparator) {
                                valueOrElement = valueOrElement.split(column.decimalSeparator).join(".");
                            }
                            let numberValue = Number(valueOrElement);
                            if (isNaN(numberValue)) {
                                return valueOrElement;
                            }
                            return numberValue;
                        };
                    } else {
                        column.sortValue = function (valueOrElement) {
                            if (FooTable.is.element(valueOrElement) || FooTable.is.jq(valueOrElement)) {
                                return jQuery(valueOrElement).text();
                            } else {
                                return jQuery('<div>' + valueOrElement + "</div>").text();
                            }
                        };
                        if(column.type != 'html') {
                            column.type = 'text';
                        }
                    }
                    // format the value here
                    column.formatter = function(value, options, rowData){
                        if(column.transformed_value) {
                            return that.getShortcodes(column.transformed_value, column, rowData);
                        }
                        return value;
                    }
                });

                $table.on('ready.ft.table', (e, fooTable) => {
                    try {
                        that.onReadyFooTable($table, tableConfig);
                    } catch (error) {
                        console.warn(error);
                    }
                }).on('postdraw.ft.table', (e, fooTable) => {
                    try {
                        Event.trigger(
                            'ninja-tables-apply-conditional-formatting',
                            [$table, tableConfig]
                        );
                    } catch (error) {
                        console.warn(error);
                    }
                });

                $table.on('click', '.ninja_table_do_column_filter', function (e) {
                    e.preventDefault();
                    try {
                        const link = $(this);
                        const filtering = FooTable.get($table).use(FooTable.Filtering);
                        const query = new FooTable.Query('"' + link.text() + '"', 'AND', false, false);
                        filtering.addFilter('nt_link_filter', query, [link.data('target_column')]);
                        filtering.filter();
                    } catch (error) {
                        console.warn(error);
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
                "empty": tableConfig.settings.i18n.no_result_text
            };
            initConfig.sorting = {
                "enabled": !!tableConfig.settings.sorting
            };

            let enabledSearch = !!tableConfig.settings.filtering;
            if (tableConfig.settings.defualt_filter) {
                enabledSearch = true;
            }

            if (tableConfig.custom_filter_key) {
                let filterKey = tableConfig.custom_filter_key;
                initConfig.components = {
                    filtering: FooTable[filterKey]
                };
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

            let $tableInstance = $table.footable(initConfig);

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
                "empty": tableConfig.settings.i18n.no_result_text
            };
            initConfig.sorting = {
                "enabled": !!tableConfig.settings.sorting
            };
            let enabledSearch = !!tableConfig.settings.filtering;
            if (tableConfig.settings.defualt_filter) {
                enabledSearch = true;
            }


            if (tableConfig.custom_filter_key) {
                let filterKey = tableConfig.custom_filter_key;
                initConfig.components = {
                    filtering: FooTable[filterKey]
                };
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

            let $tableInstance = $table.footable(initConfig);

            window.ninjaFooTablesInstance['table_' + tableConfig.table_id] = $tableInstance;
            jQuery('body').trigger('footable_loaded', [$tableInstance, tableConfig]);
            $table.find('.ninja_temp_cell').remove();
        },
        onReadyFooTable($table, tableConfig) {
            let cssStyles = tableConfig.custom_css;
            jQuery.each(cssStyles, (className, values) => {
                $table.find('.' + className).css(values);
            });
        },
        getShortcodes(str, column, row) {
            let transValue = column.transformed_value;
            const regEx = /{row.([^\}]*)}/g;
            let allMatches = transValue.match(regEx);
            if (!allMatches) {
                return transValue;
            }
            $.each(allMatches, (index, match) => {
                let rowKey = match.substring(5, match.length - 1);

                let defaultValue = '';
                let separatorIndex = rowKey.indexOf("|");

                if(separatorIndex !== -1) {
                    defaultValue = rowKey.substring(separatorIndex + 1, rowKey.length);
                    rowKey = rowKey.substring(0, separatorIndex);
                }

                if(row[rowKey]) {
                    transValue = transValue.replace(match, row[rowKey]);
                } else {
                    transValue = transValue.replace(match, defaultValue);
                }
            });
            return transValue;
        }
    };
    ninja_table_app.initTables();
});
