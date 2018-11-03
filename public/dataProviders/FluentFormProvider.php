<?php

namespace NinjaTable\FrontEnd\DataProviders;

class FluentFormProvider
{
    public function boot()
    {
        add_filter('ninja_tables_get_table_settings', array($this, 'getTableSettings'));
        add_filter('ninja_tables_get_table_data', array($this, 'getTableData'), 10, 4);
        add_filter('ninja_tables_fetching_table_rows_fluent-form', array($this, 'data'), 10, 5);
    }

    public function getTableSettings($table)
    {
        try {
            $provider = sanitize_title(
                get_post_meta($table->ID, '_ninja_tables_data_provider', true), 'default', 'display'
            );

            if ($provider == 'fluent-form') {
                $table->isEditable = false;
                $table->dataSourceType = $provider;
                $table->isEditableMessage = '...';
            }
            
            return $table;
            
        } catch (\Exception $e) {
            return $table;
        }
    }

    public function getTableData($data, $tableId, $perPage, $offset)
    {
        try {
            $provider = sanitize_title(
                get_post_meta($tableId, '_ninja_tables_data_provider', true), 'default', 'display'
            );

            if ($provider != 'fluent-form') {
                return $data;
            }

            if (function_exists('wpFluentForm')) {
                $formId = get_post_meta($tableId, '_ninja_tables_data_provider_ff_form_id', true);
                $entries = wpFluentForm('FluentForm\App\Modules\Entries\Entries')->_getEntries(
                    intval($formId),
                    isset($_GET['page']) ? intval($_GET['page']) : 1,
                    intval($perPage),
                    'DESC',
                    'all',
                    null
                );

                $formattedEntries = array();
                foreach ($entries['submissions']['data'] as $key => $value) {
                    $formattedEntries[] = array(
                        'id' => $value->id,
                        'position' => $key,
                        'values' => $value->user_inputs
                    );
                }

                return array(
                    $formattedEntries,
                    $entries['submissions']['paginate']['total']
                );
            }

        } catch (\Exception $e) {
            return $data;
        }
    }

    public function data($data, $tableId, $defaultSorting, $disableCache, $limit)
    {
        if (function_exists('wpFluentForm')) {
            $formId = get_post_meta($tableId, '_ninja_tables_data_provider_ff_form_id', true);
            $entries = wpFluentForm('FluentForm\App\Modules\Entries\Entries')->_getEntries(
                intval($formId), -1, -1, 'DESC', 'all', null
            );

            $formattedEntries = array();
            foreach ($entries['submissions']['data'] as $key => $value) {
                $formattedEntries[] = $value->user_inputs;
            }

            return $formattedEntries;
        }
    }
}
