/// <reference path="../../vendor/phaser-official/typescript/phaser.d.ts"/>
/// <reference path="../Classes/Initialization.ts"/>
/// <reference path="Main.ts"/>

module MatchingPairs.State {
    export class Menu extends Phaser.State {
        private style = {font: "15px Arial", fill: "#ff0011", align: "center"};
        private winText:Phaser.Text;
        private isMaxLevel:boolean = false;

        create():void {
            this.startOrContinueGame();
        }
        private startOrContinueGame():void {
            if (Initialization.LEVEL == 1) {
                this.game.state.start("main");
            } else {
                this.isWinCondition();
                Initialization.MOVES = 0;
                this.input.onDown.addOnce(() => {
                    this.game.state.start("main")
                });
            }
        }
        private isWinCondition():void {
            this.winText = this.game.add.text(this.game.width * 0.5, this.game.height * 0.5, "CONGRATULATIONS! \n " +
                "You completed level " + this.getLevelHelper() + " with " + Initialization.MOVES + " moves. \nAnd total played time of: " + Main.timeHelper() +
                " \n Click to continue...", this.style);
                this.winText.anchor.set(0.5, 0.5);
        }
        private getLevelHelper():number {
            var currentLevel:number = Initialization.LEVEL;
            if (currentLevel != 5) {
                currentLevel = currentLevel - 1;
                this.isMaxLevel = false;
            } else if (currentLevel == 5 && this.isMaxLevel == true) {
                currentLevel = 5;
            } else  {
                currentLevel = 4;
                this.isMaxLevel = true;
            }
            return currentLevel;
        }
    }
}
