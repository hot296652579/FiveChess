/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-02 21:08:32
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-02 21:20:05
 * @FilePath: /FiveChess/assets/scripts/game/views/SelectGameView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Component, _decorator } from "cc";
import { GameData } from "../data/GameData";
import { GameModelType, GameSceneName } from "../common/GameConst";
import { GameUtils } from "../common/GameUtils";

const { ccclass, property } = _decorator;

@ccclass('Hall')
export class SelectGameView extends Component {

    start() {

    }

    public onClickPvp(): void {
        GameData.getIns().curGameModelType = GameModelType.GMT_PVP;

    }

    public onClickRobot(): void {
        GameData.getIns().curGameModelType = GameModelType.GMT_PVE;
        GameUtils.switchScene(GameSceneName.GSC_Game);
    }

}


