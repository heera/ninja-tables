export default {
	curentColumnClassPrefix: 'ninja_column_',
	SetCellColor: function($table, condition, colIndex, column) {
		let $cells;
		let cellClass = this.curentColumnClassPrefix + colIndex;
		if (condition.conditionalOperator == 'equal') {
        	$cells = getEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'not-equal') {
        	$cells = getNotEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'contains') {
        	$cells = getContains($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'does-not-contain') {
        	$cells = getDoesNotContains($table, cellClass, condition);
		}

		column.cellDefaultcolor = $cells.css('color');
		$cells && $cells.css('color', condition.targetValueColor);
	},
	ResetCellColorToDefault: function($table, condition, colIndex, column) {
		let $cells;
		let cellClass = this.curentColumnClassPrefix + colIndex;
		if (condition.conditionalOperator == 'equal') {
        	$cells = getEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'not-equal') {
        	$cells = getNotEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'contains') {
        	$cells = getContains($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'does-not-contain') {
        	$cells = getDoesNotContains($table, cellClass, condition);
		}
		
		$cells && $cells.css('color', column.cellDefaultcolor);
	},
	SetCellContent: function($table, condition, colIndex, column) {
		let $cells;
		let cellClass = this.curentColumnClassPrefix + colIndex;
		if (condition.conditionalOperator == 'equal') {
        	$cells = getEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'not-equal') {
        	$cells = getNotEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'contains') {
        	$cells = getContains($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'does-not-contain') {
        	$cells = getDoesNotContains($table, cellClass, condition);
		}

		$cells && $cells.text(condition.targetValue);
	},
	SetCellCssClass: function($table, condition, colIndex, column) {
		let $cells;
		let cellClass = this.curentColumnClassPrefix + colIndex;
		if (condition.conditionalOperator == 'equal') {
        	$cells = getEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'not-equal') {
        	$cells = getNotEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'contains') {
        	$cells = getContains($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'does-not-contain') {
        	$cells = getDoesNotContains($table, cellClass, condition);
		}

		$cells && $cells.addClass(condition.targetValue);
	},
	RemoveCellCssClass: function($table, condition, colIndex, column) {
		let $cells;
		let cellClass = this.curentColumnClassPrefix + colIndex;
		if (condition.conditionalOperator == 'equal') {
        	$cells = getEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'not-equal') {
        	$cells = getNotEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'contains') {
        	$cells = getContains($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'does-not-contain') {
        	$cells = getDoesNotContains($table, cellClass, condition);
		}

		$cells && $cells.removeClass(condition.targetValue);
	},
	SetRowColor: function($table, condition, colIndex, column) {
		let $cells;
		let cellClass = this.curentColumnClassPrefix + colIndex;
		if (condition.conditionalOperator == 'equal') {
        	$cells = getEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'not-equal') {
        	$cells = getNotEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'contains') {
        	$cells = getContains($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'does-not-contain') {
        	$cells = getDoesNotContains($table, cellClass, condition);
		}

		column.rowDefaultcolor = $cells.closest('tr').css('color');
		$cells && $cells.closest('tr').css('color', condition.targetValueColor);
	},
	ResetRowColorToDefault: function($table, condition, colIndex, column) {
		let $cells;
		let cellClass = this.curentColumnClassPrefix + colIndex;
		if (condition.conditionalOperator == 'equal') {
        	$cells = getEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'not-equal') {
        	$cells = getNotEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'contains') {
        	$cells = getContains($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'does-not-contain') {
        	$cells = getDoesNotContains($table, cellClass, condition);
		}

		$cells && $cells.closest('tr').css('color', column.rowDefaultcolor);
	},
	SetRowCssClass: function($table, condition, colIndex, column) {
		let $cells;
		let cellClass = this.curentColumnClassPrefix + colIndex;
		if (condition.conditionalOperator == 'equal') {
        	$cells = getEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'not-equal') {
        	$cells = getNotEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'contains') {
        	$cells = getContains($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'does-not-contain') {
        	$cells = getDoesNotContains($table, cellClass, condition);
		}

		$cells && $cells.closest('tr').addClass(condition.targetValue);
	},
	RemoveRowCssClass: function($table, condition, colIndex, column) {
		let $cells;
		let cellClass = this.curentColumnClassPrefix + colIndex;
		if (condition.conditionalOperator == 'equal') {
        	$cells = getEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'not-equal') {
        	$cells = getNotEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'contains') {
        	$cells = getContains($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'does-not-contain') {
        	$cells = getDoesNotContains($table, cellClass, condition);
		}

		$cells && $cells.closest('tr').removeClass(condition.targetValue);
	},
	SetColumnColor: function($table, condition, colIndex, column) {
		let $cells;
		let cellClass = this.curentColumnClassPrefix + colIndex;
		if (condition.conditionalOperator == 'equal') {
        	$cells = getEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'not-equal') {
        	$cells = getNotEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'contains') {
        	$cells = getContains($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'does-not-contain') {
        	$cells = getDoesNotContains($table, cellClass, condition);
		}

		$cells && $table.find(
			'tbody tr td:nth-child('+(colIndex+1)+')'
		).css('color', condition.targetValueColor);
	},
	AddColumnCssClass: function($table, condition, colIndex, column) {
		let $cells;
		let cellClass = this.curentColumnClassPrefix + colIndex;
		if (condition.conditionalOperator == 'equal') {
        	$cells = getEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'not-equal') {
        	$cells = getNotEquals($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'contains') {
        	$cells = getContains($table, cellClass, condition);
		} else if (condition.conditionalOperator == 'does-not-contain') {
        	$cells = getDoesNotContains($table, cellClass, condition);
		}

		$cells && $table.find(
			'tbody tr td:nth-child('+(colIndex+1)+')'
		).addClass(condition.targetValue);
	},
};

function getEquals($table, cellClass, condition) {
	return $table.find('tbody .' + cellClass).filter((i, td) => {
		return jQuery(td).text() == condition.conditionalValue;
	});
}

function getNotEquals($table, cellClass, condition) {
	return $table.find('tbody .' + cellClass).filter((i, td) => {
		return jQuery(td).text() != condition.conditionalValue;
	});
}

function getContains($table, cellClass, condition) {
	return $table.find(
		'tbody .' + cellClass + ':contains('+condition.conditionalValue+')'
	);
}

function getDoesNotContains($table, cellClass, condition) {
	return $table.find(
		'tbody .' + cellClass + ':not(:contains('+condition.conditionalValue+'))'
	);
}