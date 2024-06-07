/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-04 16:31:22
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-05 20:35:38
 * @FilePath: /FiveChess/assets/scripts/game/views/ChessPieces.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, EventTouch, Node, NodeEventType } from 'cc';
import { ChessPiecesType, GameRoleType } from '../common/GameConst';
import { GameData } from '../data/GameData';
import { eventMgr } from '../core/base/EventMgr';
import { GameEvent } from '../common/GameEvent';
const { ccclass, property } = _decorator;

const TAG = 'ChessPieces';

@ccclass('ChessPieces')
export class ChessPieces extends Component {

    @property(Node)
    piecesBlack: Node = null;

    @property(Node)
    piecesWhite: Node = null;

    private _row: number = 0;
    private _col: number = 0;
    private _index: number = 0;
    private _curChessPieceType: ChessPiecesType = ChessPiecesType.CT_Empty;

    start() {
        this._initEvent();

        this._setPieceBlackIsShow(false);
        this._setPieceWhiteIsShow(false);
    }

    private _initEvent() {
        this.node.on(NodeEventType.TOUCH_END, this._onTouchEndEvent, this);
    }

    public resetChessPieces() {
        this._curChessPieceType = ChessPiecesType.CT_Empty;
        this.updateWithData(this._curChessPieceType);
    }

    /**
     * @description: 获取触摸棋子的颜色
     * @return {*}
     */
    public getCurChessPieceTypeColor() {
        return this._curChessPieceType;
    }

    private _onTouchEndEvent(event: EventTouch) {
        console.log(TAG, '_onTouchEndEvent');

        if (GameData.getIns().myRoleType === GameRoleType.GRT_Guest) {
            return;
        }

        // if (this._curChessPieceType == ChessPiecesType.CT_Empty) {
        //     return;
        // }
        if (GameData.getIns().myRoleType == GameRoleType.GRT_Black) {
            this._curChessPieceType = ChessPiecesType.CT_Black;
        } else if (GameData.getIns().myRoleType == GameRoleType.GRT_White) {
            this._curChessPieceType = ChessPiecesType.CT_White;
        }

        this._setChessPieceColorShowByChessPiecesType(this._curChessPieceType);
        eventMgr.emit(GameEvent.UI_ClickPutDownChessPiece, { index: this._index, row: this._row, col: this._col, chessPieceType: this._curChessPieceType });
    }

    /**
     * @description: 根据棋子类型 设置显示黑白子
     * @param {ChessPiecesType} chessPieceType
     * @return {*}
     */
    private _setChessPieceColorShowByChessPiecesType(chessPieceType: ChessPiecesType) {
        if (chessPieceType == ChessPiecesType.CT_Black) {
            this._setPieceBlackIsShow(true);
            this._setPieceWhiteIsShow(false);
        } else if (chessPieceType == ChessPiecesType.CT_White) {
            this._setPieceBlackIsShow(false);
            this._setPieceWhiteIsShow(true);
        } else {
            this._setPieceBlackIsShow(true);
            this._setPieceWhiteIsShow(false);
        }
    }

    private _setPieceBlackIsShow(status: boolean) {
        if (this.piecesBlack) {
            this.piecesBlack.active = status;
        }
    }

    private _setPieceWhiteIsShow(status: boolean) {
        if (this.piecesWhite) {
            this.piecesWhite.active = status;
        }
    }

    public updateWithData(chessPieceType: ChessPiecesType, index?: number, row?: number, col?: number) {
        this._curChessPieceType = chessPieceType;
        if (row) {
            this._row = row;
        }

        if (col) {
            this._col = col;
        }

        if (index) {
            this._index = index;
        }

        this._setChessPieceColorShowByChessPiecesType(this._curChessPieceType);
    }

    update(deltaTime: number) {

    }
}

