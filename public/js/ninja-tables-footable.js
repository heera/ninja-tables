/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 214);
/******/ })
/************************************************************************/
/******/ ({

/***/ 214:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(215);


/***/ }),

/***/ 215:
/***/ (function(module, exports) {

jQuery(document).ready(function ($) {
    var footables = $('.foo-table');
    $.each(footables, function (footable, table) {
        var $table = $(table);
        var tableConfig = {
            table_id: $table.data('footable_id'),
            columns: $table.data('columns'),
            settings: $table.data('config_settings')
        };
        initFooTable($table, tableConfig);
    });

    function initFooTable($table, tableConfig) {
        var initConfig = {
            "cascade": true,
            "columns": tableConfig.columns,
            "rows": $.get('/wp-admin/admin-ajax.php?action=wp_ajax_ninja_tables_public_action&table_id=' + tableConfig.table_id + '&target_action=get-all-data')
        };

        initConfig.sorting = {
            "enabled": tableConfig.settings.sorting
        };

        initConfig.filtering = {
            "enabled": tableConfig.settings.filtering,
            "delay": 1,
            "dropdownTitle": "Search in:",
            "connectors": false
        };

        initConfig.paging = {
            "enabled": !!tableConfig.settings.paging,
            "position": "right",
            "size": tableConfig.settings.paging,
            "container": "#footable_parent_" + tableConfig.table_id + " .paging-ui-container"
        };

        $table.footable(initConfig);
    }
});

/***/ })

/******/ });