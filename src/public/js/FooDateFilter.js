(function (F) {
    /**
     * Checks if the row is filtered using the supplied filters.
     * @this FooTable.Row
     * @param {Array.<FooTable.Filter>} filters - The filters to apply.
     * @returns {boolean}
     */
    F.Row.prototype.filtered = function (filters) {
        var result = true,
            self = this;
        F.arr.each(filters, function (f) {
            if (result) { //check if its already flag to false;
                let inputValue = f.query._original.substring(1);
                inputValue = f.columns["0"].sortValue(inputValue);
                let rowValue = self.value[f.columns["0"].name];
                rowValue = f.columns["0"].sortValue(rowValue);

                if (f.query._original.charAt(0) == ">") {
                    result = rowValue >= inputValue;
                    return result;
                } else if (f.query._original.charAt(0) == "<") {
                    result = rowValue <= inputValue;
                    return result;
                } else {
                    if ((result = f.matchRow(self)) == false) return false;
                }
            }
        });
        return result;
    };
})(FooTable);
