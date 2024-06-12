/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-12 16:45:11
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-12 16:54:34
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

        this._ws = new WebSocket(url);
        this._ws.binaryType = "arraybuffer";

        this._ws.onopen = this.onOpen.bind(this);
        this._ws.onmessage = this.onMessage.bind(this);
        this._ws.onclose = this.onClose.bind(this);
        this._ws.onerror = this.onError.bind(this);
    }

    private onOpen(): void {

    }

    private onMessage(event: MessageEvent): void {
        console.log("Ws onMessage data:", event.data);
    }

    private onClose(event: CloseEvent): void {

    }

    private onError(event: Event): void {

    }
}

const WsMgr = new WebScoketMgr();
export default WsMgr;

