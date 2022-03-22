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
	page=request.args.get('page',0) #輸入甚麼頁數就得到第幾頁(當前頁面)
	print('page123:',page)
	keyword=request.args.get('keyword') #會去抓關鍵字
	print("keyword:",keyword)
	#如果關鍵字有，將執行下列判斷
	print("page:",page)
	if keyword!=None:
			# ender=(int(page)+1)*12 #12
			# page=ender-12 #12筆資料
			#netpage是當前的頁面+1(目標)
			# vpage=ender-1 #-11		
   
			# print("here","page:",page,"ender:",ender,"vpage:",vpage)
			#到資料庫去撈資料
			with mydb.cursor(pymysql.cursors.DictCursor) as cursor:
       
				# sql="SELECT * FROM `viewsite`.`sites` WHERE name LIKE '%s' LIMIT %s,12"%("%"+keyword+"%",page)
				# print("sql:",sql)
				offsetCount = (int(page)+1) 
				print("offsetCount:",offsetCount)
				sql="SELECT * from sites where `name` like %s limit 12 offset %s"
				cursor.execute(sql,('%'+keyword+'%',offsetCount,))
				# cursor.execute("SELECT * FROM sites WHERE name LIKE %s LIMIT %s,12",("%"+keyword+"%",page*12,))
				result=cursor.fetchall() #取出全部資料並放到result中
				print("result132:",result)
				# print("result:",result,type(result))
				count=cursor.rowcount #查詢究竟有哪幾筆資料
				
				mydb.commit() #送出到資料庫
				
				if result!=None:
					summary=[] #建立一個列表
					if count<12:
						for site in result:
							# print('site["images"]',site["images"])
							tpidata={"id":site["id"],
							"name":site["name"],
							"category":site["category2"],
							"description":site["description"],
							"address":site["address"],
							"transport":site["transport"],
							"mrt":site["mrt"],
							"latitude":site["latitude"],
							"longitude":site["longitude"],
							"images":json.loads(site["images"].replace("'","\"")) #json不接受''當字串，因故使用\"跳脫字元
							}
							
       
							# tpidata["images"] = json.dumps(tpidata["images"]) #j變成字串
							# tpidata["images"]=json.loads(tpidata["images"])
							
							# k=json.loads(j) #變字典
							
							# print("tpidata:",tpidata["images"],type(tpidata["images"]))
							# print("123:",tpidata["images"],type(tpidata["images"]))
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
							"images":json.loads(site["images"].replace("'","\"")) #json不接受''當字串，因故使用\"跳脫字元
							}
							# tpidata["images"]=json.loads(tpidata["images"]) #轉換json格式
							page=request.args.get('page') #輸入甚麼頁數就得到第幾頁
							
							summary.append(tpidata)
							# final={"nextPage":int(ender)-int(vpage),"data":summary} #12+1 測試 (請問這是對的嗎?分頁怎麼看?)
							
							
							final={"nextPage":int(page)+1,"data":summary}
							return jsonify(final)
				return jsonify({"error":True,"message":"查無資料"})
	else:
		# if page==None:
		# 		page=0
		ender=((int(page)+1)*12) #當前頁面+1並*12
		# page=ender-11
		cpage=ender/12
		print("cpage",cpage)
		print("ender:",ender)
		print("page==None:",page)
		with mydb.cursor(pymysql.cursors.DictCursor) as cursor:
			cursor.execute("SELECT * FROM sites LIMIT %s,12 ",(int(page)*12,))
			result=cursor.fetchall()
			count=cursor.rowcount #查詢究竟有哪幾筆資料
			mydb.commit()
			if result != None:
				summary=[]
				if count<12:
					for site in result:
						tpidata={"id":site["id"],"name":site["name"],"category":site["category2"],"description":site["description"],"address":site["address"],"transport":site["transport"],"mrt":site["mrt"],"latitude":site["latitude"],"longitude":site["longitude"],"images":json.loads(site["images"].replace("'","\""))}
						summary.append(tpidata)
					final={"nextPage":None,"data":summary}
					return jsonify(final)
				for site in result:
					tpidata={"id":site["id"],"name":site["name"],"category":site["category2"],"description":site["description"],"address":site["address"],"transport":site["transport"],"mrt":site["mrt"],"latitude":site["latitude"],"longitude":site["longitude"],"images":json.loads(site["images"].replace("'","\""))}
					# tpidata["images"]=json.loads(tpidata["images"]) #轉換json格式
					summary.append(tpidata)

				# final={"nextPage":int(ender)//12,"data":summary}
				final={"nextPage":int(cpage),"data":summary} #nextpage下一頁
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
				"id":site["id"],"name":site["name"],"category":site["category2"],"description":site["description"],"address":site["address"],"transport":site["transport"],"mrt":site["mrt"],"latitude":site["latitude"],"longitude":site["longitude"],"images":json.loads(site["images"].replace("'","\""))
				}
			# summary["data"]["images"]=json.loads(summary["data"]["images"]) #轉換json格式
			return jsonify({"data":summary})
		return jsonify({"error":True,"message":"查無資料"})

	
if __name__=="__main__":
								
		app.run(host='0.0.0.0',port=3000)