/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 20:07:29
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-28 09:28:03
 * @FilePath: /FiveChess/assets/scripts/game/views/PopView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, easing, Label, Node, tween, Vec3 } from 'cc';
import { GameUtils } from '../common/GameUtils';
const { ccclass, property } = _decorator;

@ccclass('PopView')
export class PopView extends Component {
    @property(Node)
    UINode: Node = null;

    @property(Label)
    lbTitle: Label = null;

    @property(Label)
    lbContent: Label = null;

    @property(Label)
    btnDesLabel: Label = null;

    @property(Node)
    btResetNode: Node = null;

    @property(Node)
    maskNode: Node = null;

    private _closeCallback: Function = null;
    private _resetCallback: Function = null;

    private _titleStr: string = "";
    private _contentStr: string = "";
    private _btnDesStr: string = "";

    start() {

    }

    public initWithData(args: IPopViewData) {
        if (!GameUtils.isCheckStringEmpty(args.title)) {
            this._titleStr = args.title;
            this.lbTitle.string = this._titleStr;
        }

        if (!GameUtils.isCheckStringEmpty(args.content)) {
            this._contentStr = args.content;
            this.lbContent.string = this._contentStr;
        }

        if (!GameUtils.isCheckStringEmpty(args.btnDes)) {
            this._btnDesStr = args.btnDes;
            this.btnDesLabel.string = this._btnDesStr;
        }

        if (args.closeCallback != null) {
            this._closeCallback = args.closeCallback;
        }

        if (args.resetCallback != null) {
            this._resetCallback = args.resetCallback;
        }

        this.btResetNode.active = args.resetCallback != null;

        tween(this.node)
            .to(0.5, { scale: new Vec3(1, 1, 1) }, { easing: easing.bounceOut })
            .call(() => {
                this.maskNode.active = true;
            })
            .start();
    }

    public onBtnCloseClick() {
        if (this._closeCallback != null) {
            this._closeCallback();
        }

        this._closeSelf()
    }

    private _closeSelf(): void {
        if (this.maskNode) {
            this.maskNode.active = false;
        }

        tween(this.node)
            .to(0.2, { scale: new Vec3(0.1, 0.1, 0.1) })
            .call(() => {
                this.node.removeFromParent();
                this.node.destroy();
            })
            .start();
    }

    public onBtnResetClick() {
        if (this._resetCallback != null) {
            this._resetCallback();
        }

        this._closeSelf();
    }

    protected onDestroy(): void {
        this.node.destroy();
    }

}

export interface IPopViewData {
    content: string;
    title?: string;
    btnDes?: string;
    closeCallback?: Function;
    resetCallback?: Function;
}
