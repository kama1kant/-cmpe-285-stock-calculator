$(function () {
    $(".plDisplay").hide();
    if (localStorage.getItem("stock_db") === null) {
        $('#btnPortfolio').hide();
    }

    $('#btnBuyStocks').click(function () {
        console.log("Buying stocks!")
        var amount = $('#amount').val();
        var investType = [];
        $.each($('.investType:checkbox:checked'), function () {
            investType.push($(this).val());
        });
        
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
        },
        error: function (error) {
            console.log(error);
        }
    });
}


function getStocks(param) {
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
            $("#pl").text(data["pl"]);
            $("#plPercent").text(data["pl_percent"]);
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
    // $('#stockTable').empty();
    for(var i=0; i<stockDb.length; i++){
        var tr = "<tr>" + "<td>" + stockDb[i]["symbol"] + "</td>" + "<td>" + stockDb[i]["price"] + "</td>" + "<td>" + stockDb[i]["curr_price"] + "</td>" + "<td>" + stockDb[i]["count"] + "</td>" + "</tr>"+
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