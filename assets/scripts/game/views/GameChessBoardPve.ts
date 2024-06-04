/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-03 20:40:36
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-04 16:33:59
 * @FilePath: /FiveChess/assets/scripts/game/views/GameChessBoardPve.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, EventTouch, Label, Node } from 'cc';
import { ChessBlockInfos, ChessPiecesType, GameLanguageKey, GameRoleType, GameWhoFirstPutDownType } from '../common/GameConst';
import { GameData } from '../data/GameData';
import { ChessPieces } from './ChessPieces';
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
    }

    private _onTouchMapEnd(event: EventTouch): void {

    }

    private _initUIData(): void {

    }

    private _initFiveTupleGroup(): void {

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

    //点击玩家先手
    public onClickBtnPlayerFirst(): void {
        this._selectWhoFirstStartGame(GameWhoFirstPutDownType.GFP_Player);
    }

    //点击ai先手
    public onClickBtnAiFirst(): void {
        this._selectWhoFirstStartGame(GameWhoFirstPutDownType.GFP_AI);
    }
}

