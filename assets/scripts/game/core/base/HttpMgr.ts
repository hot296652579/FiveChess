/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-29 13:42:21
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-30 20:05:22
 * @FilePath: /FiveChess/assets/scripts/game/core/base/HttpMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Single } from "./Single";

const enum HttpType {
    TYPE_GET = 'GET',
    TYPE_POST = 'POST'
}

export class HttpMgr extends Single {
    public static getIns() {
        return super.getInstance<HttpMgr>();
    }

    /**
     * @description: http post 请求
     * @param {string} url
     * @param {any} param
     * @return {*}
     */
    public async requestPost(url: string, param: any) {
        return fetch(url, {
            method: HttpType.TYPE_POST,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(param)
        }).then(res => {
            // 检查响应的Content-Type
            const contentType = res.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                return res.json();
            } else {
                return res.text().then(text => {
                    throw new Error(`Unexpected response type: ${contentType}. Response text: ${text}`);
                });
            }
        }).catch(err => {
            console.log(`http post请求错误 err:${err}`);
        })
    }
}

let httpMgr = HttpMgr.getIns();
export { httpMgr };
