import { SceneAsset, director } from "cc";
import { GameSceneName } from "./GameConst";

/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 17:21:09
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-27 17:36:37
 * @FilePath: /FiveChess/assets/scripts/game/common/GameUtils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export class GameUtils {
    /**
     * @description: 加载切换场景
     * @param {GameSceneName} sceneName
     * @return {*}
     */
    public static switchScene(sceneName: GameSceneName): void {
        director.preloadScene(sceneName, (err: Error, scene: SceneAsset) => {
            if (err) {
                console.log('switchScene error:', err);
                return
            }
            director.loadScene(sceneName);
        })
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