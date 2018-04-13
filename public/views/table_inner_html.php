<thead>
<tr>
    <?php foreach ($table_columns as $table_column) : ?>
        <th><?php echo $table_column['title']; ?></th>
    <?php endforeach; ?>
</tr>
</thead>
<tbody>
<?php
$table_columns = array_reverse($table_columns);
foreach ($table_rows as $table_row) :
    $row = '';
    ?>
    <tr>
        <?php
        $counter = 1;
        foreach ($table_columns as $table_column) {
            $column_value = @$table_row[$table_column['name']];
            if (strip_tags($column_value) == '#colspan#') {
                $row = '<td class="ninja_temp_cell"></td>'.$row;
                $counter++;
                continue;
            }
            $colspan = '';
            if ($counter > 1) {
                $colspan = 'colspan="'.$counter.'"';
            }
            $row = '<td '.$colspan.'>'.$column_value.'</td>'.$row;
            $counter = 1;
        }
        echo $row;
        ?>
    </tr>
<?php endforeach; ?>
</tbody>