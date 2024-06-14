/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-14 10:47:40
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-14 14:57:05
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
        await this._initailizeWs()
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

                ws.on('connection', async (ws: WebSocket) => {
                    loggerMgr.info(TAG, 'ws server connection');
                    this._globalClientId++;
                    if (!this.clientIdForWsMap.has(this._globalClientId)) {
                        this.clientIdForWsMap.set(this._globalClientId, ws);
                    }
                    if (!this.wsForClientIdMap.has(ws)) {
                        this.wsForClientIdMap.set(ws, this._globalClientId);
                    }

                    ws.on('message', async (buffer: Buffer) => {
                        this._handlerWsMsg(ws, buffer)
                    })

                    ws.on('close', async (code: number, reason: string) => {

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

}

const WsMgr = WebScoketMgr.getIns();
export default WsMgr;

