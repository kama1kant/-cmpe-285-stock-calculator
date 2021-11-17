from flask import Flask, render_template, request, json
import json
from stock_engine import *

app = Flask(__name__)

@app.route('/')
def hello():
    return "Hello World!"

@app.route('/stockEngine')
def signUp():
    return render_template('index.html')

@app.route('/buyStocks', methods=['POST'])
def buyStocks():
    amount =  request.form['amount'];
    invest_type = request.form['investType'];
    invest_type = json.loads(invest_type)
    
    stock_db = buy(amount, invest_type)
    
    return json.dumps({'status':'OK','stock_db': stock_db});

@app.route('/getStocks', methods=['POST'])
def getStocks():
    stock_db = request.form['stock_db'];
    stock_db = json.loads(stock_db)
    print(stock_db[0])

    pl, pl_percent, new_stock_db = calculate_pl(stock_db)
    print([pl, pl_percent])
    return json.dumps({'status':'OK','stock_db': new_stock_db, 'pl':pl, 'pl_percent':pl_percent});



if __name__=="__main__":
    app.run()