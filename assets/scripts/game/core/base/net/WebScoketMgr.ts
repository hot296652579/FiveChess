/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-12 16:45:11
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-14 14:25:55
 * @FilePath: /FiveChess/assets/scripts/game/core/base/net/WsMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import { GameData } from "../../../data/GameData";
import eventMgr from "../EventMgr";
import { Single } from "../Single";
import { WsNetCmd, WsNetCmdType, getGameProtoIdByWsNetCmd } from "./WsNetCmd";

enum WebScoketState {
    DISCONNECTED,
    CONNECTING,
    CONNECTED,
    CLOSING,
    CLOSED
}

export interface IWsNetMsg {
    protoId: WsNetCmd;
    cmd: string;
    data: any;
}

const TAG = "WebScoketMgr";

export class WebScoketMgr extends Single {

    private _state: WebScoketState = WebScoketState.DISCONNECTED;
    private _ws: WebSocket = null;
    private _responseMsgQueue: IWsNetMsg[] = [];

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

        let uid = GameData.getIns().curPlayerData.uid;
        this.send(WsNetCmd.WNC_CheckConnect, { uid: uid });
    }

    private onMessage(event: MessageEvent): void {
        if (this._isChangeSecene)
            return;

        console.log(TAG, event.data);
        let arraybuffer = event.data;
        let uint8Array = new Uint8Array(arraybuffer);
        let bufferStr = this.arrayBufferToString(uint8Array);
        let obj: IWsNetMsg = JSON.parse(bufferStr);
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
        console.log(`${TAG} onError:`, event);
    }

    public send(protoId: WsNetCmd, data: any): void {
        if (this._state != WebScoketState.CONNECTED || !this._ws)
            return;

        const cmdStr = getGameProtoIdByWsNetCmd(protoId, WsNetCmdType.WNC_Request);

        let msg: IWsNetMsg = {
            protoId: protoId,
            cmd: cmdStr,
            data: data
        }

        let bufferStr = JSON.stringify(msg);
        let uint8Array = this.str2Uint8Array(bufferStr);
        this._ws.send(uint8Array);
    }

    public str2Uint8Array(str: string): Uint8Array {
        let pos = 0;
        const len = str.length;
        let at = 0;
        let tlen = Math.max(32, len + (len >> 1) + 7);
        let uint8Array = new Uint8Array((tlen >> 3) << 3);

        while (pos < len) {
            let value = str.charCodeAt(pos++);

            //检查当前字符是否是高代理（范围：0xD800 到 0xDBFF）
            if (value >= 0xD800 && value <= 0xDBFF) {
                if (pos < len) {
                    const extra = str.charCodeAt(pos);
                    if ((extra & 0xfc00) == 0xdc00) { // 低代理范围
                        // 计算实际的 Unicode 码点
                        value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
                        pos++;
                    }
                }

                if (value >= 0xd800 && value <= 0xdfff) {
                    continue;
                }
            }

            // 动态扩展数组容量
            if (at + 4 > uint8Array.length) {
                tlen += 8;
                tlen *= (1 + (pos / str.length) * 2);
                tlen = (tlen >> 3) << 3;

                const newUint8Array = new Uint8Array(tlen);
                newUint8Array.set(uint8Array);
                uint8Array = newUint8Array;
            }

            // 根据 UTF - 8 编码标准判断字节大小并编码
            if ((value & 0xffffff80) === 0) {
                uint8Array[at++] = value;
                continue;
            } else if ((value & 0xfffff800) === 0) {
                uint8Array[at++] = ((value >> 6) & 0x1f) | 0xc0;
                uint8Array[at++] = (value & 0x3f) | 0x80;
            } else if ((value & 0xffff000) === 0) {
                uint8Array[at++] = ((value >> 12) & 0x0f) | 0xe0;
                uint8Array[at++] = ((value >> 6) & 0x3f) | 0x80;
            } else if ((value & 0xffe00000) === 0) {
                uint8Array[at++] = ((value >> 18) & 0x07) | 0xf0;
                uint8Array[at++] = ((value >> 12) & 0x3f) | 0x80;
                uint8Array[at++] = ((value >> 6) & 0x3f) | 0x80;
            } else {
                continue;
            }

            uint8Array[at++] = (value & 0x3f) | 0x80;
        }

        return uint8Array.slice(0, at);
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
        if (this._responseMsgQueue.length <= 0)
            return;

        while (this._responseMsgQueue.length > 0) {
            let packet: IWsNetMsg = this._responseMsgQueue.shift();
            const { protoId, cmd, data } = packet;
            const cmdStr = getGameProtoIdByWsNetCmd(protoId, WsNetCmdType.WNC_Response);

            if (cmd != cmdStr)
                break;

            eventMgr.emit(cmdStr, packet);

            if (this._responseMsgQueue.length <= 0)
                break;
        }
    }
}

const WsMgr = WebScoketMgr.getIns();
export default WsMgr;

