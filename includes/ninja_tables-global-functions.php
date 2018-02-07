<?php
/**
 * Globally-accessible functions
 *
 * @link           https://authlab.io
 * @since          1.0.0
 *
 * @package        wp_table_data_press
 * @subpackage     wp_table_data_press/includes
 *
 * @param        $tableId
 * @param string $scope
 *
 * @return array
 */
if( ! function_exists('ninja_table_get_table_columns')) {
    function ninja_table_get_table_columns($tableId, $scope = 'public')
    {
        $tableColumns = get_post_meta($tableId, '_ninja_table_columns', true);
        if ( ! $tableColumns || ! is_array($tableColumns)) {
            $tableColumns = array();
        }

        return apply_filters('ninja_get_table_columns_' . $scope, $tableColumns,
            $tableId);
    }
}

if( ! function_exists('ninja_table_get_table_settings')) {
    function ninja_table_get_table_settings($tableId, $scope = 'public')
    {
        $tableSettings = get_post_meta($tableId, '_ninja_table_settings', true);
        if ( ! $tableSettings) {
            $tableSettings = array();
        }
        $settings = array_merge(getDefaultNinjaTableSettings(), $tableSettings);

        return apply_filters('ninja_get_table_settings_' . $scope, $settings,
            $tableId);
    }
}

if( ! function_exists('getDefaultNinjaTableSettings')) {
    function getDefaultNinjaTableSettings()
    {
        $defaults = array(
            "perPage"         => 20,
            "show_all"        => false,
            "library"         => 'footable',
            "css_lib"         => 'bootstrap3',
            "enable_ajax"     => false,
            "css_classes"     => array(),
            "enable_search"   => true,
            "column_sorting"  => true,
            "default_sorting" => 'new_first',
            "table_color"     => ''
        );

        return apply_filters('get_default_ninja_table_settings', $defaults);
    }
}

if( ! function_exists('ninja_table_admin_role')) {
    function ninja_table_admin_role()
    {
        return apply_filters('ninja_table_admin_role', 'manage_options');
    }
}

if( ! function_exists('ninja_tables_db_table_name')) {
    function ninja_tables_db_table_name()
    {
        return 'ninja_table_items';
    }
}

if( ! function_exists('ninja_tables_DbTable')) {
    function ninja_tables_DbTable()
    {
        return ninjaDB(ninja_tables_db_table_name());
    }
}

if( ! function_exists('ninja_table_renameDuplicateValues') ) {
    function ninja_table_renameDuplicateValues($values)
    {
        $result = array();

        $scale = array_count_values(array_unique($values));

        foreach ($values as $item) {
            if ($scale[$item] == 1) {
                $result[] = $item;
            } else {
                $result[] = $item . '-' . $scale[$item];
            }

            $scale[$item]++;
        }

        return $result;
    }
}
if( ! function_exists('ninja_table_is_in_production_mood') ) {
	function ninja_table_is_in_production_mood() {
		return apply_filters('ninja_table_is_in_production_mood', false);
	}
}