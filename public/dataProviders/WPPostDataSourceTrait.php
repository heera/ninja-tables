<?php

namespace NinjaTable\FrontEnd\DataProviders;

trait WPPostDataSourceTrait
{
    private $__queryable_postColumns__ = array();

    private $acf_installed = false;

    public function buildWPQuery($data)
    {
        $columns = isset($data['formatted_columns']) ? $data['formatted_columns'] : array();

        $whereClauses = isset($data['where']) ? $data['where'] : array();

        $postTypes = isset($data['post_types']) ? $data['post_types'] : array();

        $args = array('post_type' => $postTypes, 'posts_per_page' => -1);

        $args = $this->buildQueryArgsForPostFields($args, $whereClauses);

        $args = $this->buildQueryArgsForTaxonomies($args, $whereClauses);

        $posts = (new \WP_Query($args))->posts;

        $formattedPosts = array();

        foreach ($posts as $post_index => $post) {
            $data = array();
            foreach ($columns as $column_key => $column) {
                if ($column['type'] == 'post_data') {
                    $data[$column_key] = $this->getPostData($post, $column);
                } else if ($column['type'] == 'tax_data') {
                    $data[$column_key] = $this->getTaxData($post, $column);
                } else if ($column['type'] == 'custom') {
                    $data[$column_key] = $this->getCustomData($post, $column);
                } else if ($column['type'] == 'author_data') {
                    $data[$column_key] = $this->getAuthorData($post, $column);
                }
            }
            $formattedPosts[] = $data;
        }
        return $formattedPosts;
    }

    public function buildQueryArgsForPostFields($args, $whereClauses)
    {
        $this->__queryable_postColumns__ = array_filter($whereClauses, function ($item) {
            return strpos($item['field'], '.') === false;
        });

        foreach ($this->__queryable_postColumns__ as $postColumn) {
            if ($postColumn['field'] == 'post_status') {
                if ($postColumn['operator'] == 'NOT IN') {
                    $postStatuses = array_map(function ($status) {
                        return $status['key'];
                    }, ninjaTablesGetPostStatuses());
                    $postColumn['value'] = array_diff(
                        $postStatuses, $postColumn['value']
                    );
                }
                $args['post_status'] = $postColumn['value'];
            } else if ($postColumn['field'] == 'post_author') {
                $operator = $postColumn['operator'];
                if ($operator == 'IN') {
                    $operator = 'author__in';
                } else if ($operator == 'NOT IN') {
                    $operator = 'author__not_in';
                }
                $args[$operator] = $postColumn['value'];
            } else if ($postColumn['field'] == 'ID') {
                add_filter('posts_where', [$this, 'WPNinjaTablesPostWhereIDFilter']);
            } else if ($postColumn['field'] == 'post_date') {
                add_filter('posts_where', [$this, 'WPNinjaTablesPostWherePostDateFilter']);
            } else if ($postColumn['field'] == 'post_modified') {
                add_filter('posts_where', [$this, 'WPNinjaTablesPostWherePostModifiedFilter']);
            } else if ($postColumn['field'] == 'comment_count') {
                add_filter('posts_where', [$this, 'WPNinjaTablesPostWhereCommentCountFilter']);
            }
        }

        return $args;
    }

    public function WPNinjaTablesPostWhereIDFilter($where)
    {
        global $wpdb;

        remove_filter(current_filter(), [$this, __FUNCTION__]);

        foreach ($this->__queryable_postColumns__ as $column) {
            if ($column['field'] == 'ID') {
                $where .= " AND {$wpdb->posts}.ID {$column['operator']} {$column['value']}";
            }
        }

        return $where;
    }

    public function WPNinjaTablesPostWherePostDateFilter($where)
    {
        global $wpdb;

        remove_filter(current_filter(), [$this, __FUNCTION__]);

        foreach ($this->__queryable_postColumns__ as $column) {
            if ($column['field'] == 'post_date') {
                $where .= " AND {$wpdb->posts}.post_date {$column['operator']} '{$column['value']}'";
            }
        }

        return $where;
    }

    public function WPNinjaTablesPostWherePostModifiedFilter($where)
    {
        global $wpdb;

        remove_filter(current_filter(), [$this, __FUNCTION__]);

        foreach ($this->__queryable_postColumns__ as $column) {
            if ($column['field'] == 'post_modified') {
                $where .= " AND {$wpdb->posts}.post_modified {$column['operator']} '{$column['value']}'";
            }
        }

        return $where;
    }

    public function WPNinjaTablesPostWhereCommentCountFilter($where)
    {
        global $wpdb;

        remove_filter(current_filter(), [$this, __FUNCTION__]);

        foreach ($this->__queryable_postColumns__ as $column) {
            if ($column['field'] == 'comment_count') {
                $where .= " AND {$wpdb->posts}.comment_count {$column['operator']} {$column['value']}";
            }
        }

        return $where;
    }

    public function buildQueryArgsForTaxonomies($args, $whereClauses)
    {
        $taxonomies = array_filter($whereClauses, function ($item) {
            return strpos($item['field'], '.') !== false;
        });

        if (!$taxonomies) {
            return $args;
        }

        $args['tax_query'] = array('relation' => 'AND');

        foreach ($taxonomies as $taxQuery) {
            $taxonomy = substr(
                $taxQuery['field'],
                strpos($taxQuery['field'], '.') + 1
            );

            $args['tax_query'][] = array(
                'field' => 'slug',
                'taxonomy' => $taxonomy,
                'terms' => $taxQuery['value'],
                'operator' => $taxQuery['operator']
            );
        }

        return $args;
    }

