/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-29 10:07:15
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-29 10:11:21
 * @FilePath: /FiveChess/server/src/game/const/SqlCRUD.ts
 * @Description:数据库操作语句, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const UserSql = {
    queryById: 'SELECT * FROM games-users WHERE uid = ?',
    queryByUname: 'SELECT * FROM games-users WHERE uname = ?',
    register: 'INSERT INTO games-users set ?',
    checkLogin: 'SELECT password,uid FROM games-users WHERE uname = ?',
    updateUser: 'update games-users set ? where uid = ?',
}