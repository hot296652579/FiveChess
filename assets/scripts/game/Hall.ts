/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 16:02:25
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-28 12:30:43
 * @FilePath: /FiveChess/assets/scripts/game/Hall.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node } from 'cc';
import { UIMgr } from './mgr/uimgr/UIMgr';
import { IPopViewData } from './views/PopView';
import { EventMgr } from './core/base/EventMgr';
import { GameEventName } from './common/GameConst';
const { ccclass, property } = _decorator;

@ccclass('Hall')
export class Hall extends Component {
    start() {
        EventMgr.getIns().on(GameEventName.GE_GameStart, this.onGameStart, this);
        EventMgr.getIns().on(GameEventName.GE_GameRestart, this.onGameStart, this);
    }

    onGameStart() {
    }

    update(deltaTime: number) {

    }
}

