<?php
/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://wpmanageninja.com
 * @since             1.0.0
 * @package           ninja-tables
 *
 * @wordpress-plugin
 * Plugin Name:       Ninja Tables
 * Plugin URI:        https://wpmanageninja.com/plugins/ninja-tables/
 * Description:       The Easiest & Fastest Responsive Table Plugin on WordPress. Multiple templates, drag-&-drop live table builder, multiple color scheme, and styles.
 * Version:           2.1.2
 * Author:            WPManageNinja
 * Author URI:        https://wpmanageninja.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       ninja-tables
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

define('NINJA_TABLES_DIR_URL', plugin_dir_url(__FILE__));
define('NINJA_TABLES_DIR_PATH', plugin_dir_path(__FILE__));
define('NINJA_TABLES_PUBLIC_DIR_URL', NINJA_TABLES_DIR_URL.'public/');
define('NINJA_TABLES_VERSION', '2.1.2');
define('NINJA_TABLES_ASSET_VERSION', '2.1');

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/NinjaTablesActivator.php
 */
function activate_ninja_tables()
{
    require_once plugin_dir_path(__FILE__).'includes/NinjaTablesActivator.php';
    NinjaTablesActivator::activate();
}


register_activation_hook(__FILE__, 'activate_ninja_tables');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__).'includes/NinjaTableClass.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_ninja_tables()
{
    $plugin = new NinjaTableClass();
    $plugin->run();
}

// kick off
run_ninja_tables();

//add_filter('ninja_tables_disable_caching', function ($status) {
//	return true;
//});



// paste the code in functions.php file
add_shortcode( 'francesco_username_table_filter', function($atts) {

	extract(shortcode_atts( array(
		'table_id' => false,
		'logged_in_only' => 1
	), $atts ));


	if($logged_in_only) {
		$userId = get_current_user_id();
		if(!$userId) {
			return '';
		}
		$currentUser = get_user_by('ID', $userId);
		
		ob_start();
		echo do_shortcode('[ninja_tables id="'.$table_id.'" filter="'.$currentUser->user_login.'"]');
		return ob_get_clean();
	}
});


// usage:
// shortcode: [francesco_username_table_filter table_id="1"]
// then it will filter only the loggedin user's username by default