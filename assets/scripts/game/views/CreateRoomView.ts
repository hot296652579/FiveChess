/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-02 21:08:32
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-03 20:01:04
 * @FilePath: /FiveChess/assets/scripts/game/views/CreateRoomView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Component, _decorator } from "cc";
import { GameData } from "../data/GameData";
import { GameModelType, GameSceneName } from "../common/GameConst";
import { GameUtils } from "../common/GameUtils";
import { eventMgr } from "../core/base/EventMgr";
import { GaneEvent } from "../common/GaneEvent";

const { ccclass, property } = _decorator;

@ccclass('CreateRoomView')
export class CreateRoomView extends Component {

    start() {

    }

    public onClickCreate(): void {

    }

    public onClickJoin(): void {

    }

    public onClickSelf(): void {
        this.node.active = false;
        eventMgr.emit(GaneEvent.UI_CloseCreateRoom);
    }


}


