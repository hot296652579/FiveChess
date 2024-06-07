/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-03 20:40:36
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-06 20:48:29
 * @FilePath: /FiveChess/assets/scripts/game/views/GameChessBoardPve.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, EventTouch, instantiate, Label, Node, Prefab } from 'cc';
import { ChessBlockInfos, ChessPiecesType, GameLanguageKey, GameRoleType, GameWhoFirstPutDownType } from '../common/GameConst';
import { GameData } from '../data/GameData';
import { ChessPieces } from './ChessPieces';
import { eventMgr } from '../core/base/EventMgr';
import { GameEvent } from '../common/GameEvent';
import { uimgr } from '../mgr/uimgr/UIMgr';
const { ccclass, property } = _decorator;
// 棋盘 col-18 row-18
@ccclass('GameChessBoardPve')
export class GameChessBoardPve extends Component {

    @property(Node)
    chessPieceListNode: Node = null;

    @property(Node)
    touchBlockNode: Node = null;

    @property(Node)
    btnNode: Node = null;

    @property(Node)
    topNode: Node = null;

    @property(Node)
    tipNode: Node = null;

    @property(Prefab)
    chessPiecesPrefab: Prefab = null;

    //存放棋子坐标
    private _fiveTupleGroup: number[][] = [];
    // 当前棋子位置索引
    private _curPiecePosIndex: number = 0;

    start() {
        this._initEvent();
        this._initUIData();
    }

    private _initEvent(): void {
        if (this.chessPieceListNode) {
            this.chessPieceListNode.on(Node.EventType.TOUCH_END, this._onTouchMapEnd, this);
        }
        if (this.touchBlockNode) {
            this.touchBlockNode.on(Node.EventType.TOUCH_END, this._onTouchBlockEnd, this);
        }

        eventMgr.on(GameEvent.UI_ClickPutDownChessPiece, this._onClickPutDownChessPieceCallBack, this);
    }

    private _onTouchMapEnd(event: EventTouch): void {

    }

    private _onTouchBlockEnd(event: EventTouch): void {
        uimgr.showTipsView(GameLanguageKey.GLK_WhoFirstGo, this.node);
    }

    private _onClickPutDownChessPieceCallBack(data: any): void {
        console.log("_onClickPutDownChessPieceCallBack", data);
    }

    /**
     * @description: 玩家下棋
     * @param {ChessPiecesType} chessPieceType
     * @return {*}
     */
    private _playerPutDownChessPiece(posIndex: number): void {
        let chessPieceItem = this.chessPieceListNode.children[posIndex];
        if (!chessPieceItem)
            return;

        let comp = chessPieceItem.getComponent(ChessPieces);
        if (!comp)
            return;

        let chessPieceType = GameData.getIns().getChessPieceType();
        comp.updateWithData(chessPieceType);
        this._curPiecePosIndex = posIndex;
        this._checkIsGameOver();
    }

    private _initUIData(): void {
        this._resetChessBoradUI();
        this._initFiveTupleGroup();
    }

    /**
     * @description: 初始化五元组
     * @return {*}
     */
    private _initFiveTupleGroup(): void {
        this._fiveTupleGroup = [];
        let totalRowOrCol: number = 18;
        let perCheckCount: number = 14;

        //横向五元祖占位
        for (let y = 0; y < totalRowOrCol; y++) {
            for (let x = 0; x < perCheckCount; x++) {
                this._fiveTupleGroup.push([y * totalRowOrCol + x, y * totalRowOrCol + x + 1, y * totalRowOrCol + x + 2, y * totalRowOrCol + x + 3, y * totalRowOrCol + x + 4]);
            }
        }

        //纵向五元组占位
        for (let x = 0; x < totalRowOrCol; x++) {
            for (let y = 0; y < perCheckCount; y++) {
                this._fiveTupleGroup.push([x + y * totalRowOrCol, x + (y + 1) * totalRowOrCol, x + (y + 2) * totalRowOrCol, x + (y + 3) * totalRowOrCol, x + (y + 4) * totalRowOrCol]);
            }
        }

        //左上到右下五元组占位
        for (let y = 0; y < perCheckCount; y++) {
            for (let x = 0; x < perCheckCount; x++) {
                this._fiveTupleGroup.push([y * totalRowOrCol + x, (y + 1) * totalRowOrCol + x + 1, (y + 2) * totalRowOrCol + x + 2, (y + 3) * totalRowOrCol + x + 3, (y + 4) * totalRowOrCol + x + 4]);
            }
        }

        //左下到右上五元组占位
        for (let y = 4; y < totalRowOrCol; y++) {
            for (let x = 0; x < perCheckCount; x++) {
                this._fiveTupleGroup.push([y * totalRowOrCol + x, (y - 1) * totalRowOrCol + x + 1, (y - 2) * totalRowOrCol + x + 2, (y - 3) * totalRowOrCol + x + 3, (y - 4) * totalRowOrCol + x + 4]);
            }
        }

        console.log("_fiveTupleGroup", this._fiveTupleGroup);
    }

