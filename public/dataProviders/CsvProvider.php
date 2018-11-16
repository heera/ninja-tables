<?php

namespace NinjaTable\FrontEnd\DataProviders;

use League\Csv\Reader;

class CsvProvider
{
    public function boot()
    {
        add_filter('ninja_tables_get_table_google-csv', array($this, 'getTableSettings'));
        add_filter('ninja_tables_get_table_csv', array($this, 'getTableSettings'));
        add_filter('ninja_tables_get_table_data_google-csv', array($this, 'getTableData'), 10, 4);
        add_filter('ninja_tables_get_table_data_csv', array($this, 'getTableData'), 10, 4);
        add_filter('ninja_tables_fetching_table_rows_csv', array($this, 'data'), 10, 2);
    }

    public function getTableSettings($table)
    {
        $table->isEditable = false;
        $table->dataSourceType = get_post_meta($table->ID, '_ninja_tables_data_provider', true);
        $table->remoteURL = get_post_meta($table->ID, '_ninja_tables_data_provider_url', true);
        $table->isEditableMessage = 'You may edit your table settings here.';
        $table->isExportable = false;
        $table->isImportable = false;
        $table->isSortable = false;
        $table->hasCacheFeature = false;
        $table->isCreatedSortable = false;
        $table->hasExternalCachingInterval = true;
        return $table;
    }

    public function getTableData($data, $tableId, $perPage, $offset)
    {
        $cachedData = ninjaTableGetExternalCachedData($tableId);
        if ($cachedData) {
            return array(
                array_slice($cachedData, $offset, $perPage),
                count($cachedData)
            );
        }

        $newData = array();
        $url = get_post_meta($tableId, '_ninja_tables_data_provider_url', true);
        foreach ($this->getDataFromCsv($tableId, $url) as $key => $value) {
            $newData[] = array(
                'id' => ++$key,
                'values' => $value,
                'position' => $key,
            );
        }
        ninjaTableSetExternalCacheData($tableId, $newData);
        return array(
            array_slice($newData, $offset, $perPage),
            count($newData)
        );
    }

    public function data($data, $tableId)
    {
        $cachedData = ninjaTableGetExternalCachedData($tableId);
        if ($cachedData) {
           return $cachedData;
        }

        $url = get_post_meta($tableId, '_ninja_tables_data_provider_url', true);

        return $url ? $this->getDataFromCsv($tableId, $url) : $data;
    }

    protected function getDataFromCsv($tableId, $url)
    {
        $columns = array();
        foreach (ninja_table_get_table_columns($tableId) as $column) {
            $columns[$column['original_name']] = $column;
        }

        return array_map(function ($row) use ($columns) {
            $newRow = array();
            foreach ($columns as $key => $column) {
                $newRow[$column['key']] = $row[$key];
            }
            return $newRow;
        }, $this->csvToArray($url));
    }

    protected function csvToArray($url)
    {
        $reader = Reader::createFromString(file_get_contents($url));

        $data = array();
        $header = $reader->fetchOne();
        foreach ($reader->setOffset(1)->fetch() as $row) {
            $data[] = array_combine($header, $row);
        }

        return $data;
    }
}
