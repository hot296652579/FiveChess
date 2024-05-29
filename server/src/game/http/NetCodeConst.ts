/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-29 10:22:05
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-29 10:41:55
 * @FilePath: /FiveChess/server/src/game/http/NetCodeConst.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export enum NetCodeConst {
    // 登录
    LoginSuccess = 100,
    RegisterSuccess = 101,

    /**错误code*/
    ParamsError = 10000,
    SqlError,
    AccountExistError,
    AccountIsNotExistError,
    UserNameOrPasswordError,
}

export const NetCodeText: Record<NetCodeConst, string> = {
    [NetCodeConst.LoginSuccess]: "登录成功",
    [NetCodeConst.RegisterSuccess]: "注册成功",

    [NetCodeConst.ParamsError]: "参数错误",
    [NetCodeConst.SqlError]: "数据库错误",
    [NetCodeConst.AccountExistError]: "用户已存在",
    [NetCodeConst.AccountIsNotExistError]: "用户不存在",
    [NetCodeConst.UserNameOrPasswordError]: "用户名或密码错误",
}

