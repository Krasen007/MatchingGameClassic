/**
 * Created by krasen on 15-8-12.
 */

/// <reference path="../../vendor/phaser-official/typescript/phaser.d.ts"/>
/// <reference path="../State/Main.ts"/>

module MatchingPairs.State {
    enum TileState {
        CLOSED,
        OPEN
    }

    export class Tile extends Phaser.Group {
        public get uniqueId(): string {
            return this.row + "x" + this.col;
        }
        public get tileFaceId(): string {
            return this._id;
        }
        private face: Phaser.Sprite;
        private _id: string;
        private row: number;
        private col: number;
        private currentState: TileState;
        public tileClickSignal: Phaser.Signal;
        public tileDestroySignal: Phaser.Signal;

        private flipTween: Phaser.Tween;
        public isAnimating: boolean = false; //TODO fix

        private emitter: Phaser.Particles.Arcade.Emitter;
        private tileOpenFX: Phaser.Sound;
        private tileDestroyFX: Phaser.Sound;

        constructor(game: Phaser.Game, idto: string, r: number, c: number) {
            super(game);
            this._id = idto;
            this.row = r;
            this.col = c;
            this.currentState = TileState.CLOSED;

            this.face = new Phaser.Sprite(this.game, 0, 0, "cardfaces", "closedCard");
            this.face.anchor.set(0.5, 0.5);
            this.add(this.face);

            this.face.inputEnabled = true;
            this.face.events.onInputDown.add(this.onFaceClicked, this);

            this.face.events.onInputOver.add(this.onMouseOver, this);
            this.face.events.onInputOut.add(this.onMouseOut, this);
            this.tileClickSignal = new Phaser.Signal();
            this.tileDestroySignal = new Phaser.Signal();

            this.emitter = this.game.add.emitter();
            this.emitter.makeParticles("star", [0, 1, 2, 3]);
            this.emitter.particleBringToTop = true;
            this.emitter.setScale(0.6, 0.4, 0.6, 0.4, 200);
            this.emitter.setAlpha(1, 0, 200);

            this.tileOpenFX = this.game.add.audio("tileOpenFX");
            this.tileDestroyFX = this.game.add.audio("tileDestroyFX");
            //this.tileOpenFX.fadeOut(300);

            this.emitter.setXSpeed(-20, -30);
            this.emitter.setYSpeed(-20, -30);

            //this.emitter.gravity = 300;
        }

        public particlesOpen() {
            this.emitter.x = this.x - this.width / 2;
            this.emitter.y = this.y - this.height / 2;

            var tweenEmitter1: Phaser.Tween = this.game.add.tween(this.emitter).to({ x: this.x + this.width / 2 }, 75, Phaser.Easing.Linear.None);
            var tweenEmitter2: Phaser.Tween = this.game.add.tween(this.emitter).to({ x: this.x + this.width / 2, y: this.y + this.height / 2 }, 75, Phaser.Easing.Linear.None);
            var tweenEmitter3: Phaser.Tween = this.game.add.tween(this.emitter).to({ x: this.x - this.width / 2, y: this.y + this.height / 2 }, 75, Phaser.Easing.Linear.None);
            var tweenEmitter4: Phaser.Tween = this.game.add.tween(this.emitter).to({ x: this.x - this.width / 2, y: this.y - this.height / 2 }, 75, Phaser.Easing.Linear.None);

            tweenEmitter1.chain(tweenEmitter2);
            tweenEmitter2.chain(tweenEmitter3);
            tweenEmitter3.chain(tweenEmitter4);
            //tweenEmitter4.chain(tweenEmitter1);

            tweenEmitter1.start();
            //this.emitter.start(false, 10000, 1, 19, true); // 20
            //this.emitter.start(false, -1, 100, 1);
            this.emitter.flow(200, -1, 1);
            this.particleStopper(0.450);
            //console.log(this.emitter);
        }

        public particlesClose() {
            this.emitter.x = this.x - this.width / 2;
            this.emitter.y = this.y - this.height / 2;

            var tweenEmitter1: Phaser.Tween = this.game.add.tween(this.emitter).to({ y: this.y + this.height / 2 }, 75, Phaser.Easing.Linear.None);
            var tweenEmitter2: Phaser.Tween = this.game.add.tween(this.emitter).to({ x: this.x + this.width / 2 }, 75, Phaser.Easing.Linear.None);
            var tweenEmitter3: Phaser.Tween = this.game.add.tween(this.emitter).to({ y: this.y - this.height / 2 }, 75, Phaser.Easing.Linear.None);
            var tweenEmitter4: Phaser.Tween = this.game.add.tween(this.emitter).to({ x: this.x - this.width / 2 }, 75, Phaser.Easing.Linear.None);

            tweenEmitter1.chain(tweenEmitter2);
            tweenEmitter2.chain(tweenEmitter3);
            tweenEmitter3.chain(tweenEmitter4);

            tweenEmitter1.start();
            this.emitter.flow(200, -1, 1);
            this.particleStopper(0.450);
            //console.log(this.emitter);
        }

