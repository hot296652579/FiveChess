/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-28 12:58:18
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-17 14:59:58
 * @FilePath: /FiveChess/server/app-ws.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEe
 */

import WsMgr from "./src/game/ws/manager/WebScoketMgr"

export const startWs = async () => {
    await WsMgr.init();
}

startWs();