/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 16:47:25
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-28 12:29:34
 * @FilePath: /FiveChess/assets/scripts/game/views/LoginView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, EditBox, Node } from 'cc';
import { GameUtils } from '../common/GameUtils';
import { GameEventName } from '../common/GameConst';
import { EventMgr } from '../core/base/EventMgr';
const { ccclass, property } = _decorator;

@ccclass('LoginView')
export class LoginView extends Component {

    @property(EditBox)
    public editNameBox: EditBox = null;

    @property(EditBox)
    public editPwdBox: EditBox = null;

    @property(Node)
    public toastView: Node = null;
    start() {
        this._initUIData();
    }

    private _initUIData() {

    }

    /**
     * @description: 登录按钮点击
     * @return {*}
     */
    public onClickLogin() {
        if (!this.editNameBox.string || !this.editPwdBox.string
            || GameUtils.isCheckStringEmpty(this.editNameBox.string)
            || GameUtils.isCheckStringEmpty(this.editPwdBox.string)) {
            return;
        }

    }

    /**
     * @description: 注册按钮点击
     * @return {*}
     */
    public onClickRegister() {
        if (!this.editNameBox.string || !this.editPwdBox.string
            || GameUtils.isCheckStringEmpty(this.editNameBox.string)
            || GameUtils.isCheckStringEmpty(this.editPwdBox.string)) {
            return;
        }

    }
}