        private particlesDestroy() {
            this.emitter.x = this.x - this.width / 2;
            this.emitter.y = this.y - this.height / 2;

            var tweenEmitter1: Phaser.Tween = this.game.add.tween(this.emitter).to({ x: this.x + this.width / 2, y: this.y + this.height / 2 }, 270, Phaser.Easing.Linear.None, false, 0, 0, true);

            tweenEmitter1.start();
            this.emitter.flow(200, -1, 1);
            this.particleStopper(0.450);
            //console.log(this.emitter);
        }

        private onMouseOver(): void {
            this.face.tint = 0xCCFFCC;
            //this.tweenAnim = this.game.add.tween(this.face)
            //    .to({x:1},100,Phaser.Easing.Bounce.InOut,true,0,0,true);
        }
        private onMouseOut(): void {
            this.face.tint = 0xffffff;
        }
        private onFaceClicked(): void {
            if (this.isAnimating == false) {
                this.tileClickSignal.dispatch(this.uniqueId);
            } else {
                console.log("Its animating something...");
            }
        }

        // Main.ts Destroy click methods
        public closeTileAndDestroy(): void {
            this.isAnimating = true;
            //if (this.currentState == TileState.CLOSED) {
            //    this.continueTileFlipAndDestroy();
            //} else {
            this.flipTween = this.game.add.tween(this.face.scale).to({ x: 0 }, 300, Phaser.Easing.Quartic.In);
            this.flipTween.onComplete.add(this.onCompleteTileFlip1, this);
            this.flipTween.start();
            // }
        }
        private onCompleteTileFlip1(): void {
            if (this.currentState == TileState.OPEN) {
                this.face.frameName = "closedCard";
            }
            else {
                this.face.frameName = this._id;
            }
            this.continueTileFlipAndDestroy();
            this.tileDestroySignal.dispatch();
        }
        public continueTileFlipAndDestroy(): void {
            this.isAnimating = true;
            this.flipTween = this.game.add.tween(this.face.scale).to({ x: 1 }, 300, Phaser.Easing.Quartic.Out);
            this.flipTween.onComplete.add(this.onCompleteTileFlip2, this);
            this.flipTween.start();
        }
        private onCompleteTileFlip2(): void {
            if (this.currentState == TileState.OPEN) {
                this.currentState = TileState.CLOSED;
            } else {
                this.currentState = TileState.OPEN;
            }
            //console.log("onCompleteFlip2!");
            this.tileDestroy();
            this.isAnimating = false;
        }

        // Tile.ts click methods
        public startFlip(): void {
            this.tileOpenFX.play();

            //this.particleFX();

            //if ((this.currentState == 0) && (this.isAnimating == false)) {
            this.isAnimating = true;
            this.flipTween = this.game.add.tween(this.face.scale).to({ x: 0 }, 300, Phaser.Easing.Quartic.In);
            this.flipTween.onComplete.add(this.onCompleteFlip1, this);
            this.flipTween.start();
            //console.log(this.currentState, "state closed");
            //}
        }
        private onCompleteFlip1(): void {
            if (this.currentState == TileState.OPEN) {
                this.face.frameName = "closedCard";
            }
            else {
                this.face.frameName = this._id;
            }
            this.continueFlip();
        }
        private continueFlip(): void {
            this.flipTween = this.game.add.tween(this.face.scale).to({ x: 1 }, 300, Phaser.Easing.Quartic.Out);
            this.flipTween.onComplete.add(this.onCompleteFlip2, this);
            this.flipTween.start();
        }
        private onCompleteFlip2(): void {
            if (this.currentState == TileState.OPEN) {
                this.currentState = TileState.CLOSED;
            } else {
                this.currentState = TileState.OPEN;
            }
            //this.particleStopper(0.5);
            this.isAnimating = false;
            //console.log(this.currentState, "state open");
        }

        private particleStopper(stopInSeconds: number): void {
            var particleStopperTimer = this.game.time.create(true);
            particleStopperTimer.add(stopInSeconds * Phaser.Timer.SECOND, this.particleKill, this);
            particleStopperTimer.start();
        }
        private particleKill() {
            this.emitter.kill();
        }

        public destroy() {
            super.destroy();
            ////TODO fix tween animation for opening and closing
            //if (this.flipTween != null){
            //    //this.flipTween.delay(3000);
            //    //this.flipTween.onComplete.dispose();
            //    this.flipTween.stop();
            //}
            //var tileFlipTween:Phaser.Tween;
            //tileFlipTween = this.game.add.tween(this.face.scale).to({x: 0, y: 0}, 300, Phaser.Easing.Quartic.In);
            //tileFlipTween.onComplete.add(this.face.destroy,this);
            //tileFlipTween.start();
            ////this.face = new Phaser.Sprite(this.game, 0, 0, "cardfaces", "closedCard");
        }

        public tileDestroy() {
            if (!this.tileDestroyFX.isPlaying) {
                this.tileDestroyFX.play();
            }
            this.particlesDestroy();
            this.flipTween = this.game.add.tween(this.face.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Quartic.In);
            this.flipTween.onComplete.add(this.face.destroy, this);
            this.flipTween.start();
            //this.face = new Phaser.Sprite(this.game, 0, 0, "cardfaces", "closedCard");
        }
    }
}