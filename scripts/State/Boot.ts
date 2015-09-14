/// <reference path="../../vendor/phaser-official/typescript/phaser.d.ts"/>

module MatchingPairs.State {
    export class Boot extends Phaser.State {
        preload() {
            this.load.image('preload-bar', 'assets/images/preload-bar.png');
        }
        create() {
            //this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.stage.backgroundColor = 0xFFFFFF;
            this.game.time.advancedTiming = true;

            this.game.state.start('preload');
        }
    }
}