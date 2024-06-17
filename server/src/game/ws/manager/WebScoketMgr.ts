/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-14 10:47:40
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-17 16:07:04
 * @FilePath: /FiveChess/server/src/game/ws/manager/WebScoketMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */


import { Server, WebSocket } from "ws";
import { Single } from "../../../core/base/Single";
import { WsNetCmd, WsNetCmdType, getGameProtoIdByWsNetCmd } from "../const/WsNetCmd";
import { HostConfig } from "../../../config/HostConfig";
import { LoggerMgr, loggerMgr } from "../../../core/mgr/LoggerMgr";
import { EventMgr } from "../../../core/mgr/EventMgr";
import { GlobalUtils } from "../../../core/utils/GlobalUtils";


export interface IWsNetMsg {
    protoId: WsNetCmd;
    cmd: string;
    data: any;
}

const TAG = "WebScoketMgr";

export class WebScoketMgr extends Single {

    private clientIdForWsMap: Map<number, WebSocket> = new Map<number, WebSocket>();
    private wsForClientIdMap: Map<WebSocket, number> = new Map<WebSocket, number>();
    private uidForWsMap: Map<string, WebSocket> = new Map<string, WebSocket>();
    private wsForUidMap: Map<WebSocket, string> = new Map<WebSocket, string>();

    private _globalClientId: number = 0;
    private _wss: Server | undefined;

    public static getIns() {
        return super.getInstance<WebScoketMgr>();
    }

    public async init() {
        await this._initailizeWs();
    }

    private async _initailizeWs() {
        return new Promise((resolve, reject) => {
            const wss = new WebSocket.Server({ port: HostConfig.GameWsServerPortDev });
            this._wss = wss;

            wss.on('error', (err) => {
                loggerMgr.error(TAG, 'ws server error', err);
                reject(err);
            })

            wss.on('close', () => {
                loggerMgr.error(TAG, 'ws server close');
                reject();
            })

            wss.on('listening', async (ws: WebSocket) => {
                loggerMgr.info(TAG, 'ws server listening');

                wss.on('connection', async (ws: WebSocket) => {
                    loggerMgr.info(TAG, 'ws server connection');
                    this._globalClientId++;
                    if (!this.clientIdForWsMap.has(this._globalClientId)) {
                        this.clientIdForWsMap.set(this._globalClientId, ws);
                    }
                    if (!this.wsForClientIdMap.has(ws)) {
                        this.wsForClientIdMap.set(ws, this._globalClientId);
                    }

                    ws.on('message', async (buffer: Buffer) => {
                        loggerMgr.info(TAG, 'ws server handler msg', buffer.toString());
                        this._handlerWsMsg(ws, buffer)
                    })

                    ws.on('close', async (code: number, reason: string) => {
                        this._handlerWsClose(ws);
                    })
                })

            })
        })
    }

    /**
     * @description: 处理客户端发送的消息数据
     * @param {WebSocket} ws
     * @param {Buffer} buffer
     * @return {*}
     */
    private _handlerWsMsg(ws: WebSocket, buffer: Buffer): void {
        try {
            const bufferStr = buffer.toString();
            const msgObj: IWsNetMsg = JSON.parse(bufferStr);
            const { protoId, cmd, data } = msgObj;

            const cmdStr = getGameProtoIdByWsNetCmd(protoId, WsNetCmdType.WNC_Request);

            if (cmdStr != cmd) {
                loggerMgr.error(TAG, 'ws server handler msg error, cmd not match', cmdStr, cmd);
                return;
            }

            if (protoId == WsNetCmd.WNC_CheckConnect) {
                let uid = data.uid;
                if (ws && !GlobalUtils.isCheckStringEmpty(uid) && !this.uidForWsMap.has(uid)) {
                    this.uidForWsMap.set(uid, ws);
                    if (!this.wsForUidMap.has(ws)) {
                        this.wsForUidMap.set(ws, uid);
                    }

                    this.sendOneServerMsg(uid, WsNetCmd.WNC_CheckConnect, { uid: uid })
                }
                return;
            }

            EventMgr.getIns().emit(cmdStr, { msg: data });
        } catch (err) {
            if (ws) {
                ws.close();
            }
            loggerMgr.error(TAG, 'ws server handler msg error', err);
        }
    }

    private _handlerWsClose(ws: WebSocket): void {
        if (!ws) {
            loggerMgr.error(TAG, 'ws server handler close error, ws is null');
            return;
        }

        if (this.wsForClientIdMap.has(ws)) {
            const clientId = this.wsForClientIdMap.get(ws) as number;
            if (clientId) {
                this.wsForClientIdMap.delete(ws);
            }

            if (this.clientIdForWsMap.has(clientId)) {
                this.clientIdForWsMap.delete(clientId);
            }

            if (this.wsForUidMap.has(ws)) {
                const uid: string = this.wsForUidMap.get(ws) as string;
                if (uid) {
                    this.uidForWsMap.delete(uid);
                }
                this.wsForUidMap.delete(ws);
            }

            ws.close();
        }
    }

    /**
     * @description: 全服发送消息
     * @param {WsNetCmd} protoId
     * @param {any} sendData
     * @return {*}
     */
    public sendAllServerMsg(protoId: WsNetCmd, sendData: any): void {
        if (this.clientIdForWsMap.size <= 0)
            return;

        const cmdStr = getGameProtoIdByWsNetCmd(protoId, WsNetCmdType.WNC_Response);
        const msgObj: IWsNetMsg = {
            protoId: protoId,
            cmd: cmdStr,
            data: sendData
        };
        const msgStr = JSON.stringify(msgObj);
        const msgUint8Array = this._str2Uint8Array(msgStr);

        this.clientIdForWsMap.forEach(ws => {
            if (ws && ws.readyState == WebSocket.OPEN) {
                ws.send(msgUint8Array);
            }
        });
    }

    /**
     * @description: 单个玩家发送消息
     * @param {string} uid
     * @param {WsNetCmd} protoId
     * @param {any} sendData
     * @return {*}
     */
    public sendOneServerMsg(uid: string, protoId: WsNetCmd, sendData: any): void {
        if (this.uidForWsMap.size <= 0)
            return;

        const cmdStr = getGameProtoIdByWsNetCmd(protoId, WsNetCmdType.WNC_Response);
        const msgObj: IWsNetMsg = {
            protoId: protoId,
            cmd: cmdStr,
            data: sendData
        };
        const msgStr = JSON.stringify(msgObj);
        const msgUint8Array = this._str2Uint8Array(msgStr);

        if (this.uidForWsMap.has(uid)) {
            const ws = this.uidForWsMap.get(uid) as WebSocket;
            if (ws && ws.readyState == WebSocket.OPEN) {
                ws.send(msgUint8Array);
            }
        }
    }

    public _str2Uint8Array(str: string): Uint8Array {
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

    public closeAllWs(): void {
        for (const ws of this.wsForClientIdMap.keys()) {
            if (ws && ws.readyState == WebSocket.OPEN)
                ws.close();
        }
        this.wsForClientIdMap.clear();
        this.clientIdForWsMap.clear();
        this.uidForWsMap.clear();
    }

}

const WsMgr = WebScoketMgr.getIns();
export default WsMgr;

