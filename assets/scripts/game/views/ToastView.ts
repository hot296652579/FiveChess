/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 17:14:17
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-28 11:55:52
 * @FilePath: /FiveChess/assets/scripts/game/views/ToastView.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Label, Node } from 'cc';
import { GameUtils } from '../common/GameUtils';
const { ccclass, property } = _decorator;

@ccclass('ToastView')
export class ToastView extends Component {
    @property(Label)
    public tips: Label = null;

    start() {

    }

    public showTips(str: string) {
        if (GameUtils.isCheckStringEmpty(str)) return;

        this.node.active = true;
        this.tips.string = str;

        setTimeout(() => {
            this.node.active = false;
        }, 700)
    }
}

