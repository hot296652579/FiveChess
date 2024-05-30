/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-30 09:43:53
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-30 20:10:25
 * @FilePath: /FiveChess/server/src/game/routes/UserRoutes.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import express from 'express';
import { verifyAndParse } from '../http/HttpMiddleWare';
import { loggerMgr } from '../../core/mgr/LoggerMgr';
import { UsersCtrl } from '../controller/UsersCtrl';

export const router = express.Router();
const TAG = 'UserRoutes';
// 路由
router.post('/register', verifyAndParse, (req, res) => {
    loggerMgr.info(TAG, `register users`);
    UsersCtrl.registerUser(req, res);
})


router.post('/login', verifyAndParse, (req, res) => {
    loggerMgr.info(TAG, `login users`);
    UsersCtrl.loginUser(req, res);
})