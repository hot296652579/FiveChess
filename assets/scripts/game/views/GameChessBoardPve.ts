/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-03 20:40:36
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-12 15:14:25
 * @FilePath: /FiveChess/assets/scripts/game/views/GameChessBoardPve.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, EventTouch, instantiate, Label, Node, Prefab } from 'cc';
import { ChessBlockInfos, ChessPiecesType, GameLanguageKey, GameRoleType, GameSceneName, GameWhoFirstPutDownType } from '../common/GameConst';
import { GameData } from '../data/GameData';
import { ChessPieces } from './ChessPieces';
import { eventMgr } from '../core/base/EventMgr';
import { GameEvent } from '../common/GameEvent';
import { uimgr } from '../mgr/uimgr/UIMgr';
import { GameUtils } from '../common/GameUtils';
import { IPopViewData } from './PopView';
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
        if (!data)
            return;

        const { index } = data;
        this._putDownChessPiece(index);
    }

    /**
     * @description: 玩家下棋
     * @param {ChessPiecesType} chessPieceType
     * @return {*}
     */
    private _putDownChessPiece(posIndex: number): void {
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
        this._curPiecePosIndex = -1;

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
            let itemNode = this.chessPieceListNode.children[Math.floor(centerIndexPos)];
            if (!itemNode)
                return;

            let comp = itemNode.getComponent(ChessPieces);
            if (comp) {
                comp.updateWithData(ChessPiecesType.CT_White, centerIndexPos, ChessBlockInfos.CBI_Row / 2, (ChessBlockInfos.CBI_Col - 1) / 2);
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

    /**
     * @description: ai下棋
     * @return {*}
     */
    private _AIPutDownChessPiece(): void {
        if (this._fiveTupleGroup.length <= 0)
            return;

        let _fiveTupleGroupScore: number[] = [];
        for (let i = 0; i < this._fiveTupleGroup.length; i++) {
            let blackCount: number = 0;
            let whiteCount: number = 0;

            for (let j = 0; j < this._fiveTupleGroup[i].length; j++) {
                let index = this._fiveTupleGroup[i][j];
                let item = this.chessPieceListNode.children[index];
                if (!item) {
                    continue;
                }

                let comp = item.getComponent(ChessPieces);
                if (!comp) {
                    continue;
                }

                let chessPieceType = comp.getCurChessPieceTypeColor();
                if (chessPieceType === ChessPiecesType.CT_Black) {
                    blackCount++;
                } else if (chessPieceType === ChessPiecesType.CT_White) {
                    whiteCount++;
                }
            }

            if (blackCount === 0 && whiteCount === 0) {
                _fiveTupleGroupScore[i] = 1;
            } else if (blackCount > 0 && whiteCount > 0) {
                _fiveTupleGroupScore[i] = 0;
            } else if (whiteCount === 4) {
                _fiveTupleGroupScore[i] = 10;
            } else if (blackCount === 4) {
                _fiveTupleGroupScore[i] = 9;
            } else if (whiteCount === 3) {
                _fiveTupleGroupScore[i] = 8;
            } else if (blackCount === 3) {
                _fiveTupleGroupScore[i] = 7;
            } else if (whiteCount === 2) {
                _fiveTupleGroupScore[i] = 6;
            } else if (blackCount === 2) {
                _fiveTupleGroupScore[i] = 5;
            } else if (whiteCount === 1) {
                _fiveTupleGroupScore[i] = 4;
            } else if (blackCount === 1) {
                _fiveTupleGroupScore[i] = 3;
            }
        }

        //找到最大的五元组
        let index1: number = 0;
        let maxScore: number = 0;
        for (let i = 0; i < _fiveTupleGroupScore.length; i++) {
            if (_fiveTupleGroupScore[i] === 10) {
                index1 = i;
            }

            if (_fiveTupleGroupScore[i] > maxScore) {
                maxScore = _fiveTupleGroupScore[i];
                index1 = i;
            }
        }

        //找到五元组中落子位置，落子最好的位置在有棋子的旁边
        let index2: number = 0;
        let isBestPutDown: boolean = false;
        for (let n = 0; n < this._fiveTupleGroup[index1].length; n++) {
            let posIndex = this._fiveTupleGroup[index1][n];
            let item = this.chessPieceListNode.children[posIndex];

            if (!item) {
                continue;
            }

            let comp = item.getComponent(ChessPieces);
            if (!comp) {
                continue;
            }

            let chessPieceType = comp.getCurChessPieceTypeColor();
            if (!isBestPutDown && chessPieceType === ChessPiecesType.CT_Empty) {
                index2 = n;
            }

            if (!isBestPutDown && chessPieceType != ChessPiecesType.CT_Empty) {
                isBestPutDown = true;
            }

            if (!isBestPutDown && chessPieceType == ChessPiecesType.CT_Empty) {
                index2 = n;
                break
            }
        }

        let pos: number = this._fiveTupleGroup[index1][index2];
        if (pos) {
            GameData.getIns().turnWhoRoleType = GameRoleType.GRT_White;
            this._putDownChessPiece(pos);
        }
    }

    /**
     * @description: 检测五子是否连珠
     * @return {*}
     */
    private _checkIsConnectFievePiece(): boolean {
        let row_x: number = this._curPiecePosIndex % ChessBlockInfos.CBI_Row;
        let row_y: number = Math.floor(this._curPiecePosIndex / ChessBlockInfos.CBI_Row);

        let curTurnWhoRoleType = GameData.getIns().turnWhoRoleType;

        let checkChessPieceType: ChessPiecesType = ChessPiecesType.CT_Empty;
        if (curTurnWhoRoleType === GameRoleType.GRT_Black) {
            checkChessPieceType = ChessPiecesType.CT_Black;
        } else if (curTurnWhoRoleType === GameRoleType.GRT_White) {
            checkChessPieceType = ChessPiecesType.CT_White;
        } else {
            return false;
        }

        //检测横向
        let num: number = 1;
        for (let x = row_x - 1; x >= 0; x--) {
            if (this._checkChessPiecePutDown(row_y * ChessBlockInfos.CBI_Row + x, checkChessPieceType)) {
                num++;
            } else {
                break;
            }
        }

        if (num >= 5) {
            return true;
        }

        for (let x = row_x + 1; x < ChessBlockInfos.CBI_Row; x++) {
            if (this._checkChessPiecePutDown(row_y * ChessBlockInfos.CBI_Row + x, checkChessPieceType)) {
                num++;
            } else {
                break;
            }
        }

        if (num >= 5) {
            return true;
        }

        //检测纵向
        num = 1;
        for (let y = row_y - 1; y >= 0; y--) {
            if (this._checkChessPiecePutDown(y * ChessBlockInfos.CBI_Col + row_x, checkChessPieceType)) {
                num++;
            } else {
                break;
            }
        }

        if (num >= 5) {
            return true;
        }

        for (let y = row_y + 1; y <= ChessBlockInfos.CBI_Col; y++) {
            if (this._checkChessPiecePutDown(y * ChessBlockInfos.CBI_Col + row_x, checkChessPieceType)) {
                num++;
            } else {
                break;
            }
        }

        if (num >= 5) {
            return true;
        }

        //检测左上到右下
        num = 1;
        //zuo shang
        for (let x = row_x - 1; x >= 0; x--) {
            let index = (row_y - (row_x - x)) * ChessBlockInfos.CBI_Row + x;
            if (this._checkChessPiecePutDown(index, checkChessPieceType)) {
                num++;
            } else {
                break;
            }
        }

        if (num >= 5) {
            return true;
        }

        //you xia
        for (let x = row_x + 1; x < ChessBlockInfos.CBI_Row; x++) {
            let index = (row_y + (x - row_x)) * ChessBlockInfos.CBI_Row + x;
            if (this._checkChessPiecePutDown(index, checkChessPieceType)) {
                num++;
            } else {
                break;
            }
        }

        if (num >= 5) {
            return true;
        }

        //左下右上
        //zuo xia
        num = 1;
        for (let x = row_x - 1; x >= 0; x--) {
            let index = (row_y + (row_x - x)) * ChessBlockInfos.CBI_Row + x;
            if (this._checkChessPiecePutDown(index, checkChessPieceType)) {
                num++;
            }
            else {
                break;
            }
        }

        if (num >= 5) {
            return true;
        }

        //you shang
        for (let x = row_x + 1; x < ChessBlockInfos.CBI_Row; x++) {
            let index = (row_y - (x - row_x)) * ChessBlockInfos.CBI_Row + x;
            if (this._checkChessPiecePutDown(index, checkChessPieceType)) {
                num++;
            }
            else {
                break;
            }
        }

        if (num >= 5) {
            return true;
        }

        return false;
    }

    /**
     * @description: 检测是否为同一棋子
     * @param {number} posIndex
     * @param {ChessPiecesType} checkChessPieceType
     * @return {*}
     */
    private _checkChessPiecePutDown(posIndex: number, checkChessPieceType: ChessPiecesType): boolean {
        let chessPieceItem = this.chessPieceListNode.children[posIndex];
        if (!chessPieceItem)
            return false;

        let comp = chessPieceItem.getComponent(ChessPieces);
        if (!comp)
            return false;

        let chessPieceType: ChessPiecesType = comp.getCurChessPieceTypeColor();
        if (chessPieceType == checkChessPieceType) {
            return true;
        }
        return false;
    }

    private _checkIsGameOver(): void {
        let isMan5GameOver = this._checkIsConnectFievePiece();
        let isTurnMyPlayer: boolean = false;
        if (GameData.getIns().turnWhoRoleType === GameData.getIns().myRoleType) {
            isTurnMyPlayer = true;
        }

        if (isMan5GameOver) {
            let strTips: string = isTurnMyPlayer ? `${GameLanguageKey.GLK_PlayerWin}` : `${GameLanguageKey.GLK_AiWin}`;
            const data: IPopViewData = {
                content: `${strTips}`,
                title: `${GameLanguageKey.GLK_GameOVer}`,
                btnDes: `${GameLanguageKey.GLK_RestarGame}`,
                closeCallback: () => {
                    GameUtils.switchScene(GameSceneName.GSC_Hall);
                },
                resetCallback: () => {
                    this._resetChessBoradUI();
                }
            }
            uimgr.showPopView(data);
        } else {
            GameData.getIns().turnWhoRoleType = isTurnMyPlayer ? GameRoleType.GRT_White : GameRoleType.GRT_Black;
            if (isTurnMyPlayer) {
                this._setWaitTouchBlockShild(true);
                GameData.getIns().turnWhoRoleType = GameData.getIns().getOtherRoleType();
                this.scheduleOnce(() => {
                    //AI put down
                    this._AIPutDownChessPiece();
                    GameData.getIns().turnWhoRoleType = GameData.getIns().myRoleType;
                }, 1)
            } else {
                this._setWaitTouchBlockShild(false);
            }
        }
    }

    private _setWaitTouchBlockShild(status: boolean): void {
        if (this.touchBlockNode) {
            if (this.touchBlockNode) {
                this.touchBlockNode.active = status;
            }
        }
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

