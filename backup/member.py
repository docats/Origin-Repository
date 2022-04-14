import email
import json
import pymysql

# 建立tables名字:member，依照老師給的API網址，建立id,name,email
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


booking sql
CREATE TABLE `bookingdata` (`booking_number` bigint NOT NULL AUTO_INCREMENT,
                            `user_id` bigint DEFAULT NULL,
                            `name` varchar(255) NOT NULL,
                            `email` varchar(255) NOT NULL,
                            `attraction_id` bigint NOT NULL,
                            `attraction_name` varchar(255) NOT NULL,
                            `attraction_address` varchar(255) NOT NULL,
                            `attraction_image` varchar(255) NOT NULL,
                            `bookdate` varchar(255) NOT NULL,
                            `booktime` varchar(255) NOT NULL,
                            `price` bigint NOT NULL,
                            UNIQUE KEY `booking_number` (`booking_number`),
                            KEY `user_id` (`user_id`),
                            CONSTRAINT `bookingdata_ibfk_1` FOREIGN KEY(`user_id`) REFERENCES `tripmember` (`id`) ON DELETE SET NULL
                            ) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci

if __name__ == "__main__":
    # 開啟資料庫，順序不對會跑不出來
    mydb = pymysql.connect(charset='utf8', database='viewsite',
                           host='127.0.0.1', password='root123', port=3306, user='root')
    cursor = mydb.cursor()
    meb(mydb)
    cursor.close()
