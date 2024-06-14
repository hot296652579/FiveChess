/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-28 19:12:41
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-14 14:35:18
 * @FilePath: /FiveChess/server/src/core/utils/GlobalUtils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Single } from "../base/Single";
import { v1 as uuidv1, v4 as uuidv4 } from 'uuid';

export class GlobalUtils extends Single {
    public static getIns(): GlobalUtils {
        return super.getInstance<GlobalUtils>();
    }

    public UUIDV4() {
        return uuidv4();
    }

    public UUIDV1() {
        return uuidv1();
    }

    public createRoomID(): string {
        const timetemp = Date.now().toString(36);
        const randoStr = Math.random().toString(36).substring(2, 10);
        return timetemp + randoStr;
    }

    public createNumRoomID(): number {
        let roomId: number = -1;
        for (let index = 0; index < 6; index++) {
            roomId += Math.floor(Math.random() * 10);
        }
        return roomId;
    }

    public static isCheckStringEmpty(value: string): boolean {
        if (value == null || value == '' || value == undefined || this.isEmptyStr(value))
            return true;

        return false;
    }

    /**
     * @description: 判断字符串是否包含空格和空白 
     * ^：匹配字符串的开始位置。
        \s*：匹配零个或多个空白字符。
        \s 是一个空白字符，包含空格、制表符（tab）、换行符（newline）等。
        * 是量词，表示匹配前面的元素零次或多次。
        $：匹配字符串的结束位置。
        综上所述，/^\s*$/ 匹配的是仅由空白字符组成的字符串，或者一个完全空的字符串。
     * @return {*}
     */
    public static isEmptyStr(value: string): boolean {
        if (/^\s*$/.test(value))
            return true;

        return false
    }
}