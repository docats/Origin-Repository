from flask import *
import pymysql
import json
from flask import jsonify

#先去連資料庫
mydb=pymysql.connect(charset='utf8',database='viewsite',host='127.0.0.1',password="root123",port=3306,user='root')

app=Flask(__name__)
#不讓中文呈現亂碼
app.config["JSON_AS_ASCII"]=False
#更改模板時重新加載模板
app.config["TEMPLATES_AUTO_RELOAD"]=True

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

#建立旅遊景點API(頁數和關鍵字)&route
@app.route("/api/attractions",methods=["GET"])
def api_attr():	
	page=request.args.get('page')
	keyword=request.args.get('keyword')
	#如果關鍵字有，將執行下列判斷
	if keyword!=None:
			ender=(int(page)+1)*12
			page=ender-12
			print("here",page,ender)
			#到資料庫去撈資料
			with mydb.cursor(pymysql.cursors.DictCursor) as cursor:
				got=cursor.execute("""
				SELECT id,name,category2,description,address,transport,mrt,latitude,longitude,images
				FROM sites WHERE name like %s LIMIT %s,%s""",(("%"+keyword+"%"),page,ender))
				result=cursor.fetchall() #取出全部資料並放到result中
				count=cursor.rowcount #查詢究竟有哪幾筆資料
				mydb.commit() #送出到資料庫
				if got!=0:
					summary=[] #建立一個列表
					if count<12:
						for site in result:
							tpidata={"id":site["id"],
							"name":site["name"],
							"category":site["category2"],
							"description":site["description"],
							"address":site["address"],
							"transport":site["transport"],
							"mrt":site["mrt"],
							"latitude":site["latitude"],
							"longitude":site["longitude"],
							"images":site["images"]
							}
							summary.append(tpidata)
							final={"nextPage":None,"data":summary}
							return jsonify(final)
					
					for site in result:
							tpidata={"id":site["id"],
							"name":site["name"],
							"category":site["category2"],
							"description":site["description"],
							"address":site["address"],
							"transport":site["transport"],
							"mrt":site["mrt"],
							"latitude":site["latitude"],
							"longitude":site["longitude"],
							"images":site["images"]
							}
							summary.append(tpidata)
							final={"nextPage":int(ender)//12+1,"data":summary}
					return jsonify(final)
				return jsonify({"error":True,"message":"查無資料"})
	else:
		if page==None:
				page=0
		ender=(int(page)+1)*12
		page=ender-11
		with mydb.cursor(pymysql.cursors.DictCursor) as cursor:
			got=cursor.execute("""SELECT id,name,category2,description,address,transport,mrt,latitude,longitude,images FROM sites WHERE id>=%s AND id<=%s """,(page,ender))
			result=cursor.fetchall()
			count=cursor.rowcount
			mydb.commit()
			if got != 0:
				summary=[]
				if count<12:
					for site in result:
						tpidata={"id":site["id"],"name":site["name"],"category":site["category2"],"description":site["description"],"address":site["address"],"transport":site["transport"],"mrt":site["mrt"],"latitude":site["latitude"],"longitude":site["longitude"],"images":site["images"]}
						summary.append(tpidata)
						print(summary)
					final={"nextPage":None,"data":summary}
					return jsonify(final)
				for site in result:
					tpidata={"id":site["id"],"name":site["name"],"category":site["category2"],"description":site["description"],"address":site["address"],"transport":site["transport"],"mrt":site["mrt"],"latitude":site["latitude"],"longitude":site["longitude"],"images":site["images"]}
					summary.append(tpidata)

				final={"nextPage":int(ender)//12,"data":summary}
				return jsonify(final)
			return jsonify({"error":True,"message":"查無資料"})

#製作根據景點編號取得景點資料的api
@app.route("/api/attraction/<attractionId>",methods=["GET"])
def api_id(attractionId):
	with mydb.cursor(pymysql.cursors.DictCursor) as cursor:
		got=cursor.execute("""SELECT id,name,category2,description,address,transport,mrt,latitude,longitude,images FROM sites WHERE id=%s""",(attractionId))
		site=cursor.fetchone() #取出一筆資料
		mydb.commit()
		if got!=0:
			summary={
				"id":site["id"],"name":site["name"],"category":site["category2"],"description":site["description"],"address":site["address"],"transport":site["transport"],"mrt":site["mrt"],"latitude":site["latitude"],"longitude":site["longitude"],"images":site["images"]
				}
			return jsonify({"data":summary})
		return jsonify({"error":True,"message":"查無資料"})

	
if __name__=="__main__":
								
		app.run(host='0.0.0.0',port=3000)