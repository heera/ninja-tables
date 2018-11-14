<?php

namespace NinjaTable\FrontEnd\DataProviders;

use League\Csv\Reader;

class CsvProvider
{
	public function boot()
	{
		add_filter('ninja_tables_get_table_settings', array($this, 'getTableSettings'));
		add_filter('ninja_tables_get_table_data', array($this, 'getTableData'), 10, 4);
		add_filter('ninja_tables_fetching_table_rows_csv', array($this, 'data'), 10, 5);
	}

	public function getTableSettings($table)
	{
		try {
			$provider = sanitize_title(
				get_post_meta($table->ID, '_ninja_tables_data_provider', true), 'default', 'display'
			);

			if (in_array($provider, array('csv', 'google-csv'))) {
				$table->isEditable = false;
				$table->dataSourceType = 'external';
				$table->remoteURL = get_post_meta($table->ID, '_ninja_tables_data_provider_url', true);
				$table->isEditableMessage = 'Have you made any changes to the remote file? You can easily get the latest updates in your table here. Simply click the Sync Settings button.';
                $table->isExportable = false;
                $table->isImportable = false;
                $table->isSortable = false;
                $table->hasCacheFeature = false;
                $table->hasExternalCachingInterval = true;
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

			if (!in_array($provider, array('csv', 'google-csv'))) {
				return $data;
			}


            $cachedData = ninjaTableGetExternalCachedData($tableId);
            if($cachedData) {
                return array(
                    array_slice($cachedData, $offset, $perPage),
                    count($cachedData )
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

			ninjaTableSetExternalCacheData( $tableId, $newData );

			return array(
                array_slice( $newData, $offset, $perPage ),
                count( $newData )
            );
		} catch (\Exception $e) {
			return $data;
		}
	}

	public function data($data, $tableId, $defaultSorting, $disableCache, $limit)
	{
		$url = get_post_meta($tableId, '_ninja_tables_data_provider_url', true);

	    return $url ? $this->getDataFromCsv($tableId, $url) : $data;
	}

	protected function getDataFromCsv($tableId, $url)
	{
		$columns = array();
		foreach(ninja_table_get_table_columns($tableId) as $column) {
			$columns[$column['original_name']] = $column;
		}

		return array_map(function($row) use ($columns) {
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
