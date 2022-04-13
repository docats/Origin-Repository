import email
import json
import pymysql

#建立tables名字:member，依照老師給的API網址，建立id,name,email
# def meb(mydb):
#     cursor.execute('DROP TABLE IF EXISTS member')
#     sql="""CREATE TABLE member (
#          id MEDIUMINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
#          name varchar(255) NOT NULL,
#          email varchar(255) NOT NULL,
#          password varchar(255) NOT NULL
#          )"""
    # cursor.execute(sql) #執行資料庫欄位設定命令
    # mydb.commit() #確認執行提交到資料庫

if __name__=="__main__":
    #開啟資料庫，順序不對會跑不出來
    mydb=pymysql.connect(charset='utf8',database='viewsite',host='127.0.0.1',password='root123',port=3306,user='root') 
    cursor=mydb.cursor()
    meb(mydb)
    cursor.close()