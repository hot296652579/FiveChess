/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-29 15:47:57
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-29 16:00:48
 * @FilePath: /FiveChess/server/src/game/http/HttpMiddleWare.ts
 * @Description: 加密解密中间件,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import JSEncrypt from "jsencrypt";
import { JsCrypt_PrivateKey, JsCrypt_PublicKey } from "../../config/SecretConfig";
import { Request, Response } from "express";
import { NetCodeConst } from "./NetCodeConst";

const crypt = new JSEncrypt();
crypt.setKey(JsCrypt_PrivateKey);
crypt.setPrivateKey(JsCrypt_PrivateKey);
crypt.setPublicKey(JsCrypt_PublicKey);

/**
 * @description: 中间件方法，加密的数据解密后放回body
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next 
 * @return {*}
 */
export const verifyAndParse = (req: Request, res: Response, next: Function) => {
    let { uname, password } = req.body;
    if (!uname || !password) {
        CreateReponse(NetCodeConst.UserNameOrPasswordError);
        return;
    }

    uname = crypt.decrypt(uname);
    password = crypt.decrypt(password);

    req.body = { uname, password };
}

export const CreateReponse = (code: NetCodeConst, data?: any) => ({
    code,
    data,
    msg: NetCodeConst[code]
})