import './_csvExport'
import './_print'
jQuery(document).on('ninja_table_ready_init', function (event, data) {
    let $table = data.$table;
    let tableConfig = data.tableConfig;
    if (tableConfig.table_buttons) {
        let $button = jQuery('<div/>', {
            class: 'ninja_table_buttons'
        });
        let status = false;
        jQuery.each(tableConfig.table_buttons, (button_name, button) => {
            if(button.status == 'yes') {
                status = true;
                $button.append(
                    jQuery('<button/>', {
                        class: 'ninja_button btn ninja_button_' + button_name,
                        html: button.label,
                        'data-table_id': tableConfig.table_id
                    })
                        .on('click', function (e) {
                            e.preventDefault();
                            jQuery(document).trigger('ninja_table_button_action_' + button_name, {
                                button: button,
                                tableConfig: tableConfig
                            })
                        })
                );
            }
        });
        if(status) {
            $table.find('.footable-filtering th').append($button);
        }
    }
});
