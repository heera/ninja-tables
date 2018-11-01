import Event from './EventBus';
import Actions from './ninja-tables-footable-custom-handlers';

Event.on('ninja-tables-apply-conditional-formatting', function(e, $table, config) {
    jQuery.each(config.columns, function(colIndex, column) {
        jQuery.each(column.conditions, function(i, condition) {
        	let action = getActionName(condition);
        	if(action in Actions) {
        		let $elements = getElements($table, condition, colIndex, column);
        		Actions[action]($elements, $table, condition, colIndex, column);
        	}
        });
    });
});

function getActionName(condition) {
	return condition.targetAction.split('-').map(
		chr => chr.substr(0, 1).toUpperCase() + chr.substr(1)
	).join('');
};

function getElements($table, condition, colIndex, column) {	
	let $elements = jQuery({});
	let curentColumnClassPrefix = 'ninja_column_';
	let cellClass = curentColumnClassPrefix + colIndex;
	
	if (condition.conditionalOperator == 'equal') {
    	$elements = getEquals($table, cellClass, condition, column);
	} else if (condition.conditionalOperator == 'not-equal') {
    	$elements = getNotEquals($table, cellClass, condition, column);
	} else if (condition.conditionalOperator == 'contains') {
    	$elements = getContains($table, cellClass, condition, column);
	} else if (condition.conditionalOperator == 'does-not-contain') {
    	$elements = getDoesNotContains($table, cellClass, condition, column);
	} else if (condition.conditionalOperator == 'less-than') {
    	$elements = getLessThan($table, cellClass, condition, column);
	} else if (condition.conditionalOperator == 'less-than-or-equal-to') {
    	$elements = getLessThanOrEqualTo($table, cellClass, condition, column);
	} else if (condition.conditionalOperator == 'greater-than') {
    	$elements = getGreaterThan($table, cellClass, condition, column);
	} else if (condition.conditionalOperator == 'greater-than-or-equal-to') {
    	$elements = getGreaterThanOrEqualTo($table, cellClass, condition, column);
	}

	return $elements;
};

function getEquals($table, cellClass, condition, column) {
	return $table.find('tbody .' + cellClass).filter((i, td) => {
		return jQuery(td).text() == condition.conditionalValue;
	});
}

function getNotEquals($table, cellClass, condition, column) {
	return $table.find('tbody .' + cellClass).filter((i, td) => {
		return jQuery(td).text() != condition.conditionalValue;
	});
}

function getContains($table, cellClass, condition, column) {
	return $table.find(
		'tbody .' + cellClass + ':contains('+condition.conditionalValue+')'
	);
}

function getDoesNotContains($table, cellClass, condition, column) {
	return $table.find(
		'tbody .' + cellClass + ':not(:contains('+condition.conditionalValue+'))'
	);
}

function getLessThan($table, cellClass, condition, column) {
	return $table.find('tbody .' + cellClass).filter((i, td) => {
		let text = jQuery(td).text();
		if (isValidDate(text, column) || isValidNumber(text, column)) {
			return parseInt(text, 10) < parseInt(condition.conditionalValue, 10);
		}
	});
}

function getLessThanOrEqualTo($table, cellClass, condition, column) {
	return $table.find('tbody .' + cellClass).filter((i, td) => {
		let text = jQuery(td).text();
		if (isValidDate(text, column) || isValidNumber(text, column)) {
			return parseInt(jQuery(td).text(), 10) <= parseInt(condition.conditionalValue, 10);
		}
	});
}

function getGreaterThan($table, cellClass, condition, column) {
	return $table.find('tbody .' + cellClass).filter((i, td) => {
		let text = jQuery(td).text();
		if (isValidDate(text, column) || isValidNumber(text, column)) {
			return parseInt(jQuery(td).text(), 10) > parseInt(condition.conditionalValue, 10);
		}
	});
}

function getGreaterThanOrEqualTo($table, cellClass, condition, column) {
	return $table.find('tbody .' + cellClass).filter((i, td) => {
		let text = jQuery(td).text();
		if (isValidDate(text, column) || isValidNumber(text, column)) {
			return parseInt(jQuery(td).text(), 10) >= parseInt(condition.conditionalValue, 10);
		}
	});
}

function isValidDate(value, column) {
	return value && column.type == 'date' && moment(
		value, column.formatString, true
	).isValid();
}

function isValidNumber(value, column) {
	return value && column.type == 'numeric' && jQuery.isNumeric(
		value.replace(/[^0-9\.,-]+/g, "")
	);
}
