<?php

namespace NinjaTable\FrontEnd\DataProviders;

use League\Csv\Reader;

class CsvProvider
{
	public function boot()
	{
		add_filter('ninja_tables_fetching_table_rows_csv', array($this, 'data'), 10, 5);
	}

	public function data($data, $tableId, $defaultSorting, $disableCache, $limit)
	{
		// The following url will be an empty string in real, using one for testing
		$url = 'https://docs.google.com/spreadsheets/d/1c6SgWh5SgIErKFXbHYeMLtz6LPHHlAWjmXGVPZd7LKk/pub?output=csv';

		$url = sanitize_title(
	        get_post_meta($tableId, 'ninja_tables_data_provider_url', true), $url, 'display'
	    );

	    // TODO: Maybe validate url first

	    return $url ? $this->getDataFromCsv($tableId, $url) : $data;
	}

	protected function getDataFromCsv($tableId, $url)
	{
		$columns = array();
		foreach(ninja_table_get_table_columns($tableId) as $column) {
			// Should be original_name instead of name
			$columns[$column['name']] = $column;
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
