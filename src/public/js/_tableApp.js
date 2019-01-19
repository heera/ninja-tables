import Event from "./EventBus";
import './ninja-tables-footable-custom-event';
import './_stackable';

let $ = jQuery;
export default {
    initTables: function () {
        let that = this;
        this.ninjaFooTablesInstance = [];
        let footables = $('table.foo-table.ninja_footable');
        if (footables.length) {
            $.each(footables, (index, table) => {
                let $table = $(table);
                let tableDataName = $table.attr('data-ninja_table_instance');
                let tableConfig = window[tableDataName];
                if (!tableConfig) {
                    return;
                }
                tableConfig.instance_name = tableDataName;
                this.initTable($table, tableConfig);
            });
        }
    },
    initTable($table, tableConfig) {
        var that = this;
        const isHTML = RegExp.prototype.test.bind(/(<([^>]+)>)/i);
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
                column.sortValue = that.textFilterValue;
                column.filterValue = that.textFilterValue;
                column.type = 'text';
            }
            // format the value here
            column.formatter = function (value, options, rowData) {
                if (column.transformed_value) {
                    value = that.getShortcodes(column.transformed_value, column, rowData);
                }
                return value;
            }
        });

        $table.on('ready.ft.table', (e, fooTable) => {
            try {
                that.onReadyFooTable($table, tableConfig);
                jQuery(document).trigger('ninja_table_loaded', [$table, tableConfig]);
            } catch (error) {
                console.warn(error);
            }
        })
            .on('postdraw.ft.table', (e, fooTable) => {
                try {
                    Event.trigger(
                        'ninja-tables-apply-conditional-formatting',
                        [$table, tableConfig]
                    );
                    $table.find("td:contains('#colspan#')").remove();
                } catch (error) {
                    console.warn(error);
                }
            })
            .on('after.ft.filtering', function (e, ft, filter) {
                if (filter && filter.length) {
                    $table.addClass('ninja_has_filter');
                } else {
                    let frm_elements = $table.find('.ninja-custom-filter input, .ninja-custom-filter select');
                    $.each(frm_elements, (index, frm_element) => {
                        let field_type = frm_element.type.toLowerCase();
                        switch (field_type) {
                            case "text":
                            case "password":
                            case "textarea":
                            case "hidden":
                                frm_element.value = "";
                                break;
                            case "radio":
                            case "checkbox":
                                if (frm_element.checked) {
                                    frm_element.checked = false;
                                }
                                break;
                            case "select-one":
                                frm_element.selectedIndex = 0;
                                break;
                            case "select-multiple":
                                jQuery(document).trigger('ninja_table_trigger_multi_reset', {
                                    'frm_element': frm_element,
                                    '$table': $table
                                });
                                break;
                            default:
                                break;
                        }
                    });
                    $table.removeClass('ninja_has_filter');
                }
            });
        
        if (tableConfig.settings.stack_config && tableConfig.settings.stack_config.stackable) {
            $(document).trigger('ninja_table_init_stackables', {
                '$table': $table,
                'tableConfig': tableConfig
            });
        }
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

        let initConfig = that.getNinjaTableConfig(tableConfig);

        if (tableConfig.chunks) {
            $table.on('ready.ft.table', (e, fooTable) => {
                that.loadMoreData(tableConfig, fooTable);
            });
        }

        let $tableInstance = FooTable.init($table, initConfig);

        if (!this.ninjaFooTablesInstance) {
            this.ninjaFooTablesInstance = [];
        }
        this.ninjaFooTablesInstance[tableConfig.instance_name] = $tableInstance;
        $table.find("td:contains('#colspan#')").remove();
    },
    loadMoreData(tableConfig, fooTable) {
        let maxChuck = tableConfig.chunks;
        this.loadChuck(1, tableConfig, fooTable);
    },
    loadChuck(counter, tableConfig, fooTable) {
        let maxChuck = tableConfig.chunks;
        if (counter <= maxChuck) {

            let uri_params = {
                action: 'wp_ajax_ninja_tables_public_action',
                table_id: tableConfig.table_id,
                target_action: 'get-all-data',
                default_sorting: tableConfig.settings.default_sorting,
                skip_rows: tableConfig.settings.skip_rows,
                limit_rows: tableConfig.settings.limit_rows,
                chunk_number: counter
            };

            if (tableConfig.editing && tableConfig.editing.check_editing == 'yes') {
                uri_params.check_editing = 'yes';
                if( tableConfig.editing.own_data_only == 'yes' ) {
                    uri_params.own_only = 'yes';
                }
            }

            $.get(window.ninja_footables.ajax_url, uri_params).then(response => {
                this.loadChuck(counter + 1, tableConfig, fooTable);
                if(response) {
                    fooTable.rows.load(response, true);
                }
            });
        }
    },
    getNinjaTableConfig(tableConfig) {
        // Prepare Table Init Configuration
        let initConfig = {
            "toggleColumn": tableConfig.settings.togglePosition,
            "cascade": true,
            "useParentWidth": !!tableConfig.settings.use_parent_width,
            "columns": tableConfig.columns,
            "expandFirst": tableConfig.settings.expandFirst,
            "expandAll": tableConfig.settings.expandAll,
            "empty": tableConfig.settings.i18n.no_result_text,
            "editing": {}
        };

        if (tableConfig.editing && tableConfig.editing.enabled) {
            initConfig.editing = {
                "enabled": tableConfig.editing.enabled,
                "position": tableConfig.editing.position,
                "alwaysShow": tableConfig.editing.alwaysShow,
                "allowEdit": tableConfig.editing.editing,
                "allowDelete": tableConfig.editing.deleting,
                "allowView": false,
                "showText": '<span class="fooicon fooicon-pencil" aria-hidden="true"></span> '+tableConfig.editing.showText,
                "hideText": tableConfig.editing.hideText,
                "addText": tableConfig.editing.addText,
                "column": {
                    "classes": "footable-editing",
                    "name": "____editing____",
                    "title": tableConfig.editing.editingColumnTitle,
                    "filterable": false,
                    "sortable": false
                },
                editRow(row) {
                    let self = this;
                    jQuery(document).trigger('ninja_table_edit_row', {
                        row: row,
                        self: self,
                        tableConfig: tableConfig
                    });
                },
                addRow() {
                    let self = this;
                    jQuery(document).trigger('ninja_table_add_row', {
                        self: self,
                        tableConfig: tableConfig
                    });
                },
                deleteRow(row) {
                    let self = this;
                    jQuery(document).trigger('ninja_table_delete_row', {
                        row: row,
                        self: self,
                        tableConfig: tableConfig
                    });
                }
            }
        }
        if (tableConfig.render_type !== 'legacy_table') {
            let rowRequestUrlParams = {
                action: 'wp_ajax_ninja_tables_public_action',
                table_id: tableConfig.table_id,
                target_action: 'get-all-data',
                default_sorting: tableConfig.settings.default_sorting,
                skip_rows: tableConfig.settings.skip_rows,
                limit_rows: tableConfig.settings.limit_rows,
            };
            if (tableConfig.chunks && tableConfig.chunks > 0) {
                rowRequestUrlParams.chunk_number = 0;
            }

            if ( tableConfig.editing && tableConfig.editing.check_editing == 'yes' ) {
                rowRequestUrlParams.check_editing = 'yes';
                if(tableConfig.editing.own_data_only == 'yes') {
                    rowRequestUrlParams.own_only = 'yes';
                }
            }

            initConfig.rows = $.get(window.ninja_footables.ajax_url, rowRequestUrlParams);
        }

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
            let filterColumns = tableConfig.settings.defualt_filter_column;
            let validColumns = [];
            if (filterColumns && filterColumns.length) {
                let allColumns = [];
                jQuery.each(tableConfig.columns, (index, column) => {
                    allColumns.push(column.name);
                });
                validColumns = allColumns.filter(value => -1 !== filterColumns.indexOf(value));
            }

            initConfig.filtering.filters = [{
                "name": "ninja_table_default_filter",
                "hidden": tableConfig.settings.hide_default_filter == 'yes',
                "query": tableConfig.settings.defualt_filter,
                "columns": validColumns
            }];
        }

        initConfig.paging = {
            "enabled": !!tableConfig.settings.paging,
            "position": "right",
            "size": tableConfig.settings.paging,
            "container": "#footable_parent_" + tableConfig.table_id + " .paging-ui-container"
        };
        return initConfig;
    },
    onReadyFooTable($table, tableConfig) {
        let cssStyles = tableConfig.custom_css;

        console.log(tableConfig.settings);

        if(tableConfig.settings.extra_css_class) {
            $table.addClass(tableConfig.settings.extra_css_class);
        }

        jQuery.each(cssStyles, (className, values) => {
            $table.find('.' + className).css(values);
        });

        if(tableConfig.settings.hide_on_empty) {
            $table.on('expanded.ft.row', function(e, ft, row){
                $table.find('table.footable-details td:empty').parent().addClass('nt_has_hide');
            });
            // We have to run this intially if all the rows are expanded by default
            $table.find('table.footable-details td:empty').parent().addClass('nt_has_hide');
        }

        jQuery(document).trigger('ninja_table_ready_init', {
            '$table': $table,
            'tableConfig': tableConfig
        });

        jQuery(document).trigger('ninja_table_ready_init_table_id_' + tableConfig.table_id, {
            '$table': $table,
            'tableConfig': tableConfig
        });

        if (jQuery('.ninja_filter_date_picker,.ninja_filter_date_range').length && Pikaday) {
            let datePikers = jQuery('.ninja_filter_date_picker,.ninja_filter_date_range');
            jQuery.each(datePikers, function (index, datePiker) {
                let $piker = jQuery(datePiker);
                $piker.pikaday({
                    format: $piker.data('date_format')
                });
            });
        }
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

            if (separatorIndex !== -1) {
                defaultValue = rowKey.substring(separatorIndex + 1, rowKey.length);
                rowKey = rowKey.substring(0, separatorIndex);
            }

            if (row[rowKey]) {
                transValue = transValue.replace(match, row[rowKey]);
            } else {
                transValue = transValue.replace(match, defaultValue);
            }
        });
        return transValue;
    },
    textFilterValue(valueOrElement) {
        if (FooTable.is.element(valueOrElement) || FooTable.is.jq(valueOrElement)) {
            return jQuery(valueOrElement).text();
        } else {
            // Create a new div element
            var temporalDivElement = document.createElement("div");
            // Set the HTML content with the providen
            temporalDivElement.innerHTML = valueOrElement;
            // Retrieve the text property of the element (cross-browser support)
            var text = temporalDivElement.textContent || temporalDivElement.innerText || "";
            return text.replace(/(\r\n\t|\n|\r\t)/gm, "").trim();
        }
    }
}
