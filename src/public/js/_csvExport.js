jQuery(document).on('ninja_table_button_action_csv', function (e, data) {
    e.preventDefault();

    var exportAsCSV = function(csv, filename) {
        // generating the csv now
        var blob = new Blob([ csv ], {
            type : "application/csv;charset=utf-8;"
        });
        if (window.navigator.msSaveBlob) {
            // FOR IE BROWSER
            navigator.msSaveBlob(blob, filename);
        } else {
            // FOR OTHER BROWSERS
            var link = document.createElement("a");
            var csvUrl = URL.createObjectURL(blob);
            link.href = csvUrl;
            link.style = "visibility:hidden";
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    let tableConfig = data.tableConfig;
    let button = data.button;

    let csv = FooTable.get('#footable_'+tableConfig.table_id).toCSV(button.all_rows == 'yes');
    let filename = tableConfig.title+'.csv';
    return exportAsCSV(csv, filename);
});
