<?php

namespace NinjaTable\FrontEnd\DataProviders;

use NinjaTables\Classes\ArrayHelper;

class FluentFormProvider
{
    public function boot()
    {
        add_action('wp_ajax_ninja_tables_save_fluentform_table', array($this, 'saveTable'), 10, 1);
        add_filter('ninja_tables_get_table_fluent-form', array($this, 'getTableSettings'));
        add_filter('ninja_tables_get_table_data_fluent-form', array($this, 'getTableData'), 10, 4);
        add_filter('ninja_tables_fetching_table_rows_fluent-form', array($this, 'data'), 10, 2);
    }

    public function saveTable()
    {
        $messages = array();
        $tableId = $_REQUEST['table_Id'];
        $formId = $_REQUEST['form']['id'];

        if (!$formId) {
            // Validate Title
            if (empty( $_REQUEST['post_title'] ) ) {
                $messages['title'] = __('The title field is required.', 'ninja-tables');
            }
        }

        // Validate Columns
        $fields = isset($_REQUEST['form']['fields']) ? $_REQUEST['form']['fields'] : array();
        if (!($fields = ninja_tables_sanitize_array($fields))) {
            $messages['fields'] = __('No fields were selected.', 'ninja-tables');
        }

        // If Validation failed
        if (array_filter($messages)) {
            wp_send_json_error(array('message' => $messages), 422);
            wp_die();
        }

        $columns = array();
        foreach ($fields as $field) {
            $columns[] = array(
                'name' => $field['label'],
                'key' => $field['name'],
                'breakpoints' => null,
                'data_type' => 'text',
                'dateFormat' => null,
                'header_html_content' => null,
                'enable_html_content' => false,
                'contentAlign' => null,
                'textAlign' => null,
                'original_name' => $field['name']
            );
        }

        if ($tableId) {
            $oldColumns = get_post_meta($tableId, '_ninja_table_columns', true);
            foreach ($columns as $key => $newColumn) {
                foreach ($oldColumns as $oldColumn) {
                    if ($oldColumn['original_name'] == $newColumn['original_name']) {
                        $columns[$key] = $oldColumn;
                    }
                }
            }

            // Reset/Reorder array indices
            $columns = array_values($columns);
        } else {
            $tableId = $this->saveOrCreateTable();
        }

        update_post_meta($tableId, '_ninja_table_columns', $columns);
        update_post_meta($tableId, '_ninja_tables_data_provider', 'fluent-form');
        update_post_meta($tableId, '_ninja_tables_data_provider_ff_form_id', $formId);
         update_post_meta(
            $tableId, '_ninja_tables_data_provider_ff_entry_limit', $_REQUEST['form']['entry_limit']
        );
        update_post_meta(
            $tableId, '_ninja_tables_data_provider_ff_entry_status', $_REQUEST['form']['entry_status']
        );

        wp_send_json_success(array('table_id' => $tableId, 'form_id' => $_REQUEST['form']['id']));
    }

    public function getTableSettings($table)
    {
        $table->isEditable = false;
        $table->dataSourceType = 'fluent-form';
        $table->isEditableMessage = 'You may edit your table settings here.';
        $table->fluentFormFormId = get_post_meta(
            $table->ID, '_ninja_tables_data_provider_ff_form_id', true
        );
        $table->entry_limit = get_post_meta(
            $table->ID, '_ninja_tables_data_provider_ff_entry_limit', true
        );
        $table->entry_status = get_post_meta(
            $table->ID, '_ninja_tables_data_provider_ff_entry_status', true
        );
        $table->isExportable = true;
        $table->isImportable = false;
        $table->isCreatedSortable = true;
        $table->isSortable = false;
        $table->hasCacheFeature = false;
        return $table;
    }

    public function getTableData($data, $tableId, $perPage = -1, $offset = 0)
    {
        if (function_exists('wpFluentForm')) {
            $formId = get_post_meta($tableId, '_ninja_tables_data_provider_ff_form_id', true);
            $entries = wpFluentForm('FluentForm\App\Modules\Entries\Entries')->_getEntries(
                intval($formId),
                isset($_GET['page']) ? intval($_GET['page']) : 1,
                intval($perPage),
                $this->getOrderBy($tableId),
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

        return $data;
    }

    public function data($data, $tableId)
    {
        if (function_exists('wpFluentForm')) {
            $formId = get_post_meta($tableId, '_ninja_tables_data_provider_ff_form_id', true);
            $status = get_post_meta($tableId, '_ninja_tables_data_provider_ff_entry_status', true);
            $limit = (int) get_post_meta($tableId, '_ninja_tables_data_provider_ff_entry_limit', true);

            $entryStatus = apply_filters(
                'ninja_tables_fluentform_entry_status', $status, $tableId, $formId
            );

            $entryLimit = apply_filters(
                'ninja_tables_fluentform_per_page', ($limit ? $limit : -1), $tableId, $formId
            );

            $orderBy = apply_filters(
                'ninja_tables_fluentform_order_by', $this->getOrderBy($tableId), $tableId, $formId
            );

            $entries = wpFluentForm('FluentForm\App\Modules\Entries\Entries')->_getEntries(
                intval($formId), -1, $entryLimit, $orderBy, $entryStatus, null
            );

            $formattedEntries = array();
            foreach ($entries['submissions']['data'] as $key => $value) {
                // @todo: We should only return the data those are available on column settings
                // At least in the public data facing function
                $formattedEntries[] = $value->user_inputs;
            }
            return $formattedEntries;
        }
    }

    private function saveOrCreateTable($postId = null)
    {
        $attributes = array(
            'post_title' => sanitize_text_field($_REQUEST['post_title']),
            'post_content' => wp_kses_post($_REQUEST['post_content']),
            'post_type' => 'ninja-table',
            'post_status' => 'publish'
        );
        if (!$postId) {
            $postId = wp_insert_post($attributes);
        } else {
            $attributes['ID'] = $postId;
            wp_update_post($attributes);
        }

        return $postId;
    }

    private function getOrderBy($tableId)
    {
        $tableSettings = get_post_meta($tableId, '_ninja_table_settings', true);
        if(ArrayHelper::get($tableSettings, 'default_sorting') == 'old_first') {
            return 'ASC';
        } else {
            return 'DESC';
        }
    }
}
