/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 16:47:25
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-29 14:43:07
 * @FilePath: /FiveChess/assets/scripts/game/views/LoginView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, EditBox, Node } from 'cc';
import { GameUtils } from '../common/GameUtils';
import { GameEventName, GameLanguageKey } from '../common/GameConst';
import { EventMgr } from '../core/base/EventMgr';
import { ToastView } from './ToastView';
import { httpMgr } from '../core/base/HttpMgr';
import { GameHost } from '../common/GameHost';
import JSEncrypt from 'jsencrypt';
import { JsCrypt_PublicKey } from '../common/GameSecret';
const { ccclass, property } = _decorator;

const TAG = 'LoginView';
const crypt = new JSEncrypt();
crypt.setKey(JsCrypt_PublicKey);

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
    public async onClickLogin() {
        if (!this.editNameBox.string || !this.editPwdBox.string
            || GameUtils.isCheckStringEmpty(this.editNameBox.string)
            || GameUtils.isCheckStringEmpty(this.editPwdBox.string)) {

            if (this.toastView) {
                this.toastView.active = true;
                this.toastView.getComponent(ToastView).showTips(GameLanguageKey.GLK_LoginOrRegister);
            }
            return;
        }

        let originUserName = this.editNameBox.string;
        let originUserPwd = this.editPwdBox.string;
        let uname = crypt.encrypt(originUserName);
        let upwd = crypt.encrypt(originUserPwd);
        const params = {
            uname,
            upwd
        }
        const res = await httpMgr.requestPost(GameHost.gameUserLoginUrl, params);
        console.log(TAG, '请求登录返回数据 res', JSON.stringify(res));
    }

    /**
     * @description: 注册按钮点击
     * @return {*}
     */
    public async onClickRegister() {
        if (!this.editNameBox.string || !this.editPwdBox.string
            || GameUtils.isCheckStringEmpty(this.editNameBox.string)
            || GameUtils.isCheckStringEmpty(this.editPwdBox.string)) {

            if (this.toastView) {
                this.toastView.active = true;
                this.toastView.getComponent(ToastView).showTips(GameLanguageKey.GLK_LoginOrRegister);
            }
            return;
        }

        let originUserName = this.editNameBox.string;
        let originUserPwd = this.editPwdBox.string;
        const params = {

        }
        const res = await httpMgr.requestPost(GameHost.gameUserRegisterUrl, params);
        console.log(TAG, '请求注册返回数据 res', JSON.stringify(res));
    }
}

