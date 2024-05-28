/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 16:02:25
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-28 10:51:30
 * @FilePath: /FiveChess/assets/scripts/game/Hall.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node } from 'cc';
import { UIMgr } from './mgr/uimgr/UIMgr';
import { IPopViewData } from './views/PopView';
const { ccclass, property } = _decorator;

@ccclass('Hall')
export class Hall extends Component {
    start() {
        const data: IPopViewData = {
            content: "欢迎来到五子棋",
        }
        console.log(UIMgr.getInstance());
        UIMgr.getIns().showPopView(data);
    }

    update(deltaTime: number) {

    }
}

