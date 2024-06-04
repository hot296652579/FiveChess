/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-06-03 20:40:36
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-03 20:54:53
 * @FilePath: /FiveChess/assets/scripts/game/views/GameChessBoardPve.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { _decorator, Component, EventTouch, Node } from 'cc';
import { GameWhoFirstPutDownType } from '../common/GameConst';
const { ccclass, property } = _decorator;

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

