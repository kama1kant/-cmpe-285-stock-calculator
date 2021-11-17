import requests
from flask import Flask, render_template, request
import yfinance as yf
import json
import time

now = time.strftime("%c")

ethical_investing = ["TSLA", "AAPL", "ADBE"]
growth_investing = ["OXLC", "ECC", "AMD"]
index_investing = ["VOO", "VTI", "ILTB"]
quality_investing = ["NVDA", "MU", "CSCO"]
value_investing = ["INTC", "BABA", "GE"]


def get_stock_info(ticker):
    symbol = yf.Ticker(ticker)

    price = symbol.history(period="2d")
    cur_price = round(price['Close'][1], 2)
    change = round((price['Close'][1] - price['Close'][0]), 2)
    change_percent = round((change/price['Close'][0])*100, 2)
    curr_time = now
    name = symbol.info["longName"] + " (" + symbol.info["symbol"] + ")"

    return [name, cur_price, curr_time, change, change_percent]

def isTickerValid(ticker):
    symbol = yf.Ticker(ticker)
    return not symbol.history(period="max").empty

def get_stock_quote(stock_list):
    stock_db = {}
    for ticker in stock_list:
        stock_info = {}
        if isTickerValid(ticker):
            result = get_stock_info(ticker)
            success = True
            stock_db[ticker] = {"price": result[1]}
        else:
            success = False
    return stock_db

def generate_stock_db(invest_type):
    stock_tickers = get_suggested_stocks(invest_type)
    return get_stock_quote(stock_tickers)

def buy_stocks(amt, stock_db):
    stock_count = {}
    symbols = list(stock_db.keys())
    i=0
    while is_amt_enough(amt, stock_db):
        stock = stock_db[symbols[i]]

        if amt > float(stock["price"]):
            amt -= float(stock["price"])
            if symbols[i] not in stock_count.keys():
                stock_count[symbols[i]] = 0
            stock_count[symbols[i]] += 1
        
        i += 1
        i = i % len(symbols)

    return stock_count

def get_my_stocks(stock_count, stock_db):
    my_stock_db = []
    stock_tickers = list(stock_count.keys())
    for symbol in stock_tickers:
        my_stock = {}
        my_stock["symbol"] = symbol
        my_stock["price"] = stock_db[symbol]["price"]
        my_stock["count"] = stock_count[symbol]
        my_stock_db.append(my_stock)
    return my_stock_db

def is_amt_enough(amt, stock_db):
    for symbol, value in stock_db.items():
        if amt >= float(value["price"]):
            return True
    return False

def get_amt_invested(my_stock_db):
    amt = 0
    for stock in my_stock_db:
        amt += float(stock["price"])*float(stock["count"])
    return amt

def get_curr_portfolio(my_stock_db):
    stock_tickers = []
    new_stock_arr = []
    for stock in my_stock_db:
        stock_tickers.append(stock["symbol"])
    
    stock_db = get_stock_quote(stock_tickers)
    amt = 0
    print(stock_tickers)
    print(stock_db)
    for stock in my_stock_db:
        new_stock = {}
        new_stock["symbol"] = stock["symbol"]
        new_stock["price"] = stock["price"]
        new_stock["curr_price"] = stock_db[stock["symbol"]]["price"]
        new_stock["count"] = stock["count"]
        new_stock_arr.append(new_stock)
        amt += float(stock_db[stock["symbol"]]["price"] * stock["count"])
    return amt, new_stock_arr

def get_suggested_stocks(strategies):
    stock_tickers = []
    for strategy in strategies:
        if strategy == "ethical":
            stock_tickers += ethical_investing
        elif strategy == "growth":
            stock_tickers += growth_investing
        elif strategy == "index":
            stock_tickers += index_investing
        elif strategy == "quality":
            stock_tickers += quality_investing
        elif strategy == "value":
            stock_tickers += value_investing
        elif strategy == "None":
            return False
    return stock_tickers
            
def calculate_pl(my_stock_db):
    toal_invested = get_amt_invested(my_stock_db)
    curr_value, new_stock_db = get_curr_portfolio(my_stock_db)

    print(toal_invested, curr_value)
    pl = float(curr_value - toal_invested)
    pl_percent = (pl/toal_invested)*100

    print("P&L {}".format(pl))
    print("P&L Percentage {}".format(pl_percent))
    return pl, pl_percent, new_stock_db


def buy(amount, invest_type):
    print("buying stocks")
    stock_db = generate_stock_db(invest_type)
    stock_count = buy_stocks(10000, stock_db)
    my_stock_db = get_my_stocks(stock_count, stock_db)
    return my_stock_db





# stock_tickers = get_suggested_stocks(["Ethical Investing", "Growth Investing"])
# stock_db = get_stock_quote(stock_tickers)

# stock_db = {"TSLA": {"price": 677.0}, "AAPL": {"price": 133.48}, "ADBE": {"price": 516.09}, "OXLC": {"price": 6.7}, "ECC": {"price": 12.49}, "AMD": {"price": 83.91}}

# stock_count = buy_stocks(10000, stock_db)
# my_stock_db = get_my_stocks(stock_count, stock_db)
# toal_invested = get_amt_invested(my_stock_db)

# print(json.dumps(my_stock_db))
# print(toal_invested)


# my_stock_db = [{"symbol": "TSLA", "price": 677.0, "count": 7}, {"symbol": "AAPL", "price": 133.48, "count": 7}, {"symbol": "ADBE", "price": 516.09, "count": 7}, {"symbol": "OXLC", "price": 6.7, "count": 12}, {"symbol": "ECC", "price": 12.49, "count": 10}, {"symbol": "AMD", "price": 83.91, "count": 6}]

