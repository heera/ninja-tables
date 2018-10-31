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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 486);
/******/ })
/************************************************************************/
/******/ ({

/***/ 486:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(487);


/***/ }),

/***/ 487:
/***/ (function(module, exports) {

eval("(function () {\n    tinymce.create('tinymce.plugins.ninja_table', {\n        init: function init(editor, url) {\n            editor.addButton('ninja_table', {\n                title: 'Add Ninja Tables Shortcode',\n                cmd: 'ninja_table_action',\n                image: url.slice(0, url.length - 2) + 'img/ninja-table-editor-button-2x.png'\n            });\n            editor.addCommand('ninja_table_action', function () {\n                editor.windowManager.open({\n                    title: window.ninja_tables_tiny_mce.title,\n                    body: [{\n                        type: 'listbox',\n                        name: 'ninja_table_shortcode',\n                        label: window.ninja_tables_tiny_mce.label,\n                        values: window.ninja_tables_tiny_mce.tables\n                    }],\n                    width: 768,\n                    height: 100,\n                    onsubmit: function onsubmit(e) {\n                        if (e.data.ninja_table_shortcode) {\n                            editor.insertContent('[ninja_tables id=\"' + e.data.ninja_table_shortcode + '\"]');\n                        } else {\n                            alert(window.ninja_tables_tiny_mce.select_error);\n                            return false;\n                        }\n                    },\n                    buttons: [{\n                        text: window.ninja_tables_tiny_mce.insert_text,\n                        subtype: 'primary',\n                        onclick: 'submit'\n                    }]\n                }, {\n                    'tinymce': tinymce\n                });\n            });\n        }\n        // ... Hidden code\n    });\n    // Register plugin\n    tinymce.PluginManager.add('ninja_table', tinymce.plugins.ninja_table);\n})();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYWRtaW4vbmluamEtdGFibGUtdGlueW1jZS1idXR0b24uanM/ZjBlZCJdLCJuYW1lcyI6WyJ0aW55bWNlIiwiY3JlYXRlIiwiaW5pdCIsImVkaXRvciIsInVybCIsImFkZEJ1dHRvbiIsInRpdGxlIiwiY21kIiwiaW1hZ2UiLCJzbGljZSIsImxlbmd0aCIsImFkZENvbW1hbmQiLCJ3aW5kb3dNYW5hZ2VyIiwib3BlbiIsIndpbmRvdyIsIm5pbmphX3RhYmxlc190aW55X21jZSIsImJvZHkiLCJ0eXBlIiwibmFtZSIsImxhYmVsIiwidmFsdWVzIiwidGFibGVzIiwid2lkdGgiLCJoZWlnaHQiLCJvbnN1Ym1pdCIsImUiLCJkYXRhIiwibmluamFfdGFibGVfc2hvcnRjb2RlIiwiaW5zZXJ0Q29udGVudCIsImFsZXJ0Iiwic2VsZWN0X2Vycm9yIiwiYnV0dG9ucyIsInRleHQiLCJpbnNlcnRfdGV4dCIsInN1YnR5cGUiLCJvbmNsaWNrIiwiUGx1Z2luTWFuYWdlciIsImFkZCIsInBsdWdpbnMiLCJuaW5qYV90YWJsZSJdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQyxZQUFXO0FBQ1JBLFlBQVFDLE1BQVIsQ0FBZSw2QkFBZixFQUE4QztBQUMxQ0MsY0FBTyxjQUFTQyxNQUFULEVBQWlCQyxHQUFqQixFQUFzQjtBQUN6QkQsbUJBQU9FLFNBQVAsQ0FBaUIsYUFBakIsRUFBZ0M7QUFDNUJDLHVCQUFRLDRCQURvQjtBQUU1QkMscUJBQU0sb0JBRnNCO0FBRzVCQyx1QkFBUUosSUFBSUssS0FBSixDQUFXLENBQVgsRUFBY0wsSUFBSU0sTUFBSixHQUFhLENBQTNCLElBQWlDO0FBSGIsYUFBaEM7QUFLQVAsbUJBQU9RLFVBQVAsQ0FBa0Isb0JBQWxCLEVBQXdDLFlBQVc7QUFDL0NSLHVCQUFPUyxhQUFQLENBQXFCQyxJQUFyQixDQUEwQjtBQUN0QlAsMkJBQU9RLE9BQU9DLHFCQUFQLENBQTZCVCxLQURkO0FBRXRCVSwwQkFBTSxDQUNGO0FBQ0lDLDhCQUFTLFNBRGI7QUFFSUMsOEJBQVMsdUJBRmI7QUFHSUMsK0JBQVNMLE9BQU9DLHFCQUFQLENBQTZCSSxLQUgxQztBQUlJQyxnQ0FBU04sT0FBT0MscUJBQVAsQ0FBNkJNO0FBSjFDLHFCQURFLENBRmdCO0FBVXRCQywyQkFBTyxHQVZlO0FBV3RCQyw0QkFBUSxHQVhjO0FBWXRCQyw4QkFBVSxrQkFBVUMsQ0FBVixFQUFjO0FBQ3BCLDRCQUFJQSxFQUFFQyxJQUFGLENBQU9DLHFCQUFYLEVBQW1DO0FBQy9CeEIsbUNBQU95QixhQUFQLENBQXNCLHVCQUF1QkgsRUFBRUMsSUFBRixDQUFPQyxxQkFBOUIsR0FBc0QsSUFBNUU7QUFDSCx5QkFGRCxNQUVPO0FBQ0hFLGtDQUFNZixPQUFPQyxxQkFBUCxDQUE2QmUsWUFBbkM7QUFDQSxtQ0FBTyxLQUFQO0FBQ0g7QUFDSixxQkFuQnFCO0FBb0J0QkMsNkJBQVMsQ0FDTDtBQUNJQyw4QkFBTWxCLE9BQU9DLHFCQUFQLENBQTZCa0IsV0FEdkM7QUFFSUMsaUNBQVMsU0FGYjtBQUdJQyxpQ0FBUztBQUhiLHFCQURLO0FBcEJhLGlCQUExQixFQTJCRztBQUNDLCtCQUFXbkM7QUFEWixpQkEzQkg7QUE4QkgsYUEvQkQ7QUFnQ0g7QUFDRDtBQXhDMEMsS0FBOUM7QUEwQ0E7QUFDQUEsWUFBUW9DLGFBQVIsQ0FBc0JDLEdBQXRCLENBQTJCLGFBQTNCLEVBQTBDckMsUUFBUXNDLE9BQVIsQ0FBZ0JDLFdBQTFEO0FBQ0gsQ0E3Q0QiLCJmaWxlIjoiNDg3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xuICAgIHRpbnltY2UuY3JlYXRlKCd0aW55bWNlLnBsdWdpbnMubmluamFfdGFibGUnLCB7XG4gICAgICAgIGluaXQgOiBmdW5jdGlvbihlZGl0b3IsIHVybCkge1xuICAgICAgICAgICAgZWRpdG9yLmFkZEJ1dHRvbignbmluamFfdGFibGUnLCB7XG4gICAgICAgICAgICAgICAgdGl0bGUgOiAnQWRkIE5pbmphIFRhYmxlcyBTaG9ydGNvZGUnLFxuICAgICAgICAgICAgICAgIGNtZCA6ICduaW5qYV90YWJsZV9hY3Rpb24nLFxuICAgICAgICAgICAgICAgIGltYWdlIDogdXJsLnNsaWNlKCAwLCB1cmwubGVuZ3RoIC0gMiApICsgJ2ltZy9uaW5qYS10YWJsZS1lZGl0b3ItYnV0dG9uLTJ4LnBuZycsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVkaXRvci5hZGRDb21tYW5kKCduaW5qYV90YWJsZV9hY3Rpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBlZGl0b3Iud2luZG93TWFuYWdlci5vcGVuKHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHdpbmRvdy5uaW5qYV90YWJsZXNfdGlueV9tY2UudGl0bGUsXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlICAgOiAnbGlzdGJveCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZSAgIDogJ25pbmphX3RhYmxlX3Nob3J0Y29kZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWwgIDogd2luZG93Lm5pbmphX3RhYmxlc190aW55X21jZS5sYWJlbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgOiB3aW5kb3cubmluamFfdGFibGVzX3RpbnlfbWNlLnRhYmxlc1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNzY4LFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMCxcbiAgICAgICAgICAgICAgICAgICAgb25zdWJtaXQ6IGZ1bmN0aW9uKCBlICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGUuZGF0YS5uaW5qYV90YWJsZV9zaG9ydGNvZGUgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRpdG9yLmluc2VydENvbnRlbnQoICdbbmluamFfdGFibGVzIGlkPVwiJyArIGUuZGF0YS5uaW5qYV90YWJsZV9zaG9ydGNvZGUgKyAnXCJdJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KHdpbmRvdy5uaW5qYV90YWJsZXNfdGlueV9tY2Uuc2VsZWN0X2Vycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB3aW5kb3cubmluamFfdGFibGVzX3RpbnlfbWNlLmluc2VydF90ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnR5cGU6ICdwcmltYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNsaWNrOiAnc3VibWl0J1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAndGlueW1jZSc6IHRpbnltY2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICAvLyAuLi4gSGlkZGVuIGNvZGVcbiAgICB9KTtcbiAgICAvLyBSZWdpc3RlciBwbHVnaW5cbiAgICB0aW55bWNlLlBsdWdpbk1hbmFnZXIuYWRkKCAnbmluamFfdGFibGUnLCB0aW55bWNlLnBsdWdpbnMubmluamFfdGFibGUgKTtcbn0pKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYWRtaW4vbmluamEtdGFibGUtdGlueW1jZS1idXR0b24uanMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///487\n");

/***/ })

/******/ });