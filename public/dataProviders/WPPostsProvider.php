<?php

namespace NinjaTable\FrontEnd\DataProviders;

class WPPostsProvider
{
    use WPPostDataSourceTrait;

    public function boot()
    {
        add_filter('ninja_tables_get_table_wp-posts', array($this, 'getTableSettings'));
        add_filter('ninja_tables_get_table_wp-posts', array($this, 'getTableData'), 10, 4);
        add_filter('ninja_tables_fetching_table_rows_wp-posts', array($this, 'data'), 10, 5);
    }

    public function getTableSettings($table)
    {
        $table->isEditable = false;
        $table->dataSourceType = 'wp-posts';
        $table->whereConditions = get_post_meta($table->ID, '_ninja_table_wpposts_ds_where', true);
        $table->post_types = get_post_meta($table->ID, '_ninja_table_wpposts_ds_post_types', true);
        $table->isEditableMessage = 'You may edit your table settings here.';

        $table->isExpotable = false;
        $table->isImportable = false;
        $table->isSortable = false;
        $table->isCreatedSortable = false;
        $table->hasCacheFeature = false;
        return $table;
    }

    public function getTableData($data, $tableId, $perPage, $offset)
    {
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
    }

    public function data($data, $tableId, $defaultSorting, $disableCache, $limit)
    {
        return $this->getPosts($tableId);
    }

    public function getPosts($tableId)
    {
        $columns = array_map(function ($column) {
            return $column['original_name'];
        }, get_post_meta($tableId, '_ninja_table_columns', true));

        $where = get_post_meta($tableId, '_ninja_table_wpposts_ds_where', true);

        $post_types = get_post_meta($tableId, '_ninja_table_wpposts_ds_post_types', true);

        return $this->buildWPQuery(
            compact('columns', 'where', 'post_types')
        );
    }
}
