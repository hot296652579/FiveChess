/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 20:47:04
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-31 18:37:13
 * @FilePath: /FiveChess/assets/scripts/game/mgr/uimgr/UIMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { instantiate, resources, Node, Prefab, Vec3, find, UI } from "cc";
import { Single } from "../../core/base/Single";
import { IPopViewData, PopView } from "../../views/PopView";
import { ToastView } from "../../views/ToastView";

export class UIPath {
    public static POP_VIEW = "prefabs/PopView";
    public static TOAST_VIEW = "prefabs/ToastView";
}

export class UIMgr extends Single {

    static getIns(): UIMgr {
        return super.getInstance<UIMgr>();
    }

    public showPopView(data: IPopViewData, parentNode?: Node): void {
        resources.load(UIPath.POP_VIEW, Prefab, (err: any, prefab: Prefab) => {
            if (err) {
                console.error('加载PopView预设失败 err:', err);
                return;
            }
            const popView = instantiate(prefab);
            popView.setScale(new Vec3(0.1, 0.1, 0.1));
            popView.name = 'PopView';
            let popViewScript = popView.getComponent(PopView);
            popViewScript.initWithData(data);

            if (parentNode) {
                popView.parent = parentNode;
            } else {
                popView.parent = find("Canvas");
            }
        })

    }

    public showTipsView(content: string, parentNode?: Node): void {
        resources.load(UIPath.TOAST_VIEW, Prefab, (err: any, prefab: Prefab) => {
            if (err) {
                console.error('加载ToastView预设失败 err:', err);
                return;
            }
            const toastView = instantiate(prefab);
            toastView.name = 'ToastView';
            let toastViewScript = toastView.getComponent(ToastView);
            toastViewScript.showTips(content);

            if (parentNode) {
                toastView.parent = parentNode;
            } else {
                toastView.parent = find("Canvas");
            }

            setTimeout(() => {
                toastView.removeFromParent();
                toastView.destroy();
            }, 1000)
        })
    }
}

let uimgr = UIMgr.getIns();
export { uimgr };