<?php

namespace NinjaTable\FrontEnd\DataProviders;

trait ParseCsvToArray
{
	public function csvToArray($url, $delimiter = ',')
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

	public function getDataFromCsv($tableId, $url, $delimiter = ',')
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
