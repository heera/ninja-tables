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
/******/ 	return __webpack_require__(__webpack_require__.s = 228);
/******/ })
/************************************************************************/
/******/ ({

/***/ 228:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(229);


/***/ }),

/***/ 229:
/***/ (function(module, exports) {

jQuery(document).ready(function ($) {
    var ninja_table_app = {
        initTables: function initTables() {
            var footables = $('table.foo-table.ninja_footable');
            var that = this;
            $.each(footables, function (footable, table) {
                var $table = $(table);
                var tableId = $table.data('footable_id');
                var tableConfig = window.ninja_footables.tables['table_' + tableId];
                that.initResponsiveTable($table, tableConfig);
            });
        },
        initResponsiveTable: function initFooTable($table, tableConfig) {
            var initConfig = {
                "cascade": true,
                "columns": tableConfig.columns,
                "rows": $.get(window.ninja_footables.ajax_url + '?action=wp_ajax_ninja_tables_public_action&table_id=' + tableConfig.table_id + '&target_action=get-all-data')
            };

            initConfig.sorting = {
                "enabled": !!tableConfig.settings.sorting
            };
            initConfig.filtering = {
                "enabled": !!tableConfig.settings.filtering,
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
    };
    ninja_table_app.initTables();
});

/***/ })

/******/ });