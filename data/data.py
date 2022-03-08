import json
import pymysql
import os
datas= open("taipei-attractions.json",encoding="utf-8")
tpi_json=json.load(datas)


#建立table名字叫sites
def bulid(mydb):
    cursor.execute('DROP TABLE IF EXISTS sites')
    sql = """CREATE TABLE sites(
        id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name varchar(255) NOT NULL,
        category varchar(255),
        category2 varchar(255),
        description TEXT,
        address varchar(255),
        transport TEXT,
        mrt varchar(255),
        latitude double, 
        longitude double,
        images TEXT
    )"""
    cursor.execute(sql) #執行資料庫欄位設定命令
    mydb.commit() #確認執行提交到SQL

#將tpi_json的json資料寫入資料庫
def insert_data(mydb):
    #要用到資料庫時的語法
    with mydb.cursor() as cursor:
        sites=tpi_json["result"]["results"]
        for site in sites:
            images=[]
            pics=site["file"].lower().split("jpg")
            name=site["stitle"]
            cat1=site["CAT1"]
            cat2=site["CAT2"]
            des=site["xbody"]
            add=site["address"]
            trans=site["info"]
            mrt=site["MRT"]
            lati=site["latitude"]
            longi=site["longitude"]
            for pic in pics:
                if pic.endswith("."):
                    img=pic+"jpg"
                    images.append(img)
            result=cursor.execute("""INSERT INTO
                    sites(
                        name,
                        category,
                        category2,
                        description,
                        address,
                        transport,
                        mrt,
                        latitude,
                        longitude,
                        images
                    )VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",(name,cat1,cat2,des,add,trans,mrt,lati,longi,str(images)))
            mydb.commit()
            print("完成新增:",result,"筆資料",images)


if __name__=="__main__":
    #開啟資料庫，順序不對會跑不出來
    mydb=pymysql.connect(charset='utf8',database='viewsite',host='127.0.0.1',password='root123',port=3306,user='root') 
    cursor=mydb.cursor()
    bulid(mydb)
    insert_data(mydb)
    cursor.close()
    datas.close()