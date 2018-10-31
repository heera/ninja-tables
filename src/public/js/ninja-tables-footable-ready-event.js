import Event from './EventBus';
import Actions from './ninja-tables-footable-ready-handlers';

Event.on('ninja-tables-ready', function(e, $table, config) {
    jQuery.each(config.columns, function(colIndex, column) {
        jQuery.each(column.conditions, function(i, condition) {
        	let action = getActionName(condition);
        	if(action in Actions) {
        		Actions[action]($table, condition, colIndex, column);
        	}
        });
    });
});

function getActionName(condition) {
	return condition.targetAction.split('-').map(
		chr => chr.substr(0, 1).toUpperCase() + chr.substr(1)
	).join('');
}
