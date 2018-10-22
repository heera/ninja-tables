<?php

namespace NinjaTable\FrontEnd\DataProviders;

use League\Csv\Reader;

class CsvProvider
{
	public function boot()
	{
		add_filter('ninja_tables_get_table_data', array($this, 'getTableData'), 10, 2);
		add_filter('ninja_tables_fetching_table_rows_csv', array($this, 'data'), 10, 5);
	}

	public function getTableData($data, $tableId)
	{
		try {
			$url = get_post_meta($tableId, '_ninja_tables_data_provider_url', true);
		
			foreach ($this->getDataFromCsv($tableId, $url) as $key => $value) {
				$response[] = array(
					'id' => ++$key,
					'values' => $value,
					'position' => null,
				);
			}

			return $response ? $response : $data;
			
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