    public function getType($column)
    {
        $numericColumnsMap = array(
            'ID',
            'comment_count',
            'menu_order',
            'post_parent'
        );
        $dateColumnsMap = array(
            'post_date',
            'post_date_gmt',
            'post_modified',
            'post_modified_gmt'
        );

        if (in_array($column, $numericColumnsMap)) {
            return 'number';
        }

        if (in_array($column, $dateColumnsMap)) {
            return 'date';
        }

        return 'text';
    }

    public function getHumanName($column)
    {
        $trans = array(
            'post_author' => __('Author', 'ninja-tables'),
            'post_date' => __('Create Date', 'ninja-tables'),
            'post_content' => __('Content', 'ninja-tables'),
            'post_title' => __('Title', 'ninja-tables'),
            'post_excerpt' => __('Excerpt', 'ninja-tables'),
            'post_status' => __('Status', 'ninja-tables'),
            'comment_status' => __('Comment Status', 'ninja-tables'),
            'post_type' => __('Post Type', 'ninja-tables'),
            'comment_count' => __('Total Comments', 'ninja-tables')
        );

        if (isset($trans[$column])) {
            return $trans[$column];
        }
        return $column;
    }

    public function getSourceType($column)
    {
        if (strpos($column, '.')) {
            return 'tax_data';
        }
        return 'post_data';
    }

    private function getPostData($post, $column)
    {
        $original_name = $column['original_name'];
        $value = '';
        if (property_exists($post, $original_name)) {
            $value = $post->{$original_name};
        }
        if (!$value) {
            return '';
        }
        // Check if linkable
        if ($column['permalinked'] == 'yes') {
            $atts = '';
            if ($column['permalink_target'] == '_blank') {
                $atts = 'target="_blank"';
            }
            return '<a ' . $atts . ' title="' . $post->post_title . '" class="ninja_table_permalink" href="' . get_the_permalink($post) . '">' . $value . '</a>';
        }
        return $value;
    }

    private function getCustomData($post, $column)
    {
        $type = $column['wp_post_custom_data_type'];
        $value = $column['wp_post_custom_data_value'];
        if ($type == 'acf_field') {
            if ($this->acf_installed || function_exists('get_field')) {
                $this->acf_installed = true;
                return get_field($value, $post->ID);
            }
        } else if ($type == 'post_meta') {
            return get_post_meta($post->ID, $value, true);
        } else if ($type == 'shortcode') {
            // check for data types
            $codes = $this->getShortCodes($value, $post);
            if($codes) {
                $value = str_replace(array_keys($codes), array_values($codes), $value);
                return do_shortcode($value);
            }
        }
        return $value;
    }

    private function getShortCodes($string, $post) {
        $matches = array();
        $regex = "/\{([^\}]*)\}/";
        preg_match_all($regex, $string, $matches);
        if(count($matches) != 2) {
            return false;
        }
        $formats = array();

        $acceptedPrefixes = array(
            'acf',
            'post',
            'post_mata'
        );

        foreach ($matches[1] as $match) {
            $group = substr($match, 0, strpos($match, '.'));
            $fieldName = str_replace($group.'.', '',$match);
            $parseValue = '';
            if($group && $fieldName) {
                if($group == 'post') {
                    if(property_exists($post, $fieldName)) {
                        $parseValue = $post->{$fieldName};
                    }
                } else if($group == 'postmeta') {
                    $parseValue = get_post_meta($post->ID, $fieldName, true);
                } else if($group == 'acf' && function_exists('get_field' )) {
                    if($fieldName == 'test_3') {
                        $parseValue = get_field($fieldName, $post->ID);
                    }
                }
            }
            $formats['{'.$match.'}'] = $parseValue;
        }
        return $formats;
    }

    private function getTaxData($post, $column)
    {
        if (($pos = strpos($column['original_name'], '.')) !== false) {
            $atts = '';
            if ($column['permalinked'] == 'yes') {
                if ($column['filter_permalinked'] == 'yes') {
                    $atts = ' class="ninja_table_permalink ninja_table_do_column_filter" ';
                } else if ($column['permalink_target'] == '_blank') {
                    $atts = ' class="ninja_table_tax_permalink" target="_blank" ';
                } else {
                    $atts = ' class="ninja_table_tax_permalink" ';
                }
            }
            $terms = array_map(function ($term) use ($atts) {
                if ($atts) {
                    $link = get_term_link($term);
                    return "<a " . $atts . " href='{$link}'>{$term->name}</a>";
                }
                return $term->name;
            }, wp_get_post_terms($post->ID, substr($column['original_name'], $pos + 1)));
            return implode($column['taxonomy_separator'], $terms);
        }
    }

    private function getAuthorData($post, $column)
    {

        $atts = '';
        if ($column['permalinked'] == 'yes') {
            if ($column['filter_permalinked'] == 'yes') {
                $atts = ' class="ninja_table_author_permalink ninja_table_do_column_filter" ';
            } else if ($column['permalink_target'] == '_blank') {
                $atts .= ' class="ninja_table_author_permalink" target="_blank" ';
            } else {
                $atts .= ' class="ninja_table_author_permalink" ';
            }
        }

        $authorName = get_the_author_meta('display_name', $post->post_author);

        if ($atts && $authorName) {
            $authlink = get_author_posts_url($post->post_author);
            return '<a href="' . $authlink . '" ' . $atts . '>' . $authorName . '</a>';
        }
        return $authorName;
    }
}
