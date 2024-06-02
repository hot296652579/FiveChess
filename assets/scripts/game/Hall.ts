/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 16:02:25
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-02 22:02:44
 * @FilePath: /FiveChess/assets/scripts/game/Hall.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, EditBox, Node } from 'cc';
import { uimgr, UIMgr } from './mgr/uimgr/UIMgr';
import { IPopViewData } from './views/PopView';
import { eventMgr, EventMgr } from './core/base/EventMgr';
import { GameEnvType } from './common/GameConst';
import { GaneEvent } from './common/GaneEvent';
import { GameData } from './data/GameData';
import { GameConfig } from '../../GameConfig';
const { ccclass, property } = _decorator;

@ccclass('Hall')
export class Hall extends Component {
    @property(Node)
    loginView: Node = null;

    @property(Node)
    selectGameNode: Node = null;

    @property(EditBox)
    joinRoomEditBox: EditBox = null;

    protected start() {
        this._initializeEevent();
        this._initializeView();
    }

    private _initializeEevent() {
        eventMgr.on(GaneEvent.UI_LoginRegisterSuccess, this._onLoginRegisterSuccess, this);
        eventMgr.on(GaneEvent.UI_LoginRegisterFail, this._onLoginRegisterFail, this);
        eventMgr.on(GaneEvent.UI_CreatePvpRoom, this._onCreatePvpRoom, this);
    }

    private _initializeView() {
        if (!this.loginView)
            return;

        if (GameConfig.GameEnv === GameEnvType.GAME_ENV_DEV) {
            this.loginView.active = false;
            this.selectGameNode.active = true;
        } else {
            this.loginView.active = true;
            this.selectGameNode.active = false;
        }

    }

    private _onLoginRegisterSuccess(param: any): void {
        if (!param)
            return;

        const { result, msg } = param;
        GameData.getIns().isOnLineLogin = result;

        if (result) {
            this.loginView.active = !result;
            this.selectGameNode.active = result;
        }
        uimgr.showTipsView(msg);
    }

    private _onLoginRegisterFail(param: any): void {
        if (!param)
            return;

        const { message } = param;
        uimgr.showTipsView(message);
    }

    private _onCreatePvpRoom(param: any): void {
        if (!param)
            return;
    }

    public onClickCreateRoom(): void {

    }

    public onClickJoinRoom(): void {

    }

    protected onDestroy() {
        eventMgr.off(GaneEvent.UI_LoginRegisterSuccess, this._onLoginRegisterSuccess);
        eventMgr.off(GaneEvent.UI_LoginRegisterFail, this._onLoginRegisterFail);
        eventMgr.off(GaneEvent.UI_CreatePvpRoom, this._onCreatePvpRoom);
    }
}

