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
/******/ 	return __webpack_require__(__webpack_require__.s = 462);
/******/ })
/************************************************************************/
/******/ ({

/***/ 462:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(463);


/***/ }),

/***/ 463:
/***/ (function(module, exports) {

eval("jQuery(document).ready(function ($) {\n    var ninja_table_app = {\n        initTables: function initTables() {\n            var footables = $('table.foo-table.ninja_footable');\n            var that = this;\n            $.each(footables, function (footable, table) {\n                var $table = $(table);\n                var tableId = $table.data('footable_id');\n                var tableConfig = window.ninja_footables.tables['table_' + tableId];\n                that.initResponsiveTable($table, tableConfig);\n            });\n        },\n        initResponsiveTable: function initFooTable($table, tableConfig) {\n            var initConfig = {\n                \"cascade\": true,\n                \"columns\": tableConfig.columns,\n                \"rows\": $.get(window.ninja_footables.ajax_url + '?action=wp_ajax_ninja_tables_public_action&table_id=' + tableConfig.table_id + '&target_action=get-all-data&default_sorting=' + tableConfig.settings.default_sorting)\n            };\n\n            initConfig.sorting = {\n                \"enabled\": !!tableConfig.settings.sorting\n            };\n            initConfig.filtering = {\n                \"enabled\": !!tableConfig.settings.filtering,\n                \"delay\": 1,\n                \"dropdownTitle\": ninja_footables.i18n.search_in,\n                \"placeholder\": ninja_footables.i18n.search,\n                \"connectors\": false\n            };\n\n            initConfig.paging = {\n                \"enabled\": !!tableConfig.settings.paging,\n                \"position\": \"right\",\n                \"size\": tableConfig.settings.paging,\n                \"container\": \"#footable_parent_\" + tableConfig.table_id + \" .paging-ui-container\"\n            };\n            initConfig.empty = ninja_footables.i18n.empty_text;\n            $table.footable(initConfig);\n        }\n    };\n    ninja_table_app.initTables();\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcHVibGljL2pzL25pbmphLXRhYmxlcy1mb290YWJsZS5qcz8xZDRjIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwibmluamFfdGFibGVfYXBwIiwiaW5pdFRhYmxlcyIsImZvb3RhYmxlcyIsInRoYXQiLCJlYWNoIiwiZm9vdGFibGUiLCJ0YWJsZSIsIiR0YWJsZSIsInRhYmxlSWQiLCJkYXRhIiwidGFibGVDb25maWciLCJ3aW5kb3ciLCJuaW5qYV9mb290YWJsZXMiLCJ0YWJsZXMiLCJpbml0UmVzcG9uc2l2ZVRhYmxlIiwiaW5pdEZvb1RhYmxlIiwiaW5pdENvbmZpZyIsImNvbHVtbnMiLCJnZXQiLCJhamF4X3VybCIsInRhYmxlX2lkIiwic2V0dGluZ3MiLCJkZWZhdWx0X3NvcnRpbmciLCJzb3J0aW5nIiwiZmlsdGVyaW5nIiwiaTE4biIsInNlYXJjaF9pbiIsInNlYXJjaCIsInBhZ2luZyIsImVtcHR5IiwiZW1wdHlfdGV4dCJdLCJtYXBwaW5ncyI6IkFBQUFBLE9BQU9DLFFBQVAsRUFBaUJDLEtBQWpCLENBQXVCLFVBQVVDLENBQVYsRUFBYTtBQUNoQyxRQUFNQyxrQkFBa0I7QUFDcEJDLG9CQUFZLHNCQUFZO0FBQ3BCLGdCQUFJQyxZQUFZSCxFQUFFLGdDQUFGLENBQWhCO0FBQ0EsZ0JBQUlJLE9BQU8sSUFBWDtBQUNBSixjQUFFSyxJQUFGLENBQU9GLFNBQVAsRUFBa0IsVUFBVUcsUUFBVixFQUFvQkMsS0FBcEIsRUFBMkI7QUFDekMsb0JBQUlDLFNBQVNSLEVBQUVPLEtBQUYsQ0FBYjtBQUNBLG9CQUFJRSxVQUFVRCxPQUFPRSxJQUFQLENBQVksYUFBWixDQUFkO0FBQ0Esb0JBQUlDLGNBQWNDLE9BQU9DLGVBQVAsQ0FBdUJDLE1BQXZCLENBQThCLFdBQVNMLE9BQXZDLENBQWxCO0FBQ0FMLHFCQUFLVyxtQkFBTCxDQUF5QlAsTUFBekIsRUFBaUNHLFdBQWpDO0FBQ0gsYUFMRDtBQU1ILFNBVm1CO0FBV3BCSSw2QkFBc0IsU0FBU0MsWUFBVCxDQUFzQlIsTUFBdEIsRUFBOEJHLFdBQTlCLEVBQTJDO0FBQzdELGdCQUFJTSxhQUFhO0FBQ2IsMkJBQVcsSUFERTtBQUViLDJCQUFXTixZQUFZTyxPQUZWO0FBR2Isd0JBQVFsQixFQUFFbUIsR0FBRixDQUFNUCxPQUFPQyxlQUFQLENBQXVCTyxRQUF2QixHQUFnQyxzREFBaEMsR0FBdUZULFlBQVlVLFFBQW5HLEdBQTRHLDhDQUE1RyxHQUEySlYsWUFBWVcsUUFBWixDQUFxQkMsZUFBdEw7QUFISyxhQUFqQjs7QUFNQU4sdUJBQVdPLE9BQVgsR0FBcUI7QUFDakIsMkJBQVcsQ0FBQyxDQUFDYixZQUFZVyxRQUFaLENBQXFCRTtBQURqQixhQUFyQjtBQUdBUCx1QkFBV1EsU0FBWCxHQUF1QjtBQUNuQiwyQkFBWSxDQUFDLENBQUNkLFlBQVlXLFFBQVosQ0FBcUJHLFNBRGhCO0FBRW5CLHlCQUFTLENBRlU7QUFHbkIsaUNBQWlCWixnQkFBZ0JhLElBQWhCLENBQXFCQyxTQUhuQjtBQUluQiwrQkFBZWQsZ0JBQWdCYSxJQUFoQixDQUFxQkUsTUFKakI7QUFLbkIsOEJBQWM7QUFMSyxhQUF2Qjs7QUFRQVgsdUJBQVdZLE1BQVgsR0FBb0I7QUFDaEIsMkJBQVcsQ0FBQyxDQUFDbEIsWUFBWVcsUUFBWixDQUFxQk8sTUFEbEI7QUFFaEIsNEJBQVksT0FGSTtBQUdoQix3QkFBUWxCLFlBQVlXLFFBQVosQ0FBcUJPLE1BSGI7QUFJaEIsNkJBQWEsc0JBQW9CbEIsWUFBWVUsUUFBaEMsR0FBeUM7QUFKdEMsYUFBcEI7QUFNQUosdUJBQVdhLEtBQVgsR0FBbUJqQixnQkFBZ0JhLElBQWhCLENBQXFCSyxVQUF4QztBQUNBdkIsbUJBQU9GLFFBQVAsQ0FBZ0JXLFVBQWhCO0FBQ0g7QUFyQ21CLEtBQXhCO0FBdUNBaEIsb0JBQWdCQyxVQUFoQjtBQUNILENBekNEIiwiZmlsZSI6IjQ2My5qcyIsInNvdXJjZXNDb250ZW50IjpbImpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCQpIHtcbiAgICBjb25zdCBuaW5qYV90YWJsZV9hcHAgPSB7XG4gICAgICAgIGluaXRUYWJsZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGxldCBmb290YWJsZXMgPSAkKCd0YWJsZS5mb28tdGFibGUubmluamFfZm9vdGFibGUnKTtcbiAgICAgICAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgICQuZWFjaChmb290YWJsZXMsIGZ1bmN0aW9uIChmb290YWJsZSwgdGFibGUpIHtcbiAgICAgICAgICAgICAgICBsZXQgJHRhYmxlID0gJCh0YWJsZSk7XG4gICAgICAgICAgICAgICAgbGV0IHRhYmxlSWQgPSAkdGFibGUuZGF0YSgnZm9vdGFibGVfaWQnKTtcbiAgICAgICAgICAgICAgICBsZXQgdGFibGVDb25maWcgPSB3aW5kb3cubmluamFfZm9vdGFibGVzLnRhYmxlc1sndGFibGVfJyt0YWJsZUlkXTtcbiAgICAgICAgICAgICAgICB0aGF0LmluaXRSZXNwb25zaXZlVGFibGUoJHRhYmxlLCB0YWJsZUNvbmZpZyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFJlc3BvbnNpdmVUYWJsZTogIGZ1bmN0aW9uIGluaXRGb29UYWJsZSgkdGFibGUsIHRhYmxlQ29uZmlnKSB7XG4gICAgICAgICAgICBsZXQgaW5pdENvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBcImNhc2NhZGVcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjogdGFibGVDb25maWcuY29sdW1ucyxcbiAgICAgICAgICAgICAgICBcInJvd3NcIjogJC5nZXQod2luZG93Lm5pbmphX2Zvb3RhYmxlcy5hamF4X3VybCsnP2FjdGlvbj13cF9hamF4X25pbmphX3RhYmxlc19wdWJsaWNfYWN0aW9uJnRhYmxlX2lkPScrdGFibGVDb25maWcudGFibGVfaWQrJyZ0YXJnZXRfYWN0aW9uPWdldC1hbGwtZGF0YSZkZWZhdWx0X3NvcnRpbmc9Jyt0YWJsZUNvbmZpZy5zZXR0aW5ncy5kZWZhdWx0X3NvcnRpbmcpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBpbml0Q29uZmlnLnNvcnRpbmcgPSB7XG4gICAgICAgICAgICAgICAgXCJlbmFibGVkXCI6ICEhdGFibGVDb25maWcuc2V0dGluZ3Muc29ydGluZ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGluaXRDb25maWcuZmlsdGVyaW5nID0ge1xuICAgICAgICAgICAgICAgIFwiZW5hYmxlZFwiOiAgISF0YWJsZUNvbmZpZy5zZXR0aW5ncy5maWx0ZXJpbmcsXG4gICAgICAgICAgICAgICAgXCJkZWxheVwiOiAxLFxuICAgICAgICAgICAgICAgIFwiZHJvcGRvd25UaXRsZVwiOiBuaW5qYV9mb290YWJsZXMuaTE4bi5zZWFyY2hfaW4sXG4gICAgICAgICAgICAgICAgXCJwbGFjZWhvbGRlclwiOiBuaW5qYV9mb290YWJsZXMuaTE4bi5zZWFyY2gsXG4gICAgICAgICAgICAgICAgXCJjb25uZWN0b3JzXCI6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpbml0Q29uZmlnLnBhZ2luZyA9IHtcbiAgICAgICAgICAgICAgICBcImVuYWJsZWRcIjogISF0YWJsZUNvbmZpZy5zZXR0aW5ncy5wYWdpbmcsXG4gICAgICAgICAgICAgICAgXCJwb3NpdGlvblwiOiBcInJpZ2h0XCIsXG4gICAgICAgICAgICAgICAgXCJzaXplXCI6IHRhYmxlQ29uZmlnLnNldHRpbmdzLnBhZ2luZyxcbiAgICAgICAgICAgICAgICBcImNvbnRhaW5lclwiOiBcIiNmb290YWJsZV9wYXJlbnRfXCIrdGFibGVDb25maWcudGFibGVfaWQrXCIgLnBhZ2luZy11aS1jb250YWluZXJcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGluaXRDb25maWcuZW1wdHkgPSBuaW5qYV9mb290YWJsZXMuaTE4bi5lbXB0eV90ZXh0XG4gICAgICAgICAgICAkdGFibGUuZm9vdGFibGUoaW5pdENvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIG5pbmphX3RhYmxlX2FwcC5pbml0VGFibGVzKCk7IFxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3B1YmxpYy9qcy9uaW5qYS10YWJsZXMtZm9vdGFibGUuanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///463\n");

/***/ })

/******/ });