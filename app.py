from flask import *
import pymysql  # 匯入資料庫模組
from flask import request  # 載入Request物件(要取得POST參數值)
from flask import redirect  # 載入redirect函式
from flask import render_template  # 使用樣板引擎
from flask import session  # 使用session
from flask import jsonify  # 使用jsonify
from flask import Response
import json

# 先去連資料庫
mydb = pymysql.connect(charset='utf8', database='viewsite',
                       host='127.0.0.1', password="root123", port=3306, user='root')

app = Flask(__name__)
# 不讓中文呈現亂碼
app.config["JSON_AS_ASCII"] = False
# 更改模板時重新加載模板
app.config["TEMPLATES_AUTO_RELOAD"] = True

# 使用 Session密鑰
app.secret_key = "any string but secret"


# Pages
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@app.route("/booking")
def booking():
    return render_template("booking.html")


@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")

# 建立旅遊景點API(頁數和關鍵字)&route


@app.route("/api/attractions", methods=["GET"])
def api_attr():
    page = request.args.get('page', 0)  # 輸入甚麼頁數就得到第幾頁(當前頁面)，這邊已經先把page=0
    # print('page123:',page)
    keyword = request.args.get('keyword')  # 會去抓關鍵字
    # print("keyword:",keyword)
    # 如果關鍵字有，將執行下列判斷
    # print("page:",page)
    if keyword != None:
        # 到資料庫去撈資料
        with mydb.cursor(pymysql.cursors.DictCursor) as cursor:
            # offsetCount = (int(page)-1)*12
            offsetCount = (int(page))*12
            # print("offsetCount:",offsetCount)
            sql = "SELECT * from sites where `name` like %s limit 12 offset %s"
            cursor.execute(sql, ('%'+keyword+'%', offsetCount,))
            # cursor.execute("SELECT * FROM sites WHERE name LIKE %s LIMIT %s,12",("%"+keyword+"%",page*12,))
            result = cursor.fetchall()  # 取出全部資料並放到result中
            # print("result132:",result)
            # print("result:",result,type(result))
            count = cursor.rowcount  # 查詢究竟有哪幾筆資料
            mydb.commit()  # 送出到資料庫
            if result != None:
                summary = []  # 建立一個列表
                for site in result:
                    tpidata = {"id": site["id"],
                               "name": site["name"],
                               "category": site["category2"],
                               "description": site["description"],
                               "address": site["address"],
                               "transport": site["transport"],
                               "mrt": site["mrt"],
                               "latitude": site["latitude"],
                               "longitude": site["longitude"],
                               # json不接受''當字串，因故使用\"跳脫字元
                               "images": json.loads(site["images"].replace("'", "\""))
                               }
                    summary.append(tpidata)
                    # final={"nextPage":None,"data":summary}
                if(len(summary) < 12):  # 當資料小於12筆(資料是0-11開始)
                    # 少於12筆沒有分頁
                    return jsonify({"nextPage": None, "data": summary})
                # 下一頁
                return jsonify({"nextPage": int(page)+1, "data": summary})
            return jsonify({"error": True, "message": "查無資料"})
    else:
        # if page==None:
        # 		page=0
        ender = ((int(page)+1)*12)  # 當前頁面+1並*12
        # page=ender-11
        cpage = ender/12
        # print("cpage",cpage)
        # print("ender:",ender)
        # print("page==None:",page)
        with mydb.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT * FROM sites LIMIT %s,12 ", (int(page)*12,))
            result = cursor.fetchall()
            count = cursor.rowcount  # 查詢究竟有哪幾筆資料
            mydb.commit()
            if result != None:
                summary = []
                if count < 12:
                    for site in result:
                        tpidata = {"id": site["id"], "name": site["name"], "category": site["category2"], "description": site["description"], "address": site["address"],
                                   "transport": site["transport"], "mrt": site["mrt"], "latitude": site["latitude"], "longitude": site["longitude"], "images": json.loads(site["images"].replace("'", "\""))}
                        summary.append(tpidata)
                    final = {"nextPage": None, "data": summary}
                    return jsonify(final)
                for site in result:
                    tpidata = {"id": site["id"], "name": site["name"], "category": site["category2"], "description": site["description"], "address": site["address"],
                               "transport": site["transport"], "mrt": site["mrt"], "latitude": site["latitude"], "longitude": site["longitude"], "images": json.loads(site["images"].replace("'", "\""))}
                    # tpidata["images"]=json.loads(tpidata["images"]) #轉換json格式
                    summary.append(tpidata)

                # final={"nextPage":int(ender)//12,"data":summary}
                # nextpage下一頁
                final = {"nextPage": int(cpage), "data": summary}
                return jsonify(final)
            return jsonify({"error": True, "message": "查無資料"})

# 製作根據景點編號取得景點資料的api


@app.route("/api/attraction/<attractionId>", methods=["GET"])
def api_id(attractionId):
    with mydb.cursor(pymysql.cursors.DictCursor) as cursor:
        got = cursor.execute(
            """SELECT id,name,category2,description,address,transport,mrt,latitude,longitude,images FROM sites WHERE id=%s""", (attractionId))
        site = cursor.fetchone()  # 取出一筆資料
        mydb.commit()
        if got != 0:
            summary = {
                "id": site["id"], "name": site["name"], "category": site["category2"], "description": site["description"], "address": site["address"], "transport": site["transport"], "mrt": site["mrt"], "latitude": site["latitude"], "longitude": site["longitude"], "images": json.loads(site["images"].replace("'", "\""))
            }
            # summary["data"]["images"]=json.loads(summary["data"]["images"]) #轉換json格式
            return jsonify({"data": summary})
        return jsonify({"error": True, "message": "查無資料"})


# 使用者的動作
@app.route("/api/user", methods=["POST", "GET", "PATCH", "DELETE"])
async def userStatus():
    # 我要註冊帳號
    if request.method == 'POST':
        # name = request.json['name']  # 取得表格輸入的姓名
        # email = request.json['email']  # 取得表格輸入的E-mail
        password = request.json['psw']
        print(password)
        session["name"] = request.json['name']  # 取得表格輸入的姓名並存在session的name
        # 取得表格輸入的E-mail並存在session的E-mail
        session["email"] = request.json['email']
        name = session["name"]  # 把後端session中name的欄位丟回給前端的name
        email = session["email"]
        print(name, email, password)
        if name == "" and email == "" and password == "":
            print("註冊帳號不能甚麼都不輸入喔")
            return Response(json.dumps(
                {"error": True,
                 "message": "註冊不能都不輸入喔"}),
                status=400, mimetype='application/json')

        with mydb.cursor(pymysql.cursors.DictCursor) as cursor:
            got = cursor.execute(
                "SELECT email FROM member where email=%s", (email,))
            cursor.close()  # 不用cursor會打架
            # mydb.commit() #確定要更新資料庫

            if got != 0:
                print("帳號已經被註冊")
                mydb.close()
                return Response(json.dumps(
                    {"error": True,
                     "message": "帳號已經被註冊"}),
                    status=400, mimetype='application/json')
            else:
                with mydb.cursor(pymysql.cursors.DictCursor) as cursor:
                    result = cursor.execute(
                        "INSERT INTO member(name,email,password) VALUES (%s,%s,%s)", (name, email, password))
                    mydb.commit()  # 確定要更新資料庫
                    print("結果:", result)
                    if got == 0:  # 帳號或密碼打錯字
                        print("註冊失敗，帳號或密碼錯誤")
                        return Response(json.dumps(
                            {"error": True,
                             "message": "註冊失敗，帳號或密碼錯誤"}),
                            status=400, mimetype='application/json')
                    elif got == 1:
                        print("新增", result, "筆，恭喜記錄成功")
                        return Response(json.dumps(
                            {"ok": True}), status=200, mimetype='application/json')
    # 登入後的使用者狀態
    if request.method == 'GET':
        if session.get("email"):
            id=session.get("id")
            name=session.get("name")
            email=session.get("email")
            print(id,name,email)
            return jsonify({"data":{"id":id,"name":name,"email":email}})            
        else:
            print("登入失敗，甚麼資料都拿不到")
            return jsonify({"data": None})

    # 我要登入
    if request.method == 'PATCH':
        email = request.json['email']  # 取得表格輸入的E-mail
        password = request.json['psw']  # 取得表格輸入的密碼
        print(email,password)
        # email=session["email"] #把後端session中email的欄位丟回給前端的email
        if email == "" or password == "":
            print("登入失敗，帳號或密碼為空")
            return Response(json.dumps(
                {"error": True,
                 "message": "登入失敗，帳號或密碼為空"}),
                status=400, mimetype='application/json')
        with mydb.cursor(pymysql.cursors.DictCursor) as cursor:
            got = cursor.execute(
                "SELECT * FROM member WHERE  email=%s and password=%s" , (email, password))   
            result = cursor.fetchone()  # 僅讀一筆紀錄
            # cursor.close()
            mydb.commit()  # 確定要更新資料庫
            print("印",result)
            if got == 0:  # 帳號或密碼打錯字
                print("登入失敗，帳號或密碼錯誤")
                return Response(json.dumps(
                    {"error": True,
                     "message": "登入失敗，帳號或密碼錯誤"}),
                    status=400, mimetype='application/json')
            if got == 1:  # 帳號或密碼打對了
                    session["email"]=email #把email放到session
                    session["name"]=result["name"] #把從資料庫的name放到session
                    session["id"]=result["id"] 
                    print("登入成功123")
                    return Response(json.dumps(
                        {"ok": True}), status=200, mimetype='application/json')
            else:
                print("登入失敗，帳號或密碼錯誤或其他原因")
                return Response(json.dumps(
                    {"error": True,
                        "message": "登入失敗，帳號或密碼錯誤或其他原因"}),
                    status=400, mimetype='application/json')
        # return Response(json.dumps(
        #                     {"error": True,
        #                     "message": "內部伺服器錯誤"}),
        #                     status=500, mimetype='application/json')
    if request.method == 'DELETE':
        session.pop("id", None)  # 登出使用pop()方法把session紀錄刪除
        session.pop("name", None)
        session.pop("email", None)
        return Response(json.dumps(
                        {"error": True,
                         "message": "登出成功"}),
                        status=200, mimetype='application/json')

if __name__ == "__main__":

    app.run(host='0.0.0.0', port=3000)
