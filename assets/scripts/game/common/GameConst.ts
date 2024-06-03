/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 17:19:17
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-03 20:04:05
 * @FilePath: /FiveChess/assets/scripts/game/common/GameConst.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export enum GameSceneName {
    GSC_Hall = 'hall',
    GSC_Game = 'game',
}

export enum GameLanguageKey {
    GLK_LoginOrRegister = '请输入正确的账号或密码',
    GLK_JoinRoomError = '请输入正确的房间号',
    GLK_WaitOpenFunc = '等待打开功能!',
}

export enum NetCodeConst {
    // 登录
    LoginSuccess = 100,
    RegisterSuccess = 101,

    /**错误code*/
    ParamsError = 10000,
    SqlError,
    AccountExistError,
    AccountIsNotExistError,
    UserNameOrPasswordError,
}

export enum GameModelType {
    GMT_PVE = 0,
    GMT_PVP = 1,
}

export enum GameEnvType {
    GAME_ENV_DEV = 0,
    GAME_ENV_RELEASE = 1,
}