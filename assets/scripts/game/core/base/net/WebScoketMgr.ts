/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-12 16:45:11
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-13 15:33:25
 * @FilePath: /FiveChess/assets/scripts/game/core/base/net/WsMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { Single } from "../Single";
import { WsNetCmd } from "./WsNetCmd";

enum WebScoketState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    CLOSING,
    CLOSED
}

export interface IResponseMsg {
    protoId: WsNetCmd;
    cmd: string;
    data: any;
}

export class WebScoketMgr extends Single {

    private _state: WebScoketState = WebScoketState.DISCONNECTED;
    private _ws: WebSocket = null;
    private _responseMsgQueue: IResponseMsg[] = [];

    private _isChangeSecene: boolean = false;
    public get isChangeSecene(): boolean {
        return this._isChangeSecene;
    }
    public set isChangeSecene(value: boolean) {
        this._isChangeSecene = value;
    }

    public static getIns() {
        return super.getInstance<WebScoketMgr>();
    }

    public connect(url: string) {
        if (this._state != WebScoketState.DISCONNECTED)
            return;

        this._state = WebScoketState.CONNECTING;
        this._ws = new WebSocket(url);
        this._ws.binaryType = "arraybuffer";

        this._ws.onopen = this.onOpen.bind(this);
        this._ws.onmessage = this.onMessage.bind(this);
        this._ws.onclose = this.onClose.bind(this);
        this._ws.onerror = this.onError.bind(this);
    }

    private onOpen(): void {
        this._state = WebScoketState.CONNECTED;
    }

    private onMessage(event: MessageEvent): void {
        console.log("Ws onMessage data:", event.data);
        let arraybuffer = event.data;
        let uint8Array = new Uint8Array(arraybuffer);
        let bufferStr = this.arrayBufferToString(uint8Array);
        let obj: IResponseMsg = JSON.parse(bufferStr);
        if (!obj)
            return;

        this._responseMsgQueue.push(obj);
        this._processNetMessageEmit();
    }

    private onClose(event: CloseEvent): void {
        if (this._ws && this._state == WebScoketState.CONNECTED) {
            this._state = WebScoketState.DISCONNECTED;
            this._ws.close();
            this._ws = null;

            if (this._responseMsgQueue.length > 0) {
                this._responseMsgQueue = [];
            }
        }
    }

    private onError(event: Event): void {
        console.log("Ws onError:", event);
    }

    /**
     * @description: 二进制转字符串
     * @return {*}
     */
    public arrayBufferToString(arrBuffer: Uint8Array): string {
        if (typeof arrBuffer == "string")
            return arrBuffer;

        let finalStr = "";
        let _tempArrBuff = arrBuffer;
        for (let i = 0; i < _tempArrBuff.length; i++) {
            let one: string = _tempArrBuff[i].toString(2);
            let v = one.match(/^1+?(?=0)/);// 匹配以 1 开头并在 0 前终止的子字符串
            if (v && one.length == 8) {  // 如果匹配成功并且二进制字符串的长度为 8（即一个完整的字节）
                let bytesLength = v[0].length;
                let store = _tempArrBuff[i].toString(2).slice(7 - bytesLength);
                for (let st = 1; st < bytesLength; st++) {
                    store += _tempArrBuff[i + st].toString(2).slice(2);
                }
                finalStr += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                finalStr += String.fromCharCode(_tempArrBuff[i]);
            }
        }
        return finalStr;
    }

    private _processNetMessageEmit(): void {

    }
}

const WsMgr = WebScoketMgr.getIns();
export default WsMgr;

