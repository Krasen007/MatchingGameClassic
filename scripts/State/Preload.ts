/**
 * Created by Krasen Ivanov.
 */

/// <reference path="../../vendor/phaser-official/typescript/phaser.d.ts"/>

module MatchingPairs.State {
    export class Preload extends Phaser.State {
        private preloadBar: Phaser.Sprite;
        preload() {
            this.preloadBar = this.add.sprite(0, 148, 'preload-bar');
            this.load.setPreloadSprite(this.preloadBar);
            this.load.image('menu-background', 'assets/images/menu-background.png');
            this.load.atlasXML('cardfaces', 'assets/images/cardfacesss.png', 'assets/images/cardfacesss.xml');
            this.load.spritesheet('star', 'assets/images/star.png', 48, 48, 4);
            this.load.audio('tileOpenFX', ['assets/sound/cardClick.wav']);
            this.load.audio('loadingFX', ['assets/sound/cardsShuffle.wav']);
            this.load.audio('tileDestroyFX', ['assets/sound/cardDestroy.wav']);
        }
        create() {
            this.game.state.start('menu');
        }
    }
}