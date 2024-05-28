/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-28 13:34:12
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-28 14:02:25
 * @FilePath: /FiveChess/server/src/core/mgr/Logge rMgr.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Single } from "../base/Single";
import * as log4js from "log4js";
import { Logger, Configuration } from "log4js";

enum LoggerInitType {
    CONSOLE = 1,
    NORMAL
}

const TAG = 'LoggerMgr';

export class LoggerMgr extends Single {
    private initedType?: LoggerInitType;
    private logger?: Logger;

    public constructor() {
        super();

        this.logger = log4js.getLogger();
    }

    public static getIns() {
        return super.getInstance<LoggerMgr>();
    }

    initalize(config: Configuration) {
        if (this.initedType == LoggerInitType.NORMAL) {
            return
        }

        this.initedType = LoggerInitType.NORMAL;
        log4js.configure(config);
    }

    /**
     * @description: 初始化配置
     * @return {*}
     */
    private initConsole() {
        let config: Configuration = {
            appenders: {
                out: { type: "console" }
            },
            categories: {
                default: { appenders: ["out"], level: "all" }
            }
        }

        log4js.configure(config);
        this.logger = log4js.getLogger();
        this.initedType = LoggerInitType.CONSOLE;
    }

    public warn(...args: any[]): void {
        if (!this.logger?.isWarnEnabled()) {
            return
        }

        this.logger.warn(this._writeLog(...args));
    }

    private _writeLog(...args: any[]): string {
        if (!this.initedType) {
            console.log(TAG, 'logger not inited');
        }

        let str = '';
        for (let i = 0; i < args.length; i++) {
            let arg: any = args[i];
            if (i > 0) {
                str += ' ';
                if (typeof args == 'object') {
                    str += JSON.stringify(arg);
                } else {
                    str += arg;
                }
            } else {
                if (typeof args == 'object') {
                    str = JSON.stringify(arg);
                } else {
                    str = arg;
                }
            }
        }

        return str;
    }
}

const loggerMgr = LoggerMgr.getIns();
export { loggerMgr };