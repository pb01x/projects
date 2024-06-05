import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    db = SQL("sqlite:///finance.db")
    data=db.execute("SELECT * FROM shares WHERE uid=?",session["user_id"])
    outp={}
    totalx=0;
    for d in data:
        if d["symb"] in outp:
            outp[d["symb"]]["qty"]+= d["qty"]
            t=d["qty"]*outp[d["symb"]]["price"]
            outp[d["symb"]]["total"]+= t
            totalx+=t
        else:
            outp[d["symb"]]={}
            unitprice=lookup(d["symb"])["price"]
            outp[d["symb"]]["qty"]=d["qty"]
            outp[d["symb"]]["price"]=unitprice
            outp[d["symb"]]["total"]=unitprice*d["qty"]
            totalx+=outp[d["symb"]]["total"]

    userinf=db.execute("SELECT cash FROM users WHERE id=?",session["user_id"])

    return render_template("/index.html",data={"tran":outp, "cash":userinf[0]["cash"], "gtotal":userinf[0]["cash"]+totalx})


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    if request.method == "GET":
        return render_template("/buy.html")
    else:
        symb=request.form.get("symbol");
        qty=request.form.get("shares");
        if not symb:
            return apology("Symbol cannnot be empty")
        if not qty:
            return apology("shares cannot be empty")
        try:
            qty=int(qty)
        except:
            return apology("Invalid Share quantity")

        if qty<0:
            return apology("Invalid Share quantity")

        return buysell(symb,qty);


def buysell(symb,qty):
    q=lookup(symb);
    if q==None:
        return apology("cannot find symbol")
    unitprice=q["price"]

    totalcost=unitprice*qty
    db = SQL("sqlite:///finance.db")
    userinf=db.execute("SELECT cash FROM users WHERE id=?",session["user_id"]);
    if totalcost>userinf[0]["cash"]:
        return apology("Insufficient Balance")

    db.execute("BEGIN TRANSACTION");
    db.execute("INSERT INTO shares (uid,symb,qty,price) VALUES (?,?,?,?)",session["user_id"], symb, qty, unitprice)
    db.execute("UPDATE  users SET cash=cash-? WHERE id=?", totalcost,session["user_id"])
    db.execute("COMMIT");
    return apology("Successful",1)


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    db = SQL("sqlite:///finance.db")
    data=db.execute("SELECT * FROM shares WHERE uid=?",session["user_id"])
    return render_template("/history.html", data=data)



@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    if request.method=="GET":
        return render_template("/quote.html", msg={ "issuccess":0,"outx":""})
    else:
        symb=request.form.get("symbol")
        if not symb:
            return apology("Symbol cannot be empty")
            # return render_template("/quote.html",msg={ "issuccess":0,"outx":"Symbol cannot be empty"})

        finalout=lookup(symb)
        if finalout==None:
              return apology("Cannot find the symbol")
            #  return render_template("/quote.html",msg={ "issuccess":0,"outx":"Cannot find the symbol"})

        return render_template("/quote.html",msg={ "issuccess":1, "outx": finalout })


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method=="POST":
        """Register user"""

        username=request.form.get("username");
        password=request.form.get("password");

        if password != request.form.get("confirmation"):
            return apology("Password didnt match")
            # return render_template("/register.html", msg="Password didnt match");
        if not username:
            return apology("Username Cannot be empty")
            # return render_template("/register.html", msg="Username Cannot be empty");
        if not password:
            return apology("Password Cannot be empty")
            # return render_template("/register.html", msg="Password Cannot be empty");

        db = SQL("sqlite:///finance.db")

        datax= db.execute("SELECT id FROM users WHERE username=?",username)
        # print(len(datax))
        if len(datax)>0:
             return apology("This Username is not available.")
            # return render_template("/register.html", msg="This Username is not available.");

        pswd=generate_password_hash(password);
        db.execute("INSERT INTO users (username,hash) VALUES(?,?)", username,pswd);

        return login()
        # data= db.select("SELECT id FROM users WHERE username=?",username);
        # # print(data[0]["db"]);
        # session["user_id"] = data[0]["id"]


    else:
        return render_template("/register.html");




@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
    if request.method=="GET":
        db = SQL("sqlite:///finance.db")
        symbs=db.execute("SELECT distinct(symb) FROM shares WHERE uid=?",session["user_id"])
        return render_template("/sell.html",symbs=symbs)
    if request.method=="POST":
        qty=request.form.get("shares")
        symb=request.form.get("symbol")
        if not qty:
            return apology("Quantity cannot be empty")
        try:
            qty=int(qty)
        except:
            return apology("Invalid Quantity")

    return buysell(symb,-qty)

