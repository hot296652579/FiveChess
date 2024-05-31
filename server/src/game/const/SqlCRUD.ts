/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-29 10:07:15
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-31 14:00:08
 * @FilePath: /FiveChess/server/src/game/const/SqlCRUD.ts
 * @Description:数据库操作语句, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * @description: 用户数据库操作语句
 * @return {*}
 */
export const UserSql = {
    queryById: 'SELECT * FROM `games-users` WHERE uid = ?',
    queryByUname: 'SELECT * FROM `games-users` WHERE uname = ?',
    register: 'INSERT INTO `games-users` (uid, uuid, uname, password, ugender, ubalance, created_time, updated_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    checkLogin: 'SELECT password, uid FROM `games-users` WHERE uname = ?',
    updateUser: 'UPDATE `games-users` SET uname = ?, password = ?, email = ? WHERE uid = ?',
}

/**测试数据库语句*/
//INSERT INTO`games-users`(uid, uuid, uname, password, ugender, ubalance, created_time, update_time)
//VALUES('uid_value', 'uuid_value', 'uname_value', 'password_value', 1, 200, '2024-01-01 00:00:00', '2024-01-01 00:00:00');

// {
//     uid: "355d75f0-1f10-11ef-a3dd-f9b98d800850",
//     uuid: "3c28f670-1f10-11ef-a3dd-f9b98d800850",
//     uname: "222",
//     password: "bcbe3365e6ac95ea2c0343a2395834dd",
//     ugender: 0,
//     ubalance: 9527,
//     create_time: "2024-05-31 13:39:17",
//     update_time: "2024-05-31 13:39:17",
// }
