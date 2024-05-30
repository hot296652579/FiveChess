/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-30 10:20:54
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-30 18:54:00
 * @FilePath: /FiveChess/server/src/game/dao/UsersDao.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import dayjs from "dayjs";
import { GlobalUtils } from "../../core/utils/GlobalUtils";
import { MD5 } from "../http/HttpMiddleWare";
import { loggerMgr } from "../../core/mgr/LoggerMgr";
import mysqlMgr from "../../core/mgr/MySqlMgr";
import { UserSql } from "../const/SqlCRUD";

const TAG = 'UsersDao';
export class UsersDao {
    public static register(uname: string, password: string): Promise<any> {
        const uid = GlobalUtils.getIns().UUIDV1;
        const uuid = uid;
        const dayTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const pwd = MD5(password);

        const insertObj = {
            uid,
            uuid,
            uname,
            'password': pwd,
            'ugender': 0,
            'ubalance': 9527,
            'create_time': dayTime,
            'update_time': dayTime,
        }

        loggerMgr.info(TAG, `register insertObj : ${JSON.stringify(insertObj)}`);
        return mysqlMgr.query(UserSql.register, insertObj);
    }

    public static login(uname: string, password: string): Promise<any> {
        return mysqlMgr.query(UserSql.checkLogin, [uname]);
    }
}