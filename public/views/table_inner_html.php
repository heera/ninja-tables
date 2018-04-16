<?php
    $table_columns = array_reverse($table_columns);
    $header_row = '';
    $counter = 1;
?>
<thead>
<tr>
    <?php foreach ($table_columns as $index => $table_column) : ?>
        <?php
            if (strip_tags($table_column['title']) == '#colspan#') {
	            $header_row = '<td class="ninja_temp_cell"></td>'.$header_row;
	            $counter++;
	            continue;
            }

	    $colspan = '';
	    if ($counter > 1) {
		    $colspan = 'colspan="'.$counter.'"';
	    }

	    $header_row = '<th '. $colspan .' class="'.implode(' ', $table_column['classes']).'">'.$table_column['title'].'</th>'.$header_row;
        ?>
    <?php $counter = 1; endforeach; ?>
    <?php echo $header_row; ?>
</tr>
</thead>
<tbody>
<?php
$columnLength = count($table_columns) - 1;

foreach ($table_rows as $table_row) :
    $row = '';
    ?>
    <tr>
        <?php
        $counter = 1;
        foreach ($table_columns as $index => $table_column) {
	        $column_value = @$table_row[$table_column['name']];
	        $colspan = '';
            if($index != $columnLength) {
	            if (strip_tags($column_value) == '#colspan#') {
		            $row = '<td class="ninja_temp_cell"></td>'.$row;
		            $counter++;
		            continue;
	            }
	            $colspan = '';
	            if ($counter > 1) {
		            $colspan = 'colspan="'.$counter.'"';
	            }
            }
            $row = '<td '.$colspan.'>'.$column_value.'</td>'.$row;
            $counter = 1;
        }
        echo $row;
        ?>
    </tr>
<?php endforeach; ?>
</tbody>