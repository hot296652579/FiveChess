/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 17:19:17
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-28 11:42:44
 * @FilePath: /FiveChess/assets/scripts/game/common/GameConst.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export enum GameSceneName {
    GSC_Hall = 'hall',
    GSC_Game = 'game',
}

export enum GameEventName {
    GE_GameStart = 'gameStart',
    GE_GameEnd = 'gameEnd',
    GE_GameOver = 'gameOver',
    GE_GamePause = 'gamePause',
    GE_GameResume = 'gameResume',
    GE_GameRestart = 'gameRestart',
}