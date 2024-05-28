/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-28 12:58:13
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-28 13:30:50
 * @FilePath: /FiveChess/server/app-http.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import cors = require("cors");
import express = require("express");
import bodyParser = require("body-parser");
import createHttpError = require("http-errors");
import cookieParser = require("cookie-parser");


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

    app.use(function (req, res, next) {
        next(createHttpError(404));//指定错误的网页
    })

    app.listen(3000, () => {
        console.log(`${TAG} httpServerStart success`);
    })
}

httpServerStart();