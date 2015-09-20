/**
 * Created by Krasen Ivanov.
 */

/// <reference path="../../vendor/phaser-official/typescript/phaser.d.ts"/>

module MatchingPairs.State {
    export class Boot extends Phaser.State {
        preload() {
            this.load.image('preload-bar', 'assets/images/preload-bar.png');
        }
        create() {
            // this is the best I managed to make it work for smartphones
            this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

            this.game.stage.backgroundColor = 0xFFFFFF;

            // used for debug fps counter
            //this.game.time.advancedTiming = true;

            this.game.state.start('preload');
        }
    }
}