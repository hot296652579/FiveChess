/*
 * @Author: super_javan 296652579@qq.com
 * @Date: 2024-05-31 15:34:00
 * @LastEditors: super_javan 296652579@qq.com
 * @LastEditTime: 2024-06-11 21:19:39
 * @FilePath: /FiveChess/assets/scripts/game/data/GameData.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ChessPiecesType, GameModelType, GameRoleType, GameWhoFirstPutDownType } from "../common/GameConst";
import { Single } from "../core/base/Single";
import { GamePlayerData } from "./GamePlayerData";

export class GameData extends Single {
    public static getIns(): GameData {
        return super.getInstance<GameData>();
    }

    public setWhoFirstPutDownPiece(whoFirstType: GameWhoFirstPutDownType) {
        this.myRoleType = GameRoleType.GRT_Black;
        if (whoFirstType == GameWhoFirstPutDownType.GFP_AI) {
            this.myRoleType = GameRoleType.GRT_White;
        } else {
            this.myRoleType = GameRoleType.GRT_Black;
        }
    }

    public getChessPieceType(): ChessPiecesType {
        let gameRoleType = this.turnWhoRoleType;
        let chessPieceType = ChessPiecesType.CT_Empty;
        if (gameRoleType == GameRoleType.GRT_Black) {
            chessPieceType = ChessPiecesType.CT_Black;
        } else if (gameRoleType == GameRoleType.GRT_White) {
            chessPieceType = ChessPiecesType.CT_White;
        }
        return chessPieceType;
    }

    public getOtherRoleType() {
        if (this.myRoleType === GameRoleType.GRT_Black) {
            return GameRoleType.GRT_White;
        } else {
            return GameRoleType.GRT_Black;
        }
    }

    public isOnLineLogin: boolean = false;
    public curPlayerData: GamePlayerData = null;
    public curGameModelType: GameModelType = GameModelType.GMT_PVE;
    public myRoleType: GameRoleType = GameRoleType.GRT_Black;
    public turnWhoRoleType: GameRoleType = GameRoleType.GRT_Guest;
}