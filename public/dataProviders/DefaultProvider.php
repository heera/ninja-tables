<?php

namespace NinjaTable\FrontEnd\DataProviders;

class DefaultProvider
{
	public function boot()
	{
		add_filter('ninja_tables_fetching_table_rows_default', array($this, 'data'), 10, 5);
	}

	public function data($data, $tableId, $defaultSorting, $disableCache, $limit)
	{
		$query = ninja_tables_DbTable()->where('table_id', $tableId);

	    if ($defaultSorting == 'new_first') {
	        $query->orderBy('id', 'desc');
	    } else if ($defaultSorting == 'manual_sort') {
	        $query->orderBy('position', 'asc');
	    } else {
	        $query->orderBy('id', 'asc');
	    }

	    if($limit) {
		    $query->limit($limit);
	    }

	    foreach ($query->get() as $item) {
	        $values = json_decode($item->value, true);
	        $values = array_map('do_shortcode', $values);
	        $data[] = $values;
	    }

	    // Please do not hook this filter unless you don't know what you are doing.
	    // Hook ninja_tables_get_public_data instead.
	    // You should hook this if you need to cache your filter modifications
	    $data = apply_filters('ninja_tables_get_raw_table_data', $data, $tableId);

	    if (!$disableCache) {
	        update_post_meta($tableId, '_ninja_table_cache_object', $data);
	    }

	    return $data;
	}
}