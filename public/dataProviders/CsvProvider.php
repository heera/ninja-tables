<?php

namespace NinjaTable\FrontEnd\DataProviders;

use NinjaTable\FrontEnd\DataProviders\ParseCsvToArray;

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

	protected function csvToArray($url, $delimiter = ',')
	{
	    $header = NULL;
	    $data = array();
	    if (($handle = fopen($url, 'r')) !== FALSE) {
	        while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE) {
	            if(!$header) {
	            	$header = $row;
	            } else {
	            	$data[] = array_combine($header, $row);
	            }
	        }
	        fclose($handle);
	    }

	    return array($header, $data);
	}

	protected function getDataFromCsv($tableId, $url, $delimiter = ',')
	{
		$columns = array();
		foreach(ninja_table_get_table_columns($tableId) as $column) {
			// Should be original_name instead of name
			$columns[$column['name']] = $column;
		}

		list($header, $data) = $this->csvToArray($url);

		if ($data) {
			return array_map(function($row) use ($columns) {
				$newRow = array();
				foreach ($columns as $key => $column) {
					$newRow[$column['key']] = $row[$key];
				}
				return $newRow;
			}, $data);
		}
	}
}
