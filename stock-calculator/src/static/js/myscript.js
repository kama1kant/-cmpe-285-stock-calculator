$(function () {
    $(".plDisplay").hide();
    if (localStorage.getItem("stock_db") === null) {
        $('#btnPortfolio').hide();
    }

    $('#btnBuyStocks').click(function () {
        console.log("Clicked Buying stocks!");
        var amount = $('#amount').val();
        amount = parseInt(amount);
        
        var investType = [];
        $.each($('.investType:checkbox:checked'), function () {
            investType.push($(this).val());
        });
        
        
        if (amount < 5000 || amount > 100000) {
            alert("The amount should be between $5,000 and $100,000");
            return;
        }
        if (investType.length <= 0) {
            alert("Select atleast one Investment strategy");
            return;
        }



        investType = JSON.stringify(investType)+"";




        
        var param = "amount=" + amount + "&" + "investType=" + investType;
        
        console.log(param);
        buyStocks(param)
    });

    $('#btnPortfolio').click(function () {        
        var param = "stock_db=" + getStockDb();
        console.log(param);
        getStocks(param)
    });
});


function buyStocks(param){
    alert("Buying stocks!");
    $.ajax({
        url: '/buyStocks',
        data: param,
        type: 'POST',
        success: function (response) {
            console.log(response);
            var data = JSON.parse(response);
            var stock_db = data["stock_db"]
            console.log(stock_db);
            saveStockDb(JSON.stringify(stock_db));
            $('#btnPortfolio').show();
            alert("Stocks purchased!");
        },
        error: function (error) {
            console.log(error);
        }
    });
}


function getStocks(param) {
    alert("Loading portfolio. Please wait!");
    $.ajax({
        url: '/getStocks',
        data: param,
        type: 'POST',
        success: function (response) {
            console.log(response);
            var data = JSON.parse(response);
            var stockDb = data["stock_db"];
            console.log(stockDb);
            showStocks(stockDb);
            $(".plDisplay").show();
            $("#pl").text("$"+parseFloat(data["pl"]).toFixed(2));
            $("#plPercent").text(parseFloat(data["pl_percent"]).toFixed(2)+" %");
            alert("Your Stock details are loaded!");
        },
        error: function (error) {
            console.log(error);
        }
    });
}


function saveStockDb(stock_db){
    localStorage.clear();
    localStorage.setItem("stock_db", stock_db);
}


function getStockDb() {
    return localStorage.getItem("stock_db");
}

function showStocks(stockDb){
    $('#stockTableSpan').empty();
    var table = '<table class="table plDisplay">'+
        '<tbody id="stockTable">' +
            '<tr>' +
                '<th>Stock</th>' +
                '<th>Buy Price</th>' +
                '<th>Current Price</th>' +
                '<th>Count</th>' +
            '</tr>' +
        '</tbody>' +
        '</table>';

    $('#stockTableSpan').append(table);
    for(var i=0; i<stockDb.length; i++){
        var tr = "<tr>" + "<td>" + stockDb[i]["symbol"] + "</td>" + "<td>" + "$" + stockDb[i]["price"] + "</td>" + "<td>" + "$" + stockDb[i]["curr_price"] + "</td>" + "<td>" + stockDb[i]["count"] + "</td>" + "</tr>"+
        $('#stockTable').append(tr)
    }
}

function show(){
    var stockDb = getStockDb();
    stockDb = JSON.parse(stockDb);
    showStocks(stockDb)
}

function setDefaultStocks(){
    var stockDb = '[{ "symbol": "TSLA", "price": 677.0, "count": 7 }, { "symbol": "AAPL", "price": 133.48, "count": 7 }, { "symbol": "ADBE", "price": 516.09, "count": 7 }, { "symbol": "OXLC", "price": 6.7, "count": 12 }, { "symbol": "ECC", "price": 12.49, "count": 10 }, { "symbol": "AMD", "price": 83.91, "count": 6 }]';
    saveStockDb(stockDb);
}

function chkcontrol(j) {
    var total=0;
    for(var i=0; i < document.form1.investType.length; i++){
        if(document.form1.investType[i].checked){
            total =total +1;}
        if(total > 2){
            alert("Please Select only two");
            document.form1.investType[j].checked = false ;
            return false;
        }
        // document.form1.investType[j].checked = false ;
    }
} 