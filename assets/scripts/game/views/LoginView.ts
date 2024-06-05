/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 16:47:25
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-02 21:47:03
 * @FilePath: /FiveChess/assets/scripts/game/views/LoginView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, EditBox, Node } from 'cc';
import { GameUtils } from '../common/GameUtils';
import { GameLanguageKey, NetCodeConst } from '../common/GameConst';
import { eventMgr, EventMgr } from '../core/base/EventMgr';
import { ToastView } from './ToastView';
import { httpMgr } from '../core/base/HttpMgr';
import { GameHost } from '../common/GameHost';
import JSEncrypt from 'jsencrypt';
import { JsCrypt_PublicKey } from '../common/GameSecret';
import { GamePlayerData } from '../data/GamePlayerData';
import { GameData } from '../data/GameData';
import { GameEvent } from '../common/GameEvent';
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
        let password = crypt.encrypt(originUserPwd);
        const params = {
            uname,
            password
        }
        const res = await httpMgr.requestPost(GameHost.gameUserLoginUrl, params);
        console.log(TAG, '请求登录返回数据 res', JSON.stringify(res));

        let data = res.data;
        let code = res.code as number;
        let msg = res.msg as string;
        if (code == NetCodeConst.LoginSuccess) {
            let playerData = new GamePlayerData();
            playerData.password = password as string;
            playerData.uname = originUserName as string;
            playerData.uid = data.token;

            GameData.getIns().curPlayerData = playerData;
            eventMgr.emit(GameEvent.UI_LoginRegisterSuccess, { result: true, msg });
        } else {
            eventMgr.emit(GameEvent.UI_LoginRegisterFail, { result: false, msg });
        }
    }

    private _showToast(msg: string) {
        if (GameUtils.isCheckStringEmpty(msg))
            return;

        this.toastView.active = true;
        this.toastView.getComponent(ToastView).showTips(msg);
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
        let uname = crypt.encrypt(originUserName);
        let password = crypt.encrypt(originUserPwd);
        const params = {
            uname,
            password
        }
        const res = await httpMgr.requestPost(GameHost.gameUserRegisterUrl, params);
        console.log(TAG, '请求注册返回数据 res', JSON.stringify(res));

        let data = res.data;
        let code = res.code as number;
        let msg = res.msg as string;
        if (code == NetCodeConst.RegisterSuccess) {
            let playerData = new GamePlayerData();
            playerData.password = password as string;
            playerData.uname = originUserName as string;
            playerData.uid = data.token;

            GameData.getIns().curPlayerData = playerData;
            // this._showToast(message);
            eventMgr.emit(GameEvent.UI_LoginRegisterSuccess, { result: true, msg });
        } else {
            // this._showToast(message);
            eventMgr.emit(GameEvent.UI_LoginRegisterFail, { result: false, msg });
        }
    }
}