    private _resetChessBoradUI(): void {
        if (!this.chessPieceListNode) {
            return;
        }

        this.chessPieceListNode.removeAllChildren();
        let originPosX = ChessBlockInfos.CBI_AlignOriginPosX as number;
        let originPosY = ChessBlockInfos.CBI_AlignOriginPosY as number;
        let originAlignXY = ChessBlockInfos.CBI_AlignXY as number;
        let index = 0;

        for (let i = 0; i < ChessBlockInfos.CBI_Row; i++) {
            for (let j = 0; j < ChessBlockInfos.CBI_Col; j++) {
                let posX = originPosX + originAlignXY + i * ChessBlockInfos.CBI_With + i * 0.8;
                let posY = originPosY + originAlignXY + j * ChessBlockInfos.CBI_Height + j * 0.8;

                if (!this.chessPiecesPrefab)
                    return;

                let chessNode = instantiate(this.chessPiecesPrefab);
                if (!chessNode)
                    continue;

                let comp = chessNode.getComponent(ChessPieces);
                if (!comp)
                    continue;

                comp.updateWithData(ChessPiecesType.CT_Empty, index, i, j);
                chessNode.setPosition(posX, posY, 0);
                this.chessPieceListNode.addChild(chessNode);
                index++;
            }
        }
        this._setBtnNodeStatus(true);

        if (this.touchBlockNode) {
            this.touchBlockNode.active = false;
        }

        if (this.tipNode.getComponent(Label)) {
            this.topNode.active = true;
            const lb = this.tipNode.getComponent(Label);
            lb.string = `${GameLanguageKey.GLK_WhoFirstGo}`;
        }

        if (this.topNode) {
            this.topNode.active = true;
        }
    }

    private _setBtnNodeStatus(status: boolean) {
        if (this.btnNode) {
            this.btnNode.active = status;
        }
    }

    /**
     * @description: 根据类型判断 谁先手
     * @param {GameWhoFirstPutDownType} whoFirstType
     * @return {*}
     */
    private _selectWhoFirstStartGame(whoFirstType: GameWhoFirstPutDownType): void {
        GameData.getIns().setWhoFirstPutDownPiece(whoFirstType);
        if (whoFirstType === GameWhoFirstPutDownType.GFP_Player) {
            if (this.tipNode) {
                const lb = this.tipNode.getComponent(Label);
                lb.string = `${GameLanguageKey.GLK_FirstPlayer}`;
            }
            GameData.getIns().turnWhoRoleType = GameRoleType.GRT_Black;
        } else if (whoFirstType === GameWhoFirstPutDownType.GFP_AI) {
            if (this.tipNode) {
                const lb = this.tipNode.getComponent(Label);
                lb.string = `${GameLanguageKey.GLK_FirstAI}`;
            }

            //中心点位置
            let centerIndexPos: number = (ChessBlockInfos.CBI_Row * ChessBlockInfos.CBI_Col - 1) / 2;
            let itemNode = this.chessPieceListNode.children[centerIndexPos];
            if (!itemNode)
                return;

            let comp = itemNode.getComponent(ChessPieces);
            if (comp) {
                comp.updateWithData(ChessPiecesType.CT_White);
            }
            GameData.getIns().turnWhoRoleType = GameRoleType.GRT_White;
        }

        setTimeout(() => {
            if (this.tipNode) {
                this.tipNode.active = false;
            }
        }, 1000);

        if (this.touchBlockNode) {
            this.touchBlockNode.active = false;
        }

        if (this.topNode) {
            this.topNode.active = true;
        }
    }

    private _checkIsGameOver(): void {

    }

    //点击玩家先手
    public onClickBtnPlayerFirst(): void {
        this._selectWhoFirstStartGame(GameWhoFirstPutDownType.GFP_Player);
    }

    //点击ai先手
    public onClickBtnAiFirst(): void {
        this._selectWhoFirstStartGame(GameWhoFirstPutDownType.GFP_AI);
    }

    protected onDestroy(): void {
        eventMgr.off(GameEvent.UI_ClickPutDownChessPiece, this._onClickPutDownChessPieceCallBack);
    }
}

