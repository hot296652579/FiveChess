/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-31 15:34:00
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-02 21:20:49
 * @FilePath: /FiveChess/assets/scripts/game/data/GameData.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { GameModelType } from "../common/GameConst";
import { Single } from "../core/base/Single";
import { GamePlayerData } from "./GamePlayerData";

export class GameData extends Single {
    public static getIns(): GameData {
        return super.getInstance<GameData>();
    }

    public isOnLineLogin: boolean = false;
    public curPlayerData: GamePlayerData = null;
    public curGameModelType: GameModelType = GameModelType.GMT_PVE;
}