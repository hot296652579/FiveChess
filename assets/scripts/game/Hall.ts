/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 16:02:25
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-31 18:41:34
 * @FilePath: /FiveChess/assets/scripts/game/Hall.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node } from 'cc';
import { uimgr, UIMgr } from './mgr/uimgr/UIMgr';
import { IPopViewData } from './views/PopView';
import { eventMgr, EventMgr } from './core/base/EventMgr';
import { GameEventName } from './common/GameConst';
import { GaneEvent } from './common/GaneEvent';
import { GameData } from './data/GameData';
const { ccclass, property } = _decorator;

@ccclass('Hall')
export class Hall extends Component {
    @property(Node)
    loginView: Node = null;

    protected start() {
        this._initializeEevent();
        this._initializeView();
    }

    private _initializeEevent() {
        eventMgr.on(GaneEvent.UI_LoginRegisterSuccess, this._onLoginRegisterSuccess, this);
        eventMgr.on(GaneEvent.UI_LoginRegisterFail, this._onLoginRegisterFail, this);
    }

    private _initializeView() {
        if (!this.loginView)
            return;

        this.loginView.active = true;
    }

    private _onLoginRegisterSuccess(param: any): void {
        if (!param)
            return;

        const { result, msg } = param;
        GameData.getIns().isOnLineLogin = result;

        if (result) {
            this.loginView.active = false;
        }
        uimgr.showTipsView(msg);
    }

    private _onLoginRegisterFail(param: any): void {
        if (!param)
            return;

        const { message } = param;
        uimgr.showTipsView(message);
    }

    protected onDestroy() {
        eventMgr.off(GaneEvent.UI_LoginRegisterSuccess, this._onLoginRegisterSuccess);
        eventMgr.off(GaneEvent.UI_LoginRegisterFail, this._onLoginRegisterFail);
    }
}

