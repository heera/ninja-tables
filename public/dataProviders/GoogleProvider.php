<?php

namespace NinjaTable\FrontEnd\DataProviders;

use NinjaTable\FrontEnd\DataProviders\ParseCsvToArray;

class GoogleProvider
{
	use ParseCsvToArray;

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
}
