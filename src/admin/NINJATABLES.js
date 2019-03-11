import Vue from './elements';
import Router from 'vue-router';
Vue.use(Router);

import { applyFilters, addFilter, addAction, doAction } from '@wordpress/hooks';

export default class NINJATABLE {
    constructor() {
        this.applyFilters = applyFilters;
        this.addFilter = addFilter;
        this.addAction = addAction;
        this.doAction = doAction;
        this.Vue = Vue;
        this.Router = Router;
    }

    registerBlock(blockLocation, blockName, block) {
        addFilter(blockLocation, 'ninja_table', function (components) {
            components[blockName] = block;
            return components;
        });
    }

    registerTopMenu(title, route) {
        // Maybe we need some validation here for the provided route
        addFilter('ninja_table_top_menus', 'ninja_table', function (menus) {
            menus.push({
                route: route.name,
                title: title
            });
            return menus;
        });

        addFilter('ninja_table_global_routes', 'ninja_table', function (routes) {
            routes.push(route);
            return routes;
        });
    }

    registerTableTabs(title, route) {
        // Maybe we need some validation here for the provided route
        addFilter('ninja_table_table_tabs', 'ninja_table', function (menus) {
            menus.push({
                route: route.name,
                title: title
            });
            return menus;
        });

        addFilter('ninja_table_global_routes', 'ninja_table', function (routes) {
            routes.push(route);
            return routes;
        });
    }

    $get(options) {
        return window.jQuery.get(window.ajaxurl, options);
    }

    $post(options) {
        return window.jQuery.post(window.ajaxurl, options);
    }

    $getJSON(options) {
        return window.jQuery.getJSON(window.ajaxurl, options);
    }
}
