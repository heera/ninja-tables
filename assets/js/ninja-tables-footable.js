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
/******/ 	return __webpack_require__(__webpack_require__.s = 427);
/******/ })
/************************************************************************/
/******/ ({

/***/ 427:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(428);


/***/ }),

/***/ 428:
/***/ (function(module, exports) {

eval("jQuery(document).ready(function ($) {\n    var ninja_table_app = {\n        initTables: function initTables() {\n            var footables = $('table.foo-table.ninja_footable');\n            var that = this;\n            $.each(footables, function (footable, table) {\n                var $table = $(table);\n                var tableId = $table.data('footable_id');\n                var tableConfig = window.ninja_footables.tables['table_' + tableId];\n                that.initResponsiveTable($table, tableConfig);\n            });\n        },\n        initResponsiveTable: function initFooTable($table, tableConfig) {\n\n            var tableColumnNames = [];\n            jQuery.each(tableConfig.columns, function (index, column) {\n                tableColumnNames.push(column.name);\n            });\n\n            console.log(tableColumnNames);\n\n            var initConfig = {\n                \"cascade\": true,\n                \"columns\": tableConfig.columns,\n                \"rows\": $.get(window.ninja_footables.ajax_url + '?action=wp_ajax_ninja_tables_public_action&table_id=' + tableConfig.table_id + '&target_action=get-all-data&default_sorting=' + tableConfig.settings.default_sorting)\n            };\n\n            initConfig.sorting = {\n                \"enabled\": !!tableConfig.settings.sorting\n            };\n\n            var enabledSearch = !!tableConfig.settings.filtering;\n            if (tableConfig.settings.defualt_filter) {\n                enabledSearch = true;\n            }\n            initConfig.filtering = {\n                \"enabled\": enabledSearch,\n                \"delay\": 1,\n                \"dropdownTitle\": ninja_footables.i18n.search_in,\n                \"placeholder\": ninja_footables.i18n.search,\n                \"connectors\": false,\n                \"ignoreCase\": true\n            };\n\n            if (tableConfig.settings.defualt_filter) {\n                initConfig.filtering.filters = [{\n                    \"name\": \"ninja_table_custom_filter\",\n                    \"query\": tableConfig.settings.defualt_filter,\n                    \"columns\": []\n                }];\n            }\n\n            initConfig.paging = {\n                \"enabled\": !!tableConfig.settings.paging,\n                \"position\": \"right\",\n                \"size\": tableConfig.settings.paging,\n                \"container\": \"#footable_parent_\" + tableConfig.table_id + \" .paging-ui-container\"\n            };\n            initConfig.empty = ninja_footables.i18n.empty_text;\n\n            $table.footable(initConfig);\n        }\n    };\n    ninja_table_app.initTables();\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvcHVibGljL2pzL25pbmphLXRhYmxlcy1mb290YWJsZS5qcz8xZDRjIl0sIm5hbWVzIjpbImpRdWVyeSIsImRvY3VtZW50IiwicmVhZHkiLCIkIiwibmluamFfdGFibGVfYXBwIiwiaW5pdFRhYmxlcyIsImZvb3RhYmxlcyIsInRoYXQiLCJlYWNoIiwiZm9vdGFibGUiLCJ0YWJsZSIsIiR0YWJsZSIsInRhYmxlSWQiLCJkYXRhIiwidGFibGVDb25maWciLCJ3aW5kb3ciLCJuaW5qYV9mb290YWJsZXMiLCJ0YWJsZXMiLCJpbml0UmVzcG9uc2l2ZVRhYmxlIiwiaW5pdEZvb1RhYmxlIiwidGFibGVDb2x1bW5OYW1lcyIsImNvbHVtbnMiLCJpbmRleCIsImNvbHVtbiIsInB1c2giLCJuYW1lIiwiY29uc29sZSIsImxvZyIsImluaXRDb25maWciLCJnZXQiLCJhamF4X3VybCIsInRhYmxlX2lkIiwic2V0dGluZ3MiLCJkZWZhdWx0X3NvcnRpbmciLCJzb3J0aW5nIiwiZW5hYmxlZFNlYXJjaCIsImZpbHRlcmluZyIsImRlZnVhbHRfZmlsdGVyIiwiaTE4biIsInNlYXJjaF9pbiIsInNlYXJjaCIsImZpbHRlcnMiLCJwYWdpbmciLCJlbXB0eSIsImVtcHR5X3RleHQiXSwibWFwcGluZ3MiOiJBQUFBQSxPQUFPQyxRQUFQLEVBQWlCQyxLQUFqQixDQUF1QixVQUFVQyxDQUFWLEVBQWE7QUFDaEMsUUFBTUMsa0JBQWtCO0FBQ3BCQyxvQkFBWSxzQkFBWTtBQUNwQixnQkFBSUMsWUFBWUgsRUFBRSxnQ0FBRixDQUFoQjtBQUNBLGdCQUFJSSxPQUFPLElBQVg7QUFDQUosY0FBRUssSUFBRixDQUFPRixTQUFQLEVBQWtCLFVBQVVHLFFBQVYsRUFBb0JDLEtBQXBCLEVBQTJCO0FBQ3pDLG9CQUFJQyxTQUFTUixFQUFFTyxLQUFGLENBQWI7QUFDQSxvQkFBSUUsVUFBVUQsT0FBT0UsSUFBUCxDQUFZLGFBQVosQ0FBZDtBQUNBLG9CQUFJQyxjQUFjQyxPQUFPQyxlQUFQLENBQXVCQyxNQUF2QixDQUE4QixXQUFTTCxPQUF2QyxDQUFsQjtBQUNBTCxxQkFBS1csbUJBQUwsQ0FBeUJQLE1BQXpCLEVBQWlDRyxXQUFqQztBQUNILGFBTEQ7QUFNSCxTQVZtQjtBQVdwQkksNkJBQXNCLFNBQVNDLFlBQVQsQ0FBc0JSLE1BQXRCLEVBQThCRyxXQUE5QixFQUEyQzs7QUFFN0QsZ0JBQUlNLG1CQUFtQixFQUF2QjtBQUNBcEIsbUJBQU9RLElBQVAsQ0FBWU0sWUFBWU8sT0FBeEIsRUFBaUMsVUFBQ0MsS0FBRCxFQUFRQyxNQUFSLEVBQW1CO0FBQ2hESCxpQ0FBaUJJLElBQWpCLENBQXNCRCxPQUFPRSxJQUE3QjtBQUNILGFBRkQ7O0FBSUFDLG9CQUFRQyxHQUFSLENBQVlQLGdCQUFaOztBQUVBLGdCQUFJUSxhQUFhO0FBQ2IsMkJBQVcsSUFERTtBQUViLDJCQUFXZCxZQUFZTyxPQUZWO0FBR2Isd0JBQVFsQixFQUFFMEIsR0FBRixDQUFNZCxPQUFPQyxlQUFQLENBQXVCYyxRQUF2QixHQUFnQyxzREFBaEMsR0FBdUZoQixZQUFZaUIsUUFBbkcsR0FBNEcsOENBQTVHLEdBQTJKakIsWUFBWWtCLFFBQVosQ0FBcUJDLGVBQXRMO0FBSEssYUFBakI7O0FBTUFMLHVCQUFXTSxPQUFYLEdBQXFCO0FBQ2pCLDJCQUFXLENBQUMsQ0FBQ3BCLFlBQVlrQixRQUFaLENBQXFCRTtBQURqQixhQUFyQjs7QUFJQSxnQkFBSUMsZ0JBQWdCLENBQUMsQ0FBQ3JCLFlBQVlrQixRQUFaLENBQXFCSSxTQUEzQztBQUNBLGdCQUFHdEIsWUFBWWtCLFFBQVosQ0FBcUJLLGNBQXhCLEVBQXdDO0FBQ3BDRixnQ0FBZ0IsSUFBaEI7QUFDSDtBQUNEUCx1QkFBV1EsU0FBWCxHQUF1QjtBQUNuQiwyQkFBWUQsYUFETztBQUVuQix5QkFBUyxDQUZVO0FBR25CLGlDQUFpQm5CLGdCQUFnQnNCLElBQWhCLENBQXFCQyxTQUhuQjtBQUluQiwrQkFBZXZCLGdCQUFnQnNCLElBQWhCLENBQXFCRSxNQUpqQjtBQUtuQiw4QkFBYyxLQUxLO0FBTW5CLDhCQUFjO0FBTkssYUFBdkI7O0FBU0EsZ0JBQUcxQixZQUFZa0IsUUFBWixDQUFxQkssY0FBeEIsRUFBd0M7QUFDcENULDJCQUFXUSxTQUFYLENBQXFCSyxPQUFyQixHQUErQixDQUFDO0FBQzVCLDRCQUFRLDJCQURvQjtBQUU1Qiw2QkFBUzNCLFlBQVlrQixRQUFaLENBQXFCSyxjQUZGO0FBRzVCLCtCQUFXO0FBSGlCLGlCQUFELENBQS9CO0FBS0g7O0FBR0RULHVCQUFXYyxNQUFYLEdBQW9CO0FBQ2hCLDJCQUFXLENBQUMsQ0FBQzVCLFlBQVlrQixRQUFaLENBQXFCVSxNQURsQjtBQUVoQiw0QkFBWSxPQUZJO0FBR2hCLHdCQUFRNUIsWUFBWWtCLFFBQVosQ0FBcUJVLE1BSGI7QUFJaEIsNkJBQWEsc0JBQW9CNUIsWUFBWWlCLFFBQWhDLEdBQXlDO0FBSnRDLGFBQXBCO0FBTUFILHVCQUFXZSxLQUFYLEdBQW1CM0IsZ0JBQWdCc0IsSUFBaEIsQ0FBcUJNLFVBQXhDOztBQUlBakMsbUJBQU9GLFFBQVAsQ0FBZ0JtQixVQUFoQjtBQUNIO0FBL0RtQixLQUF4QjtBQWlFQXhCLG9CQUFnQkMsVUFBaEI7QUFDSCxDQW5FRCIsImZpbGUiOiI0MjguanMiLCJzb3VyY2VzQ29udGVudCI6WyJqUXVlcnkoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgkKSB7XG4gICAgY29uc3QgbmluamFfdGFibGVfYXBwID0ge1xuICAgICAgICBpbml0VGFibGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBsZXQgZm9vdGFibGVzID0gJCgndGFibGUuZm9vLXRhYmxlLm5pbmphX2Zvb3RhYmxlJyk7XG4gICAgICAgICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICAkLmVhY2goZm9vdGFibGVzLCBmdW5jdGlvbiAoZm9vdGFibGUsIHRhYmxlKSB7XG4gICAgICAgICAgICAgICAgbGV0ICR0YWJsZSA9ICQodGFibGUpO1xuICAgICAgICAgICAgICAgIGxldCB0YWJsZUlkID0gJHRhYmxlLmRhdGEoJ2Zvb3RhYmxlX2lkJyk7XG4gICAgICAgICAgICAgICAgbGV0IHRhYmxlQ29uZmlnID0gd2luZG93Lm5pbmphX2Zvb3RhYmxlcy50YWJsZXNbJ3RhYmxlXycrdGFibGVJZF07XG4gICAgICAgICAgICAgICAgdGhhdC5pbml0UmVzcG9uc2l2ZVRhYmxlKCR0YWJsZSwgdGFibGVDb25maWcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRSZXNwb25zaXZlVGFibGU6ICBmdW5jdGlvbiBpbml0Rm9vVGFibGUoJHRhYmxlLCB0YWJsZUNvbmZpZykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgdGFibGVDb2x1bW5OYW1lcyA9IFtdO1xuICAgICAgICAgICAgalF1ZXJ5LmVhY2godGFibGVDb25maWcuY29sdW1ucywgKGluZGV4LCBjb2x1bW4pID0+IHtcbiAgICAgICAgICAgICAgICB0YWJsZUNvbHVtbk5hbWVzLnB1c2goY29sdW1uLm5hbWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHRhYmxlQ29sdW1uTmFtZXMpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgaW5pdENvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBcImNhc2NhZGVcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcImNvbHVtbnNcIjogdGFibGVDb25maWcuY29sdW1ucyxcbiAgICAgICAgICAgICAgICBcInJvd3NcIjogJC5nZXQod2luZG93Lm5pbmphX2Zvb3RhYmxlcy5hamF4X3VybCsnP2FjdGlvbj13cF9hamF4X25pbmphX3RhYmxlc19wdWJsaWNfYWN0aW9uJnRhYmxlX2lkPScrdGFibGVDb25maWcudGFibGVfaWQrJyZ0YXJnZXRfYWN0aW9uPWdldC1hbGwtZGF0YSZkZWZhdWx0X3NvcnRpbmc9Jyt0YWJsZUNvbmZpZy5zZXR0aW5ncy5kZWZhdWx0X3NvcnRpbmcpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpbml0Q29uZmlnLnNvcnRpbmcgPSB7XG4gICAgICAgICAgICAgICAgXCJlbmFibGVkXCI6ICEhdGFibGVDb25maWcuc2V0dGluZ3Muc29ydGluZ1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGVuYWJsZWRTZWFyY2ggPSAhIXRhYmxlQ29uZmlnLnNldHRpbmdzLmZpbHRlcmluZztcbiAgICAgICAgICAgIGlmKHRhYmxlQ29uZmlnLnNldHRpbmdzLmRlZnVhbHRfZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZFNlYXJjaCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbml0Q29uZmlnLmZpbHRlcmluZyA9IHtcbiAgICAgICAgICAgICAgICBcImVuYWJsZWRcIjogIGVuYWJsZWRTZWFyY2gsXG4gICAgICAgICAgICAgICAgXCJkZWxheVwiOiAxLFxuICAgICAgICAgICAgICAgIFwiZHJvcGRvd25UaXRsZVwiOiBuaW5qYV9mb290YWJsZXMuaTE4bi5zZWFyY2hfaW4sXG4gICAgICAgICAgICAgICAgXCJwbGFjZWhvbGRlclwiOiBuaW5qYV9mb290YWJsZXMuaTE4bi5zZWFyY2gsXG4gICAgICAgICAgICAgICAgXCJjb25uZWN0b3JzXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiaWdub3JlQ2FzZVwiOiB0cnVlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZih0YWJsZUNvbmZpZy5zZXR0aW5ncy5kZWZ1YWx0X2ZpbHRlcikge1xuICAgICAgICAgICAgICAgIGluaXRDb25maWcuZmlsdGVyaW5nLmZpbHRlcnMgPSBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJuaW5qYV90YWJsZV9jdXN0b21fZmlsdGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicXVlcnlcIjogdGFibGVDb25maWcuc2V0dGluZ3MuZGVmdWFsdF9maWx0ZXIsXG4gICAgICAgICAgICAgICAgICAgIFwiY29sdW1uc1wiOiBbXVxuICAgICAgICAgICAgICAgIH1dO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGluaXRDb25maWcucGFnaW5nID0ge1xuICAgICAgICAgICAgICAgIFwiZW5hYmxlZFwiOiAhIXRhYmxlQ29uZmlnLnNldHRpbmdzLnBhZ2luZyxcbiAgICAgICAgICAgICAgICBcInBvc2l0aW9uXCI6IFwicmlnaHRcIixcbiAgICAgICAgICAgICAgICBcInNpemVcIjogdGFibGVDb25maWcuc2V0dGluZ3MucGFnaW5nLFxuICAgICAgICAgICAgICAgIFwiY29udGFpbmVyXCI6IFwiI2Zvb3RhYmxlX3BhcmVudF9cIit0YWJsZUNvbmZpZy50YWJsZV9pZCtcIiAucGFnaW5nLXVpLWNvbnRhaW5lclwiXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW5pdENvbmZpZy5lbXB0eSA9IG5pbmphX2Zvb3RhYmxlcy5pMThuLmVtcHR5X3RleHQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAkdGFibGUuZm9vdGFibGUoaW5pdENvbmZpZyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIG5pbmphX3RhYmxlX2FwcC5pbml0VGFibGVzKCk7IFxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3B1YmxpYy9qcy9uaW5qYS10YWJsZXMtZm9vdGFibGUuanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///428\n");

/***/ })

/******/ });