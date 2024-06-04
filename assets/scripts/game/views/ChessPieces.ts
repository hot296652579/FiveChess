/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-04 16:31:22
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-04 16:33:34
 * @FilePath: /FiveChess/assets/scripts/game/views/ChessPieces.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, Node } from 'cc';
import { ChessPiecesType } from '../common/GameConst';
const { ccclass, property } = _decorator;

@ccclass('ChessPieces')
export class ChessPieces extends Component {

    private _row: number = 0;
    private _col: number = 0;
    private _index: number = 0;
    private _curChessPieceType: ChessPiecesType = ChessPiecesType.CT_Empty;
    start() {

    }

    public updateWithData(chessPieceType: ChessPiecesType, index?: number, row?: number, col?: number) {

    }

    update(deltaTime: number) {

    }
}

