/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-28 12:58:13
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-31 13:53:23
 * @FilePath: /FiveChess/server/app-http.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import cors = require("cors");
import express = require("express");
import bodyParser = require("body-parser");
import createHttpError = require("http-errors");
import cookieParser = require("cookie-parser");
import { loggerMgr } from "./src/core/mgr/LoggerMgr";
import { HostConfig } from "./src/config/HostConfig";
import { router as UserRoutes } from "./src/game/routes/UserRoutes";


let TAG = 'httpServerStart';
export const httpServerStart = async () => {
    const app = express();
    app.use(cors());//跨域

    // 解析请求体中的数据。
    app.use(bodyParser.json());//将请求体中的 JSON 数据解析为 JavaScript 对象
    app.use(express.json());//

    //解析 URL 编码的数据（通常来自表单提交）。extended: true 选项允许解析任意类型的数据（嵌套对象等）。
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());


    //绑定用户操作
    app.use('/api/users', UserRoutes);
    // app.post('/api/users/register', (req, res) => {
    //     loggerMgr.info(TAG, '客户端有注册请求+++++');
    // });

    // app.use(function (req, res, next) {
    //     next(createHttpError(404));//指定错误的网页
    // })

    app.listen(HostConfig.AuthHttpPort, () => {
        loggerMgr.info(TAG, 'http server start at 3000');
        // console.log('http server start at 3000');
    })
}

httpServerStart();