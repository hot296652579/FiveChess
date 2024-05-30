/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-30 10:18:37
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-30 11:37:20
 * @FilePath: /FiveChess/server/src/game/controller/UsersCtrl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */import { Request, Response } from "express";
import { UsersDao } from "../dao/UsersDao";


export class UsersCtrl {
    public static registerUser(req: Request, res: Response) {
        const { uname, password } = req.body;
        UsersDao.register(uname, password);
    }

    public static loginUser(req: Request, res: Response) {
        const { uname, password } = req.body;
    }
}