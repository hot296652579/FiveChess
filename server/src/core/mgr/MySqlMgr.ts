/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-29 09:03:28
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-29 09:57:42
 * @FilePath: /FiveChess/server/src/core/mgr/MySqlMgr.ts
 * @Description: 数据库管理类
 */
import { MySQLConfig } from "../../config/DBConfig";
import { Single } from "../base/Single";
import mysql from 'mysql';
import { loggerMgr } from "./LoggerMgr";


const TAG = 'MySqlMgr';
export class MySqlMgr extends Single {
    private _mySqlPool: any;

    public static getIns() {
        return super.getInstance<MySqlMgr>();
    }

    constructor() {
        super();
        this._mySqlPool = null;
        this._initialize();
    }

    private _initialize() {
        this._mySqlPool = mysql.createPool(MySQLConfig);
    }

    public get mySqlPool() {
        return this._mySqlPool;
    }
    /**
     * @description: 操作 查询数据库
     * @param {string} queryStr
     * @param {any} param
     * @return {*}
     */
    public query(queryStr: string, param: any) {
        return new Promise((resolve, reject) => {
            this._mySqlPool.getConnection((err: Error, connection: any) => {
                if (err) {
                    loggerMgr.error(TAG, 'db connect error', err);
                    reject(err);
                } else {
                    loggerMgr.info(TAG, 'db connect success');
                    connection.query(queryStr, param, (err: Error, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                        connection.release();
                    });
                }
            });
        })
    }

    public queryCallback(queryStr: string, param: any, callback: Function) {
        this._mySqlPool.getConnection((err: Error, connection: any) => {
            if (err) {
                loggerMgr.error(TAG, 'db connect error', err);
                callback(err);
            } else {
                loggerMgr.info(TAG, 'db connect success');
                connection.query(queryStr, param, (err: Error, result: any) => {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                    connection.release();
                });
            }
        })
    }
}

let mysqlMgr = new MySqlMgr();
export default mysqlMgr;