# compute correlation and return investment suggestions during /recommendations

# best use of data? responsible use (read only to coinbase, options to remove from db)
# best ui/ux

# todo:
# move data to /data
# push to git
# fetch coinbase transactions (not found generic 404 error)

import json, hmac, hashlib, time, requests
import pprint
from requests.auth import AuthBase
from flask import Flask, request
from dotenv import load_dotenv
import csv
import os
import psycopg2
import solana
from solana.rpc.api import Client
from solana.publickey import PublicKey

solana_client = Client("https://solana-api.projectserum.com")

coinbaseMod = 100
walletMod = 1000

load_dotenv()

dbStr = os.getenv("cockroachdb")

app = Flask(__name__)

class CoinbaseWalletAuth(AuthBase):
    def __init__(self, api_key, secret_key):
        self.api_key = api_key
        self.secret_key = secret_key
        self.api_url = 'https://api.coinbase.com/v2/'

    def getRequest(self, request):
        timestamp = str(int(time.time()))
        message = timestamp + request.method + request.path_url + (request.body or '')
        message = str(message).encode('utf-8')
        signature = hmac.new(self.secret_key, message, hashlib.sha256).hexdigest()

        request.headers.update({
            'CB-ACCESS-SIGN': signature,
            'CB-ACCESS-TIMESTAMP': timestamp,
            'CB-ACCESS-KEY': self.api_key,
        })
        return request

    def getPriceHistory(self, symbol):
        priceHistory = []
        with open("data/" + symbol + '.json') as f:
            data = json.load(f)
            prices = data['prices']
            for price in prices:
                priceHistory.append((int(price[0]), float(price[1])))
        return priceHistory

    def getLastDayPct(self, symbol):
        priceHistory = self.getPriceHistory(symbol)
        return (priceHistory[-1][1] - priceHistory[-2][1]) / priceHistory[-2][1]

    def getUSDValue(self, symbol, amount):
        return self.getPriceHistory(symbol)[-1][1] * amount

    def getAssets(self):
        r = requests.get(self.api_url + 'accounts', auth=self.getRequest)
        assets = []
        for asset in r.json()['data']:
            if float(asset['balance']['amount']) > 0:
                assets.append({
                    'symbol': asset['currency']['code'],
                    'name': asset['currency']['name'],
                    'category': 'crypto',
                    'base balance': float(asset['balance']['amount'])*coinbaseMod,
                    'quote balance': self.getUSDValue(asset['currency']['code'], float(asset['balance']['amount'])*coinbaseMod),
                    'change': self.getLastDayPct(asset['currency']['code'])
                })
        return assets

    def getPortfolioHistory(self, history):
        for asset in self.getAssets():
            priceHistory = self.getPriceHistory(asset['symbol'])
            for i in range(len(history)):
                history[i][1] += (priceHistory[i][1] * asset['base balance'])
        return history

    def getTransactions(self, symbols):
        # idreq = requests.get(self.api_url + 'user', auth=self.getRequest)
        # id = idreq.json()['data']['id']
        # print(idreq.json())
        # print(id)
        # s = self.api_url + f'accounts/{id}/transactions' 
        # print(s)
        # txreq = requests.get(self.api_url + f'accounts/{id}/transactions', auth=self.getRequest)
        # print(txreq.json())
        assets = self.getAssets()
        res = []
        for asset in assets:
            if asset['symbol'] in symbols:
                res.append({"symbol": asset['symbol'], "change": asset['base balance'], "source": "coinbase", "timestamp": 1649465100})
        return res

class RobinhoodAuth():
    def __init__(self):
        equities = [('TSLA', 'Tesla', 1), ('AAPL', 'Apple', 1.2), ('NVDA', 'NVIDIA', 2), ('JNJ', 'Johnson & Johnson', 0.5), ('F', 'Ford', 0.3), ('GM', 'General Motors', 6), ('GE', 'General Electric', 10), ('GOOG', 'Google', 0.3), ('ARKW', 'ARK Next Generation Internet ETF', 1)]
        crypto = [('ETH', 'Ethereum', 0.5), ('BTC', 'Bitcoin', 0.2)]
        resp = []
        for asset in equities:
            resp.append({
                'symbol': asset[0],
                'name': asset[1],
                'category': 'equity',
                'base balance': asset[2],
                'quote balance': self.getUSDValue(asset[0], asset[2]),
                'change': self.getLastDayPct(asset[0])
            })

        for asset in crypto:
            resp.append({
                'symbol': asset[0],
                'name': asset[1],
                'category': 'crypto',
                'base balance': asset[2],
                'quote balance': self.getUSDValue(asset[0], asset[2], False),
                'change': self.getLastDayPct(asset[0], False)
            })
        self.assets = resp
    
    def getPriceHistory(self, symbol, equity=True):
        priceHistory = []
        if equity:
            with open("data/" + symbol + ".csv") as f:
                csvReader = csv.reader(f)
                first = True
                for row in csvReader:
                    if first:
                        first = False
                    else:
                        price = row[1]
                        if price[0] == "$":
                            price = price[1:]
                        priceHistory.append((row[0], float(price)))
            return priceHistory[::-1]
        else:
            with open("data/" + symbol + '.json') as f:
                data = json.load(f)
                prices = data['prices']
                for price in prices:
                    priceHistory.append((int(price[0]), float(price[1])))
            
            return priceHistory

    def getLastDayPct(self, symbol, equity=True):
        priceHistory = self.getPriceHistory(symbol, equity)
        return (priceHistory[-1][1] - priceHistory[-2][1]) / priceHistory[-2][1]

    def getUSDValue(self, symbol, amount, equity=True):
        return self.getPriceHistory(symbol, equity)[-1][1] * amount

    def getAssets(self):
        return self.assets

    def getPortfolioHistory(self):
        history = []
        first = True
        for asset in self.assets:
            isEquity = (asset['category'] == 'equity')
            priceHist = self.getPriceHistory(asset['symbol'], isEquity)
            if first:
                for price in priceHist:
                    history.append([price[0], price[1] * asset['base balance']])
                first = False
            else:
                for i in range(len(history)):
                    history[i][1] += (priceHist[i][1] * asset['base balance'])
        return history

    def getTransactions(self, symbols):
        assets = self.getAssets()
        res = []
        for asset in assets:
            if asset['symbol'] in symbols:
                res.append({"symbol": asset['symbol'], "change": asset['base balance'], "source": "robinhood", "timestamp": 1618966652})
        return res

class WalletAuth():
    def __init__(self, address):
        self.address = address

    def getPriceHistory(self, symbol):
        priceHistory = []
        with open("data/" + symbol + '.json') as f:
            data = json.load(f)
            prices = data['prices']
            for price in prices:
                priceHistory.append((int(price[0]), float(price[1])))
        return priceHistory

    def getLastDayPct(self, symbol):
        priceHistory = self.getPriceHistory(symbol)
        return (priceHistory[-1][1] - priceHistory[-2][1]) / priceHistory[-2][1]

    def getUSDValue(self, symbol, amount):
        return self.getPriceHistory(symbol)[-1][1] * amount

    def getAssets(self):
        pubkey = PublicKey(self.address)
        resp = solana_client.get_balance(pubkey)
        val = int(resp['result']['value'])*walletMod/(10**9)
        return [{'symbol': 'SOL', 'name': 'Solana', 'category': 'crypto', 'base balance': val, 'quote balance': self.getUSDValue('SOL', val), 'change': self.getLastDayPct('SOL')}]

    def getPortfolioHistory(self, history):
        for asset in self.getAssets():
            priceHistory = self.getPriceHistory(asset['symbol'])
            for i in range(len(history)):
                history[i][1] += (priceHistory[i][1] * asset['base balance'])
        return history

    def getTransactions(self, symbols):
        assets = self.getAssets()
        res = []
        for asset in assets:
            if asset['symbol'] in symbols:
                blnc = asset['base balance']
                txs = [blnc, blnc/2, -blnc/2]
                i = 0
                for tx in txs:
                    res.append({"symbol": asset['symbol'], "change": tx, "source": "wallet", "timestamp": 1649465000 + i})
                    i += 1
        return res

@app.route("/")
def root():
    return "Welcome to Comprefinsive!"

@app.route("/<username>", methods=["GET"])
def get_user(username):
    return f"Hello, {username}!"

@app.route("/<username>/wallet/<address>", methods=["POST"])
def add_wallet(username, address):
    conn = psycopg2.connect(dbStr, sslmode="verify-full")
    with conn.cursor() as cur:
        cur.execute("INSERT INTO user_wallets (username, address) VALUES (%s, %s)", (username, address))
        conn.commit()
    return "ok"

@app.route("/<username>/wallet", methods=["DELETE"])
def remove_wallet(username):
    conn = psycopg2.connect(dbStr, sslmode="verify-full")
    with conn.cursor() as cur:
        cur.execute("DELETE FROM user_wallets WHERE username = %s", (username,))
        conn.commit()
    return "ok"

@app.route("/<username>", methods=["DELETE"])
def remove_data(username):
    conn = psycopg2.connect(dbStr, sslmode="verify-full")
    with conn.cursor() as cur:
        cur.execute("DELETE FROM transactions WHERE username = %s", (username,))
        cur.execute("DELETE FROM users WHERE username = %s", (username,))
        conn.commit()
    return "ok"

@app.route("/<username>/assets", methods=["GET"])
def get_assets(username):
    print("connecting to db")
    conn = psycopg2.connect(dbStr, sslmode="verify-full")
    with conn.cursor() as cur:
        print("connected to db")
        cur.execute("SELECT * FROM api_keys WHERE username = %s", (username,))
        keys = cur.fetchall()
        api_key = keys[0][1]
        api_secret = keys[0][2].encode('utf-8')

        coinbaseInfo = CoinbaseWalletAuth(api_key, api_secret)
        robinhoodInfo = RobinhoodAuth()

        data = {}
        data["coinbase"] = coinbaseInfo.getAssets()
        data["robinhood"] = robinhoodInfo.getAssets()

        print("got assets")
        cur.execute("SELECT * FROM user_wallets WHERE username = %s", (username,))
        dat = cur.fetchall()
        walletInfo = None
        if dat:
            address = dat[0][1]
            walletInfo = WalletAuth(address)
            data["wallet"] = walletInfo.getAssets()

        print("deduping")
        symbols = []
        dedup = {}
        for source in data.keys():
            for asset in data[source]:
                if asset['symbol'] not in dedup:
                    symbols.append(asset['symbol'])
                    dedup[asset['symbol']] = {
                        'symbol': asset['symbol'],
                        'name': asset['name'],
                        'category': asset['category'],
                        'base balance': asset['base balance'],
                        'quote balance': asset['quote balance'],
                        'change': asset['change']
                    }
                else:
                    dedup[asset['symbol']]['base balance'] += asset['base balance']
                    dedup[asset['symbol']]['quote balance'] += asset['quote balance']
        final = []
        for asset in dedup.values():
            final.append(asset)

        print("updating txs")
        cur.execute("DELETE FROM transactions WHERE username = %s", (username,))
        conn.commit()

        allTxs = []
        coinbaseTxs = coinbaseInfo.getTransactions(symbols)
        robinhoodTxs = robinhoodInfo.getTransactions(symbols)
        if dat:
            walletTxs = walletInfo.getTransactions(symbols)
            allTxs += walletTxs
        allTxs += coinbaseTxs
        allTxs += robinhoodTxs
        print(allTxs)
        for tx in allTxs:
            cur.execute("INSERT INTO transactions VALUES (%s, %s, %s, %s, %s)", (username, tx['symbol'], tx['change'], tx['source'], tx['timestamp']))

        conn.commit()

        return json.dumps(final)

@app.route("/<username>/portfolio", methods=["GET"])
def get_portfolio(username):
    conn = psycopg2.connect(dbStr, sslmode="verify-full")
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM api_keys WHERE username = %s", (username,))
        keys = cur.fetchall()
        api_key = keys[0][1]
        api_secret = keys[0][2].encode('utf-8')

        coinbaseInfo = CoinbaseWalletAuth(api_key, api_secret)
        robinhoodInfo = RobinhoodAuth()

        priceHistory = robinhoodInfo.getPortfolioHistory()
        priceHistory = coinbaseInfo.getPortfolioHistory(priceHistory)

        cur.execute("SELECT * FROM user_wallets WHERE username = %s", (username,))
        dat = cur.fetchall()
        if dat:
            address = dat[0][1]
            walletInfo = WalletAuth(address)
            priceHistory = walletInfo.getPortfolioHistory(priceHistory)

        return json.dumps(priceHistory)

@app.route("/<username>/transactions/<symbol>", methods=["GET"])
def get_transactions(username, symbol):
    conn = psycopg2.connect(dbStr, sslmode="verify-full")
    with conn.cursor() as cur:
        cur.execute("SELECT * FROM transactions WHERE username = %s", (username,))
        res = []
        for tx in cur.fetchall():
            if tx[1] == symbol.upper():
                res.append({
                    'symbol': tx[1],
                    'change': float(tx[2]),
                    'source': tx[3],
                    'timestamp': int(tx[4])
                })

        return json.dumps(res)
