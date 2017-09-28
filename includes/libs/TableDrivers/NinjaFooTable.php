<?php namespace NinjaTable\TableDrivers;

class NinjaFooTable
{
    public static $version = '1.0';
    
    public static function run($tableArray)
    {
        self::enqueue_assets();
        self::render($tableArray);
    }

    private static function enqueue_assets()
    {
        $min = '';
        if (defined('WP_DEBUG') && WP_DEBUG) {
            $min = '.min';
        }
        
        wp_enqueue_script('footable',
            NINJA_TABLES_PUBLIC_DIR_URL . "libs/footable/js/footable{$min}.js",
            array('jquery'), '3.1.5', true);
        wp_enqueue_script('footable_init',
            NINJA_TABLES_PUBLIC_DIR_URL . "js/ninja-tables-footable{$min}.js",
            array('footable'), self::$version, true);
        
        wp_enqueue_style('footable', NINJA_TABLES_PUBLIC_DIR_URL
                                     . "libs/footable/css/footable.standalone{$min}.css",
            array(), '3.1.5', 'all');
        wp_enqueue_style('footable_styles',
            NINJA_TABLES_PUBLIC_DIR_URL . "css/ninja-tables-public{$min}.css",
            array(), self::$version, 'all');
    }

    private static function render($tableArray)
    {
        extract($tableArray);
        
        if ( ! count($columns)) {
            return;
        }
        
        $formatted_columns = [];

        foreach ($columns as $column) {
            $formatted_columns[] = array(
                'name'        => $column['key'],
                'title'       => $column['name'],
                'breakpoints' => $column['breakpoints']
            );
        }


        if ($settings['show_all']) {
            $pagingSettings = false;
        } else {
            $pagingSettings = ($settings['perPage']) ? $settings['perPage']
                : 20;
        }

        $configSettings = array(
            'filtering' => (isset($settings['enable_search']))
                ? $settings['enable_search'] : false,
            'paging'    => $pagingSettings,
            'sorting'   => (isset($settings['column_sorting']))
                ? $settings['column_sorting'] : false,
        );


        $table_classes = self::getTableCssClass($settings);
        ?>

        <div id="footable_parent_<?php echo $table_id; ?>"
             class="footable_parent wp_table_data_press_parent <?php echo $settings['css_lib']; ?>">

            <?php if (isset($settings['show_title'])
                      && $settings['show_title']
            ) : ?>
                <?php do_action('ninja_tables_before_table_title', $table); ?>
                <h3 class="table_title footable_title"><?php echo $table->post_title; ?></h3>
                <?php do_action('ninja_tables_after_table_title', $table); ?>
            <?php endif; ?>
            <?php if (isset($settings['show_description'])
                      && $settings['show_description']
            ) : ?>
                <?php do_action('ninja_tables_before_table_description',
                    $table); ?>
                <div class="table_description footable_description"><?php echo $table->post_content; ?></div>
                <?php do_action('ninja_tables_after_table_description',
                    $table); ?>
            <?php endif; ?>

            <?php do_action('ninja_tables_before_table_print', $table); ?>

            <table data-config_settings='<?php echo json_encode($configSettings); ?>'
                   data-columns='<?php echo json_encode($formatted_columns,
                       true); ?>' data-footable_id="<?php echo $table_id; ?>"
                   id="footable_<?php echo $table_id; ?>"
                   class=" foo-table foo_table_<?php echo $table_id; ?> <?php echo $table_classes; ?>"
            >
            </table>
            <?php do_action('ninja_tables_after_table_print', $table); ?>
        </div>

        <?php
    }

    private static function getTableCssClass($settings)
    {
        $baseClass      = self::getTableClassByLib($settings['css_lib']);
        $userClass      = (isset($settings['extra_css_class']))
            ? $settings['extra_css_class'] : '';
        $colorClass     = (isset($settings['table_color']))
            ? $settings['table_color'] : '';
        $definedClass   = implode(' ', $settings['css_classes']);
        $concatClasses  = $baseClass . ' ' . $userClass . ' ' . $definedClass
                          . ' ' . $colorClass;
        $classArray     = explode(' ', $concatClasses);
        $uniqueCssArray = array_unique($classArray);

        return implode(' ', $uniqueCssArray);
    }

    private static function getTableClassByLib($lib = 'bootstrap3')
    {
        switch ($lib) {
            case 'bootstrap3':
            case 'bootstrap4':
                return 'table';
            case 'semantic_ui':
                return 'ui table';
            default:
                return '';
        }
    }
}