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
if (!function_exists('ninja_table_get_table_columns')) {
    function ninja_table_get_table_columns($tableId, $scope = 'public')
    {
        $tableColumns = get_post_meta($tableId, '_ninja_table_columns', true);
        if (!$tableColumns || !is_array($tableColumns)) {
            $tableColumns = [];
        }

        return apply_filters(
            'ninja_get_table_columns_'.$scope,
            $tableColumns,
            $tableId
        );
    }
}

if (!function_exists('ninja_table_get_table_settings')) {
    function ninja_table_get_table_settings($tableId, $scope = 'public')
    {
        $tableSettings = get_post_meta($tableId, '_ninja_table_settings', true);
        if (!$tableSettings) {
            $tableSettings = [];
        }
        $settings = array_merge(getDefaultNinjaTableSettings(), $tableSettings);

        return apply_filters(
            'ninja_get_table_settings_'.$scope,
            $settings,
            $tableId
        );
    }
}

if (!function_exists('getDefaultNinjaTableSettings')) {
    function getDefaultNinjaTableSettings()
    {
        $defaults = [
            'perPage'         => 20,
            'show_all'        => false,
            'library'         => 'footable',
            'css_lib'         => 'bootstrap3',
            'enable_ajax'     => false,
            'css_classes'     => [],
            'enable_search'   => true,
            'column_sorting'  => true,
            'default_sorting' => 'new_first',
            'table_color'     => ''
        ];

        return apply_filters('get_default_ninja_table_settings', $defaults);
    }
}

if (!function_exists('ninja_table_admin_role')) {
    function ninja_table_admin_role()
    {
        return apply_filters('ninja_table_admin_role', 'manage_options');
    }
}

if (!function_exists('ninja_tables_db_table_name')) {
    function ninja_tables_db_table_name()
    {
        return 'ninja_table_items';
    }
}

if (!function_exists('ninja_tables_DbTable')) {
    function ninja_tables_DbTable()
    {
        return ninjaDB(ninja_tables_db_table_name());
    }
}

if (!function_exists('ninja_table_renameDuplicateValues')) {
    function ninja_table_renameDuplicateValues($values)
    {
        $result = [];

        $scale = array_count_values(array_unique($values));

        foreach ($values as $item) {
            if ($scale[$item] == 1) {
                $result[] = $item;
            } else {
                $result[] = $item.'-'.$scale[$item];
            }

            $scale[$item]++;
        }

        return $result;
    }
}
if (!function_exists('ninja_table_is_in_production_mood')) {
    function ninja_table_is_in_production_mood()
    {
        return apply_filters('ninja_table_is_in_production_mood', false);
    }
}

function ninjaTablesGetTablesDataByID($tableId, $defaultSorting = false)
{
    $query = ninja_tables_DbTable()->where('table_id', $tableId);
    if ($defaultSorting == 'new_first') {
        $query->orderBy('id', 'desc');
    } else {
        $query->orderBy('id', 'asc');
    }
    $data = $query->get();
    $formatted_data = [];
    foreach ($data as $item) {
        $values = json_decode($item->value, true);
        $values = array_map('do_shortcode', $values);
        $formatted_data[] = $values;
    }

    // Please do not hook this filter unless you don't know what you are doing.
    // Hook ninja_tables_get_public_data instead.
    // You should hook this if you need to cache your filter modifications
    $formatted_data = apply_filters('ninja_tables_get_raw_table_data', $formatted_data, $tableId);

    $disableCache = apply_filters('ninja_tables_disable_caching', false, $tableId);
    if (!$disableCache) {
        update_post_meta($tableId, '_ninja_table_cache_object', $formatted_data);
    }

    return $formatted_data;
}

function ninjaTablesClearTableDataCache($tableId)
{
    return update_post_meta($tableId, '_ninja_table_cache_object', false);
}

/**
 * Get the character map for different languages.
 *
 * @return array $charMap
 */
function ninjaTablesGetCharMap()
{
    $charMap = [
        // Latin
        'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A', 'Æ' => 'AE', 'Ç' => 'C',
        'È' => 'E', 'É' => 'E', 'Ê' => 'E', 'Ë' => 'E', 'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I',
        'Ð' => 'D', 'Ñ' => 'N', 'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O', 'Ő' => 'O',
        'Ø' => 'O', 'Ù' => 'U', 'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ű' => 'U', 'Ý' => 'Y', 'Þ' => 'TH',
        'ß' => 'ss',
        'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'ae', 'ç' => 'c',
        'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i',
        'ð' => 'd', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o', 'ö' => 'o', 'ő' => 'o',
        'ø' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ü' => 'u', 'ű' => 'u', 'ý' => 'y', 'þ' => 'th',
        'ÿ' => 'y',
        // Latin symbols
        '©' => '(c)',
        // Greek
        'Α' => 'A', 'Β' => 'B', 'Γ' => 'G', 'Δ' => 'D', 'Ε' => 'E', 'Ζ' => 'Z', 'Η' => 'H', 'Θ' => '8',
        'Ι' => 'I', 'Κ' => 'K', 'Λ' => 'L', 'Μ' => 'M', 'Ν' => 'N', 'Ξ' => '3', 'Ο' => 'O', 'Π' => 'P',
        'Ρ' => 'R', 'Σ' => 'S', 'Τ' => 'T', 'Υ' => 'Y', 'Φ' => 'F', 'Χ' => 'X', 'Ψ' => 'PS', 'Ω' => 'W',
        'Ά' => 'A', 'Έ' => 'E', 'Ί' => 'I', 'Ό' => 'O', 'Ύ' => 'Y', 'Ή' => 'H', 'Ώ' => 'W', 'Ϊ' => 'I',
        'Ϋ' => 'Y',
        'α' => 'a', 'β' => 'b', 'γ' => 'g', 'δ' => 'd', 'ε' => 'e', 'ζ' => 'z', 'η' => 'h', 'θ' => '8',
        'ι' => 'i', 'κ' => 'k', 'λ' => 'l', 'μ' => 'm', 'ν' => 'n', 'ξ' => '3', 'ο' => 'o', 'π' => 'p',
        'ρ' => 'r', 'σ' => 's', 'τ' => 't', 'υ' => 'y', 'φ' => 'f', 'χ' => 'x', 'ψ' => 'ps', 'ω' => 'w',
        'ά' => 'a', 'έ' => 'e', 'ί' => 'i', 'ό' => 'o', 'ύ' => 'y', 'ή' => 'h', 'ώ' => 'w', 'ς' => 's',
        'ϊ' => 'i', 'ΰ' => 'y', 'ϋ' => 'y', 'ΐ' => 'i',
        // Turkish
        'Ş' => 'S', 'İ' => 'I', 'Ç' => 'C', 'Ü' => 'U', 'Ö' => 'O', 'Ğ' => 'G',
        'ş' => 's', 'ı' => 'i', 'ç' => 'c', 'ü' => 'u', 'ö' => 'o', 'ğ' => 'g',
        // Russian
        'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Д' => 'D', 'Е' => 'E', 'Ё' => 'Yo', 'Ж' => 'Zh',
        'З' => 'Z', 'И' => 'I', 'Й' => 'J', 'К' => 'K', 'Л' => 'L', 'М' => 'M', 'Н' => 'N', 'О' => 'O',
        'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T', 'У' => 'U', 'Ф' => 'F', 'Х' => 'H', 'Ц' => 'C',
        'Ч' => 'Ch', 'Ш' => 'Sh', 'Щ' => 'Sh', 'Ъ' => '', 'Ы' => 'Y', 'Ь' => '', 'Э' => 'E', 'Ю' => 'Yu',
        'Я' => 'Ya',
        'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'yo', 'ж' => 'zh',
        'з' => 'z', 'и' => 'i', 'й' => 'j', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o',
        'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't', 'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'c',
        'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sh', 'ъ' => '', 'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'yu',
        'я' => 'ya',
        // Ukrainian
        'Є' => 'Ye', 'І' => 'I', 'Ї' => 'Yi', 'Ґ' => 'G',
        'є' => 'ye', 'і' => 'i', 'ї' => 'yi', 'ґ' => 'g',
        // Czech
        'Č' => 'C', 'Ď' => 'D', 'Ě' => 'E', 'Ň' => 'N', 'Ř' => 'R', 'Š' => 'S', 'Ť' => 'T', 'Ů' => 'U',
        'Ž' => 'Z',
        'č' => 'c', 'ď' => 'd', 'ě' => 'e', 'ň' => 'n', 'ř' => 'r', 'š' => 's', 'ť' => 't', 'ů' => 'u',
        'ž' => 'z',
        // Polish
        'Ą' => 'A', 'Ć' => 'C', 'Ę' => 'e', 'Ł' => 'L', 'Ń' => 'N', 'Ó' => 'o', 'Ś' => 'S', 'Ź' => 'Z',
        'Ż' => 'Z',
        'ą' => 'a', 'ć' => 'c', 'ę' => 'e', 'ł' => 'l', 'ń' => 'n', 'ó' => 'o', 'ś' => 's', 'ź' => 'z',
        'ż' => 'z',
        // Latvian
        'Ā' => 'A', 'Č' => 'C', 'Ē' => 'E', 'Ģ' => 'G', 'Ī' => 'i', 'Ķ' => 'k', 'Ļ' => 'L', 'Ņ' => 'N',
        'Š' => 'S', 'Ū' => 'u', 'Ž' => 'Z',
        'ā' => 'a', 'č' => 'c', 'ē' => 'e', 'ģ' => 'g', 'ī' => 'i', 'ķ' => 'k', 'ļ' => 'l', 'ņ' => 'n',
        'š' => 's', 'ū' => 'u', 'ž' => 'z',
    ];

    return apply_filters('ninja_tables_char_map', $charMap);
}
