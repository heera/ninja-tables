<?php

namespace NinjaTable\FrontEnd\DataProviders;

class WPPostsProvider
{
    use WPPostDataSourceTrait;

    public function boot()
    {
        add_filter('ninja_tables_get_table_settings', array($this, 'getTableSettings'));
        add_filter('ninja_tables_get_table_data', array($this, 'getTableData'), 10, 4);
        add_filter('ninja_tables_fetching_table_rows_wp-posts', array($this, 'data'), 10, 5);
    }

    public function getTableSettings($table)
    {
        try {
            $provider = sanitize_title(
                get_post_meta($table->ID, '_ninja_tables_data_provider', true), 'default', 'display'
            );

            if ($provider == 'wp-posts') {
                $table->isEditable = false;
                $table->dataSourceType = $provider;
                $table->whereConditions = get_post_meta($table->ID, '_ninja_table_wpposts_ds_where', true);
                $table->post_types = get_post_meta($table->ID, '_ninja_table_wpposts_ds_post_types', true);
                $table->isEditableMessage = 'You may edit your table settings here.';

                $table->isExpotable = false;
                $table->isImportable = false;
                $table->isSortable = false;
                $table->hasCacheFeature = false;
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

            if ($provider != 'wp-posts') {
                return $data;
            }

            $newData = array();
            foreach ($this->getPosts($tableId) as $key => $post) {
                $newData[] = array(
                    'id' => $post['ID'],
                    'values' => $post,
                    'position' => $key,
                );
            }

            return array(
                array_slice($newData, $offset, $perPage),
                count($newData)
            );

        } catch (\Exception $e) {
            return $data;
        }
    }

    public function data($data, $tableId, $defaultSorting, $disableCache, $limit)
    {
        return $this->getPosts($tableId);
    }

    public function getPosts($tableId)
    {
        $columns = array_map(function($column) {
            return $column['original_name'];
        }, get_post_meta($tableId, '_ninja_table_columns', true));

        $where = get_post_meta($tableId, '_ninja_table_wpposts_ds_where', true);

        $post_types = get_post_meta($tableId, '_ninja_table_wpposts_ds_post_types', true);

        return $this->buildWPQuery(
            compact('columns', 'where', 'post_types')
        );
    }
}
