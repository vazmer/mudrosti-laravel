var Quote = function (){

    var $quotesTable = $('#quotes_table'),
        counter = $quotesTable.length-1;

    var addRow = function(){
        counter++;

        var $firstRow = $quotesTable.find('tbody tr:first').clone(true);
        setDefaultValues($firstRow);

        $quotesTable.find('tbody').append($firstRow);
    };

    var removeRow = function($row){
        if($quotesTable.find('tbody tr').length > 1){
            $row.remove();
        } else {
            setDefaultValues($row);
        }
    };

    var setDefaultValues = function($row){
        var prefix = "quotes[" + counter + "]";
        $row.find('textarea, input').each(function(){
            $field = $(this);
            this.name = this.name.replace(/quotes\[\d+\]/, prefix);
            this.value = '';
        });
        setNoimage($row);
    };

    var setNoimage = function($row){
        $row.find('.thumbnail img').attr('src', 'http://www.placehold.it/200x150/EFEFEF/AAAAAA&text=no+image');
    };

    return {
        init: function(){

            $quotesTable.find('.thumbnail').click(function(){
                var $thumb = $(this);
                Media.setSrc($thumb.find('img'), $thumb.find('input'))
                Media.openModal();
            });

            $quotesTable.find('.remove-row').click(function(){
                removeRow($(this).parents('tr'));
            });
        },
        addRow: addRow
    };
}();

Quote.init();