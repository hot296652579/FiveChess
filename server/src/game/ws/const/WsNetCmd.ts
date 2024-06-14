/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-14 10:47:18
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-14 14:36:10
 * @FilePath: /FiveChess/server/src/game/ws/const/WsNetCmd.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

export enum WsNetCmdType {
    WNC_Request = 'req',
    WNC_Response = 'res',
}

export enum WsNetCmd {
    WNC_CheckConnect,
    WNC_Register,
    WNC_Login,
    WNC_Heartbeat,
    WNC_Logout,
    WNC_Error,
    WNC_PutDown
}

export const WsProtoIdByWsNetCmd: Record<WsNetCmd, any> = {
    [WsNetCmd.WNC_CheckConnect]: {
        rep: 'WNC_CheckConnectReq',
        req: 'WNC_CheckConnectRes',
    },
    [WsNetCmd.WNC_Register]: {
        rep: 'WNC_RegisterReq',
        req: 'WNC_RegisterRes',
    },
    [WsNetCmd.WNC_Login]: {
        rep: 'WNC_LoginReq',
        req: 'WNC_LoginRes',
    },
    [WsNetCmd.WNC_Heartbeat]: {
        rep: 'WNC_HeartbeatReq',
        req: 'WNC_HeartbeatRes',
    },
    [WsNetCmd.WNC_Logout]: {
        rep: 'WNC_LogoutReq',
        req: 'WNC_LogoutRes',
    },
    [WsNetCmd.WNC_Error]: {
        rep: 'WNC_ErrorReq',
        req: 'WNC_ErrorRes',
    },
    [WsNetCmd.WNC_PutDown]: {
        rep: 'WNC_PutDownReq',
        req: 'WNC_PutDownRes',
    }
}

export const getGameProtoIdByWsNetCmd = (name: WsNetCmd, type: WsNetCmdType) => {
    return WsProtoIdByWsNetCmd[name][type];
}