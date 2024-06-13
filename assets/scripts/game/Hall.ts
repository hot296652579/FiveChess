/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 16:02:25
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-13 16:06:19
 * @FilePath: /FiveChess/assets/scripts/game/Hall.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, EditBox, Node } from 'cc';
import { uimgr, UIMgr } from './mgr/uimgr/UIMgr';
import { IPopViewData } from './views/PopView';
import { GameEnvType, GameLanguageKey } from './common/GameConst';
import { GameData } from './data/GameData';
import { GameConfig } from '../../GameConfig';
import { GameUtils } from './common/GameUtils';
import { GameEvent } from './common/GameEvent';
import eventMgr from './core/base/EventMgr';
import WsMgr from './core/base/net/WebScoketMgr';

const { ccclass, property } = _decorator;

@ccclass('Hall')
export class Hall extends Component {
    @property(Node)
    loginView: Node = null;

    @property(Node)
    selectGameNode: Node = null;

    @property(Node)
    createRoomNode: Node = null;

    @property(EditBox)
    joinRoomEditBox: EditBox = null;

    protected start() {
        this._initializeEevent();
        this._initializeView();

        //test arraybuffer
        // const test: Uint8Array = new Uint8Array([228, 189, 160, 229, 165, 189]);
        // WsMgr.arrayBufferToString(test);
    }

    private _initializeEevent() {
        eventMgr.on(GameEvent.UI_LoginRegisterSuccess, this._onLoginRegisterSuccess, this);
        eventMgr.on(GameEvent.UI_LoginRegisterFail, this._onLoginRegisterFail, this);
        eventMgr.on(GameEvent.UI_CreatePvpRoom, this._onCreatePvpRoom, this);
        eventMgr.on(GameEvent.UI_CloseCreateRoom, this._onUI_CloseCreateRoom, this);
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

    /**
     * @description: 点击pvp按钮
     * @return {*}
     */
    private _onCreatePvpRoom(): void {
        this.createRoomNode.active = true;
    }

    private _onUI_CloseCreateRoom(): void {
        this.selectGameNode.active = true;
    }

    /**
     * @description: 点击创建房间按钮
     * @return {*}
     */
    public onClickCreateRoom(): void {
        uimgr.showTipsView(GameLanguageKey.GLK_WaitOpenFunc);
    }

    public onClickJoinRoom(): void {
        if (!this.joinRoomEditBox || GameUtils.isCheckStringEmpty(this.joinRoomEditBox.string)) {
            uimgr.showTipsView(GameLanguageKey.GLK_JoinRoomError);
            return;
        }

        uimgr.showTipsView(GameLanguageKey.GLK_WaitOpenFunc);
    }

    protected onDestroy() {
        eventMgr.off(GameEvent.UI_LoginRegisterSuccess, this._onLoginRegisterSuccess);
        eventMgr.off(GameEvent.UI_LoginRegisterFail, this._onLoginRegisterFail);
        eventMgr.off(GameEvent.UI_CreatePvpRoom, this._onCreatePvpRoom);
    }
}

