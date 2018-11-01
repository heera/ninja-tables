export default {
	SetCellColor: function($elements, $table, condition, colIndex, column) {
		column.cellDefaultcolor = $elements.css('color');
		$elements.length && $elements.css('color', condition.targetValueColor);
	},
	ResetCellColorToDefault: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.css('color', column.cellDefaultcolor);
	},
	SetCellContent: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.text(condition.targetValue);
	},
	SetCellCssClass: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.addClass(condition.targetValue);
	},
	RemoveCellCssClass: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.removeClass(condition.targetValue);
	},
	SetRowColor: function($elements, $table, condition, colIndex, column) {
		column.rowDefaultcolor = $elements.closest('tr').css('color');
		$elements.length && $elements.closest('tr').css('color', condition.targetValueColor);
	},
	ResetRowColorToDefault: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.closest('tr').css('color', column.rowDefaultcolor);
	},
	SetRowCssClass: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.closest('tr').addClass(condition.targetValue);
	},
	RemoveRowCssClass: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.closest('tr').removeClass(condition.targetValue);
	},
	SetColumnColor: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.closest('table').find(
			'tbody tr td:nth-child('+(colIndex+1)+')'
		).css('color', condition.targetValueColor);
	},
	AddColumnCssClass: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.closest('table').find(
			'tbody tr td:nth-child('+(colIndex+1)+')'
		).addClass(condition.targetValue);
	},
};
