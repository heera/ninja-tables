jQuery(document).on('ninja_table_init_stackables', function (e, data) {
    let $table = data.$table;
    let tableConfig = data.tableConfig;
    let targetBreakpoints = tableConfig.settings.stack_config.stacks_devices;
    if (!targetBreakpoints) {
        return;
    }

    function isStackable(currentName) {
        return targetBreakpoints.indexOf(currentName) !== -1;
    }

    $table
        .on('expand.ft.row', function (e, data, selfArg) {
            if (!isStackable(data.breakpoints.current.name)) {
                return;
            }
            e.preventDefault();

            console.log('called');

            selfArg.__hidden__ = FooTable.arr.map(selfArg.cells, function (cell) {
                return cell.column.visible ? cell : null;
            });
            if (selfArg.__hidden__.length > 0) {
                selfArg.$details.insertAfter(selfArg.$el)
                    .children('td').first()
                    .attr('colspan', selfArg.ft.columns.visibleColspan);
                FooTable.arr.each(selfArg.__hidden__, function (cell) {
                    cell.collapse();
                });
            }
            selfArg.$el.attr('data-expanded', true);
            selfArg.$toggle.removeClass('fooicon-plus').addClass('fooicon-minus');
            selfArg.expanded = true;
            selfArg.ft.raise('expanded.ft.row', [self]);
        })
        .on('after.ft.breakpoints', function (e, element, current, previous) {

        })
        .on('draw.ft.table', function (event, $element) {
            if (isStackable($element.breakpoints.current.name)) {
                $table.addClass('ninja_stacked_table');
                $element.rows.collapse();
                $element.rows.expand();
            } else {
                $table.removeClass('ninja_stacked_table');
                $element.rows.collapse();
            }
        });
});
