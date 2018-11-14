<?php

namespace NinjaTable\FrontEnd\DataProviders;

trait WPPostDataSourceTrait
{
    private $__queryable_postColumns__ = array();

    public function buildWPQuery($data)
    {
        $columns = isset($data['columns']) ? $data['columns'] : array();

        $whereClauses = isset($data['where']) ? $data['where'] : array();

        $postTypes = isset($data['post_types']) ? $data['post_types'] : array();

        $args = array('post_type' => $postTypes, 'posts_per_page' => -1);
        
        $args = $this->buildQueryArgsForPostFields($args, $whereClauses);

        $args = $this->buildQueryArgsForTaxonomies($args, $whereClauses);

        $posts = (new \WP_Query($args))->posts;

        return array_map(function($post) use ($columns) {
            $post = (array) $post;
            $post['id'] = $post['ID'];
            foreach ($columns as $column) {
               if (($pos = strpos($column, '.')) !== false) {
                    $terms = array_map(function($term) {
                        $link = get_term_link($term);
                        return "<a href='{$link}'>{$term->name}</a>";
                    }, wp_get_post_terms($post['ID'], substr($column, $pos + 1)));

                    $post[str_replace('.', '_', $column)] = implode(', ', $terms);
                } else if ($column == 'post_author') {
                    $authlink = get_author_posts_url($post['post_author']);
                    $authorName = get_the_author_meta('user_nicename' , $post['post_author']); 
                    $post['post_author'] = "<a href='{$authlink}'>{$authorName}</a>"; 
                }
            }
            return $post;
        }, $posts);
    }

    public function buildQueryArgsForPostFields($args, $whereClauses)
    {
        $this->__queryable_postColumns__ = array_filter($whereClauses, function($item) {
            return strpos($item['field'], '.') === false;
        });

        foreach ($this->__queryable_postColumns__ as $postColumn) {
            if ($postColumn['field'] == 'post_status') {
                if ($postColumn['operator'] == 'NOT IN') {
                    $postStatuses = array_map(function($status) {
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
        $taxonomies = array_filter($whereClauses, function($item) {
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
}