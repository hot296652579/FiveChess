/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-30 10:18:37
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-30 19:30:40
 * @FilePath: /FiveChess/server/src/game/controller/UsersCtrl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Request, Response } from "express";
import { UsersDao } from "../dao/UsersDao";
import { loggerMgr } from "../../core/mgr/LoggerMgr";
import { NetCodeConst } from "../http/NetCodeConst";
import { CreateReponse, MD5 } from "../http/HttpMiddleWare";
import { GlobalUtils } from "../../core/utils/GlobalUtils";

const TAG = "UsersCtrl";
export class UsersCtrl {
    /**
     * @description: 注册用户ctrl方法
     * @param {Request} req
     * @param {Response} res
     * @return {*}
     */
    public static registerUser(req: Request, res: Response) {
        const { uname, password } = req.body;
        UsersDao.register(uname, password)
            .then((result) => {
                const token = GlobalUtils.getIns().UUIDV1();
                loggerMgr.info(TAG, `register success ->:${uname}: ${result}`);
                res.json(CreateReponse(NetCodeConst.RegisterSuccess, { token }));
            }).catch((err) => {
                if (!err)
                    return

                if (err.errorno === 1062) {
                    loggerMgr.error(TAG, `error ->:${err.errorno}: ${err.sqlMessage}`);
                    res.json(CreateReponse(NetCodeConst.AccountExistError));
                    return;
                }

                res.json(CreateReponse(NetCodeConst.SqlError));
            })
    }

    public static loginUser(req: Request, res: Response) {
        const { uname, password } = req.body;
        UsersDao.login(uname, password)
            .then((result) => {
                const user = result[0];
                if (!user || MD5(password) !== user.password) {
                    res.json(CreateReponse(NetCodeConst.AccountIsNotExistError));
                    return;
                }
                let token = GlobalUtils.getIns().UUIDV1();
                if (user && user.uid) {
                    token = user.uid;
                }
                loggerMgr.info(TAG, `login success ->:${uname}: ${result}`);
                res.json(CreateReponse(NetCodeConst.LoginSuccess, { token }));
            }).catch((err) => {
                if (!err)
                    return
                res.json(CreateReponse(NetCodeConst.AccountIsNotExistError));
                return;
            })

    }
}