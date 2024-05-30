/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-29 13:57:36
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-30 20:28:11
 * @FilePath: /FiveChess/assets/scripts/game/common/GameHost.ts
 * @Description: 路由配置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export class GameHost {
    public static gameWsPort = '8000';
    public static gameAuthHttpPort = '3000';
    public static gameRouteUrlHttp = `http://127.0.0.1:${GameHost.gameAuthHttpPort}`;
    public static gameRouteUrlWs = `ws://127.0.0.1:${GameHost.gameWsPort}`;

    /**业务路由*/
    public static gameUserApi = '/api/users';
    public static gameUserLoginUrl = `${GameHost.gameRouteUrlHttp}${GameHost.gameUserApi}/login`;
    public static gameUserRegisterUrl = `${GameHost.gameRouteUrlHttp}${GameHost.gameUserApi}/register`;
}