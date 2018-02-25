const tableLibs = function() {
    let tableLibs = {
        footable: {
            title: 'Footable',
            description: 'A responsive table plugin built on jQuery',
            supports: {
                ajax: false,
                sorting: true,
                search: true
            },
            css_libs: {
                bootstrap3: {
                    title: 'Bootstrap 3',
                    description: 'Apply Twitter Bootstrap 3 styles in the table',
                    styles: [
                        {
                            key: 'table-striped',
                            title: 'Striped rows',
                            description: 'add zebra-striping to any table row'
                        },
                        {
                            key: 'table-bordered',
                            title: 'Bordered table',
                            description: 'borders on all sides of the table and cells'
                        },
                        {
                            key: 'table-hover',
                            title: 'Hover rows',
                            description: 'enable a hover state on table rows'
                        },
                        {
                            key: 'table-condensed',
                            title: 'Condensed table',
                            description: 'make tables more compact by cutting cell padding in half'
                        }
                    ]
                },
                bootstrap4: {
                    title: 'Bootstrap 4',
                    description: 'Apply Twitter Bootstrap 4 styles in the table',
                    styles: [
                        {
                            key: 'table-striped',
                            title: 'Striped rows',
                            description: 'add zebra-striping to any table row'
                        },
                        {
                            key: 'table-bordered',
                            title: 'Bordered table',
                            description: 'borders on all sides of the table and cells'
                        },
                        {
                            key: 'table-hover',
                            title: 'Hover rows',
                            description: 'enable a hover state on table rows'
                        },
                        {
                            key: 'table-sm',
                            title: 'Small table',
                            description: 'make tables more compact by cutting cell padding in half'
                        }
                    ]
                },
                semantic_ui: {
                    title: 'Semantic UI',
                    description: 'Apply Semantic UI styles in the table',
                    styles: [
                        {
                            key: 'single line',
                            title: 'Single Line Cells',
                            description: 'A table can specify that its cell contents should remain on a single line, and not wrap.'
                        },
                        {
                            key: 'fixed',
                            title: 'Fixed Layout',
                            description: 'A special faster form of table rendering that does not resize table cells based on content.'
                        },
                        {
                            key: 'selectable',
                            title: 'Hover rows',
                            description: 'enable a hover state on table rows'
                        },
                        {
                            key: 'celled',
                            title: 'Bordered table',
                            description: 'borders on all sides of the table and cells'
                        },
                        {
                            key: 'striped',
                            title: 'Striped rows',
                            description: 'add zebra-striping to any table row'
                        },
                        {
                            key: 'compact',
                            title: 'Compact Table',
                            description: 'make tables more compact by cutting cell padding in half'
                        }

                    ]
                },
            },
            colors: {
                ninja_no_color_table: 'Default',
                red: 'Red',
                orange: 'Orange',
                yellow: 'Yellow',
                olive: 'Olive',
                green: 'Green',
                teal: 'Teal',
                blue: 'Blue',
                violet: 'Violet',
                purple: 'Purple',
                pink: 'Pink',
                grey: 'Grey',
                black: 'Black',
                ninja_table_custom_color: 'Custom'
            }
        }
    };
    return tableLibs;
};

export { tableLibs };