/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-12 16:50:30
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-12 16:50:45
 * @FilePath: /FiveChess/assets/scripts/game/core/base/net/WsNetCmd.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export enum WsNetCmd {
    WNC_Register,
    WNC_Login,
    WNC_Heartbeat,
    WNC_Logout,
    WNC_Error,
    WNC_PutDown
}