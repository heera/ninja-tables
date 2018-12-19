jQuery(document).on('ninja_table_button_action_print', function (e, data) {
    let tableConfig = data.tableConfig;
    let tableId = data.tableConfig.table_id;
    let button = data.button;
    let tableJson = FooTable.get('#footable_' + tableId).toJSON(button.all_rows == 'yes');
    let customCss = tableConfig.custom_css;
    // Helper Functions here
    var addRow = function (row, tag) {
        if (!tag) {
            tag = 'td';
        }
        var str = '<tr>';
        jQuery.each(row, (item_index, item) => {
            var dataOut = item === null || item === undefined ?
                '' :
                item;
            str += '<' + tag + '>' + dataOut + '</' + tag + '>';
        });
        return str + '</tr>';
    };
    var _link = document.createElement('a');
    var _styleToAbs = function (el) {
        var url;
        var clone = jQuery(el).clone()[0];
        var linkHost;

        if (clone.nodeName.toLowerCase() === 'link') {
            clone.href = _relToAbs(clone.href);
        }

        return clone.outerHTML;
    };
    var _relToAbs = function (href) {
        // Assign to a link on the original page so the browser will do all the
        // hard work of figuring out where the file actually is
        _link.href = href;
        var linkHost = _link.host;

        // IE doesn't have a trailing slash on the host
        // Chrome has it on the pathname
        if (linkHost.indexOf('/') === -1 && _link.pathname.indexOf('/') !== 0) {
            linkHost += '/';
        }

        return _link.protocol + "//" + linkHost + _link.pathname + _link.search;
    };

    let tableClasses = jQuery('#footable_' + tableId).attr('class');
    let wrapperClass = jQuery('#footable_parent_' + tableId).attr('class');

    wrapperClass = wrapperClass.replace('colored_table');

    var html = '<div class="' + wrapperClass + '"><table style="display: table !important;" class="' + tableClasses + '">';

    html += '<thead><tr>';
    jQuery.each(tableJson.columns, (column_index, item) => {
        let thItem = jQuery('<th/>', {
            html: item.title,
            class: item.classes.join(' '),
            css: customCss['ninja_column_' + column_index]
        });
        html += jQuery(thItem).get(0).outerHTML;
    });
    html += '</tr></thead>';

    html += '<tbody>';
    jQuery.each(tableJson.rows, (index, row) => {
        html += addRow(row);
    });
    html += '</tbody>';

    html += '</table></div>';
    // Open a new window for the printable table
    var win = window.open('', '');
    win.document.close();

    let exportInfo = {
        title: tableConfig.title,
        messageTop: button.message_top,
        messageBottom: button.message_bottom
    };


    // Inject the title and also a copy of the style and link tags from this
    // document so the table can retain its base styling. Note that we have
    // to use string manipulation as IE won't allow elements to be created
    // in the host document and then appended to the new window.
    var head = '<title>'+exportInfo.title+'</title>';
    jQuery('style, link').each(function () {
        head += _styleToAbs(this);
    });

    try {
        win.document.head.innerHTML = head; // Work around for Edge
    }
    catch (e) {
        $(win.document.head).html(head); // Old IE
    }

    // Inject the table and other surrounding information
    win.document.body.innerHTML =
        '<div>' + (exportInfo.messageTop || '') + '</div>' +
        html +
        '<div>' + (exportInfo.messageBottom || '') + '</div>';
    jQuery(win.document.body).addClass('ninja_table_print_view');

    jQuery('img', win.document.body).each(function (i, img) {
        img.setAttribute('src', _relToAbs(img.getAttribute('src')));
    });

    // Allow stylesheets time to load
    var autoPrint = function () {
        win.print(); // blocking - so close will not
        win.close(); // execute until this is done
    };

    if (navigator.userAgent.match(/Trident\/\d.\d/)) { // IE needs to call this without a setTimeout
        autoPrint();
    } else {
        win.setTimeout(autoPrint, 1000);
    }

});
