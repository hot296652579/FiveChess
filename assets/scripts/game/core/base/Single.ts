/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-27 20:47:13
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-05-28 10:27:41
 * @FilePath: /FiveChess/assets/scripts/game/core/base/Single.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export class Single {
    private static instance: Single;
    public constructor(...args: any[]) { }

    public static getInstance(...args: any[]): Single {
        if (!this.instance) {
            this.instance = new this(...args);
        }
        return this.instance;
    }
}

