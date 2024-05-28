/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-28 11:31:10
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-28 12:28:13
 * @FilePath: /FiveChess/assets/scripts/game/core/base/EventMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Single } from "./Single";

export class EventMgr extends Single {
    public static getIns() {
        return super.getInstance<EventMgr>();
    }

    private _listener: any = {};

    public emit(evtName: string, ...param: any[]): void {
        const cbs = this._listener[`${evtName}`];
        if (!cbs) {
            console.warn(`EventMgr: emit ${evtName} not found`);
            return
        }

        for (let index = 0; index < cbs.length; index += 2) {
            const cb = cbs[index];
            const target = cbs[index + 1];
            cb.call(target, ...param);
        }
    }

    public on(evtName: string, cb: Function, target: any): void {
        if (!this._listener[`${evtName}`]) {
            this._listener[`${evtName}`] = [];
        }
        this._listener[`${evtName}`].push(cb, target);
    }

    /**
     * @description: 移除单个事件监听
     * @param {string} evtName
     * @param {Function} cb
     * @return {*}
     */
    public off(evtName: string, cb: Function): void {
        const cbs = this._listener[`${evtName}`];
        if (!cbs) {
            console.warn(`EventMgr: off ${evtName} not found`);
            return
        }

        for (let index = 0; index < cbs.length; index + 2) {
            const _cb = cbs[index];
            if (_cb === cb) {
                cbs.splice(index, 2);
                break;
            }
        }
    }

    /**
     * @description: 移除全部事件监听
     * @param {string} evtName
     * @return {*}
     */
    public offAll(evtName: string): void {
        const cbs = this._listener[`${evtName}`];
        if (!cbs) {
            console.warn(`EventMgr: offAll ${evtName} not found`);
            return
        }

        cbs.length = 0;
    }
}