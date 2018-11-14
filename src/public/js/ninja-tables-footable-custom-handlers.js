export default {
	SetCellColor: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.css('color', condition.targetValueColor);
	},
    SetCellBgColor: function($elements, $table, condition, colIndex, column) {
        $elements.length && $elements.css('background-color', condition.targetValueColor);
    },
	ResetCellColorToDefault: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.css('color', 'initial');
	},
    ResetCellBgColorToDefault: function($elements, $table, condition, colIndex, column) {
        $elements.length && $elements.css('background-color', 'initial');
    },
	SetCellContent: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.html(condition.targetValue);
	},
	SetCellCssClass: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.addClass(condition.targetValue);
	},
	RemoveCellCssClass: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.removeClass(condition.targetValue);
	},
	SetRowColor: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.closest('tr').find('> td').css('color', condition.targetValueColor);
	},
    SetRowBgColor: function($elements, $table, condition, colIndex, column) {
        $elements.length && $elements.closest('tr').find('> td').css('background-color', condition.targetValueColor);
    },
    ResetRowBgColor: function($elements, $table, condition, colIndex, column) {
        $elements.length && $elements.closest('tr').find('> td').css('background-color', 'initial');
    },
	ResetRowColorToDefault: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.closest('tr').find('> td').css('color', 'initial');
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
    SetColumnBgColor: function($elements, $table, condition, colIndex, column) {
        $elements.length && $elements.closest('table').find(
            'tbody tr td:nth-child('+(colIndex+1)+')'
        ).css('background-color', condition.targetValueColor);
    },
	AddColumnCssClass: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.closest('table').find(
			'tbody tr td:nth-child('+(colIndex+1)+')'
		).addClass(condition.targetValue);
	},
    RemoveColumnCssClass: function($elements, $table, condition, colIndex, column) {
		$elements.length && $elements.closest('table').find(
			'tbody tr td:nth-child('+(colIndex+1)+')'
		).removeClass(condition.targetValue);
	},
};
