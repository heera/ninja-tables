<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://authlab.io
 * @since      1.0.0
 *
 * @package    ninja_tables
 * @subpackage ninja-tables/public
 */
/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    ninjat-ables
 * @subpackage ninja-tables/public
 * @author     Shahjahan Jewel <cep.jewel@gmail.com>
 */
class NinjaTablePublic {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {
		$this->plugin_name = $plugin_name;
		$this->version = $version;
	}
	
	public function register_ajax_routes() {
		$validRoutes = array(
			'get-all-data'    => 'getAllData',
		);
		
		$requestedRoute = esc_attr($_REQUEST['target_action']);

		if (isset($validRoutes[$requestedRoute])) {
			$this->{$validRoutes[$requestedRoute]}();
		}
		wp_die();
	}

	public function getAllData()
	{
		$tableId = intval($_REQUEST['table_id']);
		$defaultSorting = sanitize_text_field($_REQUEST['default_sorting']);
		$query = ninja_tables_DbTable()->where('table_id', $tableId);
		
		if($defaultSorting == 'new_first') {
			$query->orderBy('id', 'desc');
		}
		
		$data = $query->get();
		
		$formatted_data = array();
		foreach ($data as $item) {
			 $values = json_decode($item->value, true);
			 $values = array_map('do_shortcode', $values);
			 $formatted_data[] = $values;
		}
		
		$formatted_data = apply_filters('ninja_tables_get_public_data', $formatted_data, $tableId);
		
		wp_send_json($formatted_data, 200);
		wp_die();
	}
    
	public function register_table_render_functions() {
		// register the shortcode 
		$shortCodeBase = apply_filters('ninja_tables_shortcode_base', 'ninja_tables');
		add_shortcode( $shortCodeBase, array($this, 'render_ninja_table_shortcode'));
	}
	
	public function render_ninja_table_shortcode($atts) {
		
		extract(shortcode_atts(array(
			'id' => false,
			'per_page' => 20,
			'hidden_fields' => false,
			'table_type' => 'footable',
			'extra_class' => 'table',
            'enable_search' => true,
            'enable_sorting' => true
		), $atts));
		
		$table_id = $id;
		
		if(!$table_id) {
		    return;
        }

		$table = get_post($table_id);
		$tableColumns = ninja_table_get_table_columns($table_id, 'public');
		$tableSettings = ninja_table_get_table_settings($table_id, 'public');
		if(!$tableColumns || !$tableSettings || !$table) {
		    return;
        }
        
		$tableArray = array(
		    'table_id' => $table_id,
			'columns' => $tableColumns,
			'settings' => $tableSettings,
			'table' => $table
		);
		ob_start();
		do_action('ninja_tables-render-table-'.$tableSettings['library'], $tableArray);
		return ob_get_clean();
	}
}
