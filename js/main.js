/**
 * Created by Krasen Ivanov.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../vendor/phaser-official/typescript/phaser.d.ts"/>
var MatchingPairs;
(function (MatchingPairs) {
    var State;
    (function (State) {
        var Boot = (function (_super) {
            __extends(Boot, _super);
            function Boot() {
                _super.apply(this, arguments);
            }
            Boot.prototype.preload = function () {
                this.load.image('preload-bar', 'assets/images/preload-bar.png');
            };
            Boot.prototype.create = function () {
                // this is the best I managed to make it work for smartphones
                this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
                this.game.stage.backgroundColor = 0xFFFFFF;
                // used for debug fps counter
                //this.game.time.advancedTiming = true;
                this.game.state.start('preload');
            };
            return Boot;
        })(Phaser.State);
        State.Boot = Boot;
    })(State = MatchingPairs.State || (MatchingPairs.State = {}));
})(MatchingPairs || (MatchingPairs = {}));
/**
 * Created by Krasen Ivanov.
 */
/// <reference path="../../vendor/phaser-official/typescript/phaser.d.ts"/>
var MatchingPairs;
(function (MatchingPairs) {
    var State;
    (function (State) {
        var Preload = (function (_super) {
            __extends(Preload, _super);
            function Preload() {
                _super.apply(this, arguments);
            }
            Preload.prototype.preload = function () {
                this.preloadBar = this.add.sprite(0, 148, 'preload-bar');
                this.load.setPreloadSprite(this.preloadBar);
                this.load.image('menu-background', 'assets/images/menu-background.png');
                this.load.atlasXML('cardfaces', 'assets/images/cardfacesss.png', 'assets/images/cardfacesss.xml');
                this.load.spritesheet('star', 'assets/images/star.png', 48, 48, 4);
                this.load.audio('tileOpenFX', ['assets/sound/cardClick.wav']);
                this.load.audio('loadingFX', ['assets/sound/cardsShuffle.wav']);
                this.load.audio('tileDestroyFX', ['assets/sound/cardDestroy.wav']);
            };
            Preload.prototype.create = function () {
                this.game.state.start('menu');
            };
            return Preload;
        })(Phaser.State);
        State.Preload = Preload;
    })(State = MatchingPairs.State || (MatchingPairs.State = {}));
})(MatchingPairs || (MatchingPairs = {}));
/**
 * Created by Krasen Ivanov on 15-8-12.
 */
/// <reference path="../../vendor/phaser-official/typescript/phaser.d.ts"/>
var MatchingPairs;
(function (MatchingPairs) {
    var Initialization = (function () {
        function Initialization() {
        }
        Initialization.LEVEL = 1;
        Initialization.REAL_CARD_SIZE = 81;
        Initialization.MOVES = 0;
        Initialization.cardCounter = 0;
        Initialization.userScore = 0;
        return Initialization;
    })();
    MatchingPairs.Initialization = Initialization;
})(MatchingPairs || (MatchingPairs = {}));
/**
 * Created by Krasen Ivanov on 15-8-12.
 */
var MatchingPairs;
(function (MatchingPairs) {
    var ReturnRandomCard = (function () {
        function ReturnRandomCard() {
        }
        ReturnRandomCard.drawCardString = function (count) {
            var FACES = "2,3,4,5,6,7,8,9,T,J,Q,K,A";
            var SUITS = "h,d,c,s";
            var cardFacesArray = FACES.split(',');
            var cardSuitsArray = SUITS.split(',');
            var idtas = [];
            for (var i = 0; i < cardFacesArray.length; i++) {
                for (var j = 0; j < cardSuitsArray.length; j++) {
                    idtas.push(cardFacesArray[i] + cardSuitsArray[j]);
                }
            }
            //console.log(idtas);
            var result = [];
            for (var i = 0; i < count; i++) {
                var randomIndex = Math.floor((Math.random() * idtas.length));
                //console.log(randomIndex); //array splice
                result.push(idtas.splice(randomIndex - 1, 1)[0]);
            }
            return result;
        };
        ReturnRandomCard.shuffleArray = function (array) {
            var counter = array.length;
            var temp;
            var index;
            while (counter > 0) {
                index = Math.floor(Math.random() * counter);
                counter--;
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        };
        return ReturnRandomCard;
    })();
    MatchingPairs.ReturnRandomCard = ReturnRandomCard;
})(MatchingPairs || (MatchingPairs = {}));
/**
 * Created by Krasen Ivanov on 15-8-12.
 */
/// <reference path="../../vendor/phaser-official/typescript/phaser.d.ts"/>
/// <reference path="../State/Main.ts"/>
var MatchingPairs;
(function (MatchingPairs) {
    var State;
    (function (State) {
        var TileState;
        (function (TileState) {
            TileState[TileState["CLOSED"] = 0] = "CLOSED";
            TileState[TileState["OPEN"] = 1] = "OPEN";
        })(TileState || (TileState = {}));
        var Tile = (function (_super) {
            __extends(Tile, _super);
            function Tile(game, idto, r, c) {
                _super.call(this, game);
                this.isAnimating = false; //TODO fix
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
                this.emitter.setXSpeed(-20, -30);
                this.emitter.setYSpeed(-20, -30);
            }
            Object.defineProperty(Tile.prototype, "uniqueId", {
                get: function () {
                    return this.row + "x" + this.col;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Tile.prototype, "tileFaceId", {
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Tile.prototype.particlesOpen = function () {
                this.emitter.x = this.x - this.width / 2;
                this.emitter.y = this.y - this.height / 2;
                var tweenEmitter1 = this.game.add.tween(this.emitter).to({ x: this.x + this.width / 2 }, 75, Phaser.Easing.Linear.None);
                var tweenEmitter2 = this.game.add.tween(this.emitter).to({ x: this.x + this.width / 2, y: this.y + this.height / 2 }, 75, Phaser.Easing.Linear.None);
                var tweenEmitter3 = this.game.add.tween(this.emitter).to({ x: this.x - this.width / 2, y: this.y + this.height / 2 }, 75, Phaser.Easing.Linear.None);
                var tweenEmitter4 = this.game.add.tween(this.emitter).to({ x: this.x - this.width / 2, y: this.y - this.height / 2 }, 75, Phaser.Easing.Linear.None);
                tweenEmitter1.chain(tweenEmitter2);
                tweenEmitter2.chain(tweenEmitter3);
                tweenEmitter3.chain(tweenEmitter4);
                tweenEmitter1.start();
                this.emitter.flow(200, -1, 1);
                this.particleStopper(0.450);
                //console.log(this.emitter);
            };
            Tile.prototype.particlesClose = function () {
                this.emitter.x = this.x - this.width / 2;
                this.emitter.y = this.y - this.height / 2;
                var tweenEmitter1 = this.game.add.tween(this.emitter).to({ y: this.y + this.height / 2 }, 75, Phaser.Easing.Linear.None);
                var tweenEmitter2 = this.game.add.tween(this.emitter).to({ x: this.x + this.width / 2 }, 75, Phaser.Easing.Linear.None);
                var tweenEmitter3 = this.game.add.tween(this.emitter).to({ y: this.y - this.height / 2 }, 75, Phaser.Easing.Linear.None);
                var tweenEmitter4 = this.game.add.tween(this.emitter).to({ x: this.x - this.width / 2 }, 75, Phaser.Easing.Linear.None);
                tweenEmitter1.chain(tweenEmitter2);
                tweenEmitter2.chain(tweenEmitter3);
                tweenEmitter3.chain(tweenEmitter4);
                tweenEmitter1.start();
                this.emitter.flow(200, -1, 1);
                this.particleStopper(0.450);
                //console.log(this.emitter);
            };
            Tile.prototype.particlesDestroy = function () {
                this.emitter.x = this.x - this.width / 2;
                this.emitter.y = this.y - this.height / 2;
                var tweenEmitter1 = this.game.add.tween(this.emitter).to({ x: this.x + this.width / 2, y: this.y + this.height / 2 }, 270, Phaser.Easing.Linear.None, false, 0, 0, true);
                tweenEmitter1.start();
                this.emitter.flow(200, -1, 1);
                this.particleStopper(0.450);
                //console.log(this.emitter);
            };
            Tile.prototype.onMouseOver = function () {
                this.face.tint = 0xCCFFCC;
            };
            Tile.prototype.onMouseOut = function () {
                this.face.tint = 0xffffff;
            };
            Tile.prototype.onFaceClicked = function () {
                if (this.isAnimating == false) {
                    this.tileClickSignal.dispatch(this.uniqueId);
                }
                else {
                }
            };
            // Main.ts Destroy click methods
            Tile.prototype.closeTileAndDestroy = function () {
                this.isAnimating = true;
                //this.flipTween = this.game.add.tween(this.face.scale).to({ x: 0 }, 300, Phaser.Easing.Quartic.In);
                //this.flipTween.onComplete.add(this.onCompleteTileFlip1, this);
                //this.flipTween.start();
                this.onCompleteTileFlip1();
            };
            Tile.prototype.onCompleteTileFlip1 = function () {
                //if (this.currentState == TileState.OPEN) {
                //    this.face.frameName = "closedCard";
                //}
                //else {
                this.face.frameName = this._id;
                //}
                this.continueTileFlipAndDestroy();
                this.tileDestroySignal.dispatch();
            };
            Tile.prototype.continueTileFlipAndDestroy = function () {
                this.isAnimating = true;
                //this.flipTween = this.game.add.tween(this.face.scale).to({ x: 1 }, 300, Phaser.Easing.Quartic.Out);
                //this.flipTween.onComplete.add(this.onCompleteTileFlip2, this);
                //this.flipTween.start();
                this.onCompleteTileFlip2();
            };
            Tile.prototype.onCompleteTileFlip2 = function () {
                if (this.currentState == TileState.OPEN) {
                    this.currentState = TileState.CLOSED;
                }
                else {
                    this.currentState = TileState.OPEN;
                }
                //console.log("onCompleteFlip2!");
                this.tileDestroy();
                this.isAnimating = false;
            };
            // Tile.ts click methods
            Tile.prototype.startFlip = function () {
                if (!this.tileOpenFX.isPlaying) {
                    this.tileOpenFX.play();
                }
                this.isAnimating = true;
                //this.flipTween = this.game.add.tween(this.face.scale).to({ x: 0 }, 300, Phaser.Easing.Quartic.In);
                //this.flipTween.onComplete.add(this.onCompleteFlip1, this);
                //this.flipTween.start();
                this.onCompleteFlip1();
            };
            Tile.prototype.onCompleteFlip1 = function () {
                if (this.currentState == TileState.OPEN) {
                    this.face.frameName = "closedCard";
                }
                else {
                    this.face.frameName = this._id;
                }
                this.continueFlip();
            };
            Tile.prototype.continueFlip = function () {
                //this.flipTween = this.game.add.tween(this.face.scale).to({ x: 1 }, 300, Phaser.Easing.Quartic.Out);
                //this.flipTween.onComplete.add(this.onCompleteFlip2, this);
                //this.flipTween.start();
                this.onCompleteFlip2();
            };
            Tile.prototype.onCompleteFlip2 = function () {
                if (this.currentState == TileState.OPEN) {
                    this.currentState = TileState.CLOSED;
                }
                else {
                    this.currentState = TileState.OPEN;
                }
                this.isAnimating = false;
            };
            Tile.prototype.particleStopper = function (stopInSeconds) {
                var particleStopperTimer = this.game.time.create(true);
                particleStopperTimer.add(stopInSeconds * Phaser.Timer.SECOND, this.particleKill, this);
                particleStopperTimer.start();
            };
            Tile.prototype.particleKill = function () {
                this.emitter.kill();
            };
            Tile.prototype.tileDestroy = function () {
                if (!this.tileDestroyFX.isPlaying) {
                    this.tileDestroyFX.play();
                }
                this.particlesDestroy();
                this.flipTween = this.game.add.tween(this.face.scale).to({ x: 0, y: 0 }, 300, Phaser.Easing.Quartic.In);
                this.flipTween.onComplete.add(this.face.destroy, this);
                this.flipTween.start();
            };
            return Tile;
        })(Phaser.Group);
        State.Tile = Tile;
    })(State = MatchingPairs.State || (MatchingPairs.State = {}));
})(MatchingPairs || (MatchingPairs = {}));
/*
 *
 * Created by Krasen Ivanov 2015
 * Thanks to Ivailo Dimitrov for the project guidance.
 *
 *
*/
/// <reference path="../../vendor/phaser-official/typescript/phaser.d.ts"/>
/// <reference path="../Classes/ReturnRandomCard.ts"/>
/// <reference path="../Classes/Initialization.ts"/>
/// <reference path="../Classes/Tile.ts"/>
var MatchingPairs;
(function (MatchingPairs) {
    var State;
    (function (State) {
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main() {
                _super.apply(this, arguments);
                this.style = { font: "15px Arial", fill: "#ff0011", align: "center" };
                this.MINUS_SCORE = 10;
                this.MATCH_SCORE = 100;
                this.countDownTimer = 0;
                this.firstClickedTile = null;
                this.secondClickedTile = null;
            }
            Main.prototype.create = function () {
                this.stage.backgroundColor = 0xCCFF66;
                this.loadingSounds = this.game.add.audio("loadingFX");
                Main.firstTileOpen = false;
                Main.secondTileOpen = false;
                this.tileGraphics = [];
                this.drawBoard();
                this.drawText();
            };
            Main.prototype.drawText = function () {
                this.scoreTxt = this.game.add.text(10, 1, "Score: " + MatchingPairs.Initialization.userScore, this.style); // 50, 1 , this.game.world.width
                this.movesTxt = this.game.add.text((this.game.world.width - 60) / 2, 1, "Moves: " + MatchingPairs.Initialization.MOVES, this.style); //215
                this.levelTxt = this.game.add.text(this.game.world.width - 80, 1, "Level: " + MatchingPairs.Initialization.LEVEL, this.style); // 355
                this.cardsTxt = this.game.add.text(10, this.game.world.height - 20, "Cards: " + MatchingPairs.Initialization.cardCounter, this.style);
                this.ctDwnTxt = this.game.add.text((this.game.world.width - 120) / 2, this.game.world.height - 20, "Countdown: waiting", this.style); //195
                this.timerTxt = this.game.add.text(this.game.world.width - 120, this.game.world.height - 20, "Total time: ", this.style); // x, 480
            };
            Main.prototype.drawBoard = function () {
                var LEVEL_SCALING = MatchingPairs.Initialization.LEVEL * (MatchingPairs.Initialization.LEVEL * 2);
                var tiles = MatchingPairs.ReturnRandomCard.drawCardString(LEVEL_SCALING);
                var tilesLength = tiles.length;
                for (var i = 0; i < tilesLength; i++) {
                    tiles.push(tiles[i]);
                }
                MatchingPairs.ReturnRandomCard.shuffleArray(tiles);
                var gridSize = Math.sqrt(tiles.length);
                switch (MatchingPairs.Initialization.LEVEL) {
                    case 1:
                    case 2:
                        var levelTileScaling = 1;
                        break;
                    case 3:
                        var levelTileScaling = 0.120 * (10 - MatchingPairs.Initialization.LEVEL);
                        break;
                    case 4:
                    case 5:
                        var levelTileScaling = 0.111 * (10 - MatchingPairs.Initialization.LEVEL);
                        break;
                }
                var leveledAndScaledTile = ((((MatchingPairs.Initialization.REAL_CARD_SIZE / 2) * MatchingPairs.Initialization.LEVEL) * levelTileScaling));
                for (var i = 0; i < tiles.length; i++) {
                    var row = Math.floor(i / gridSize);
                    var col = i % gridSize;
                    var gameTile = new State.Tile(this.game, tiles[i], row, col);
                    gameTile.scale.set(levelTileScaling);
                    gameTile.x = (this.game.world.centerX + (col * (levelTileScaling * MatchingPairs.Initialization.REAL_CARD_SIZE))
                        - (leveledAndScaledTile + ((leveledAndScaledTile / MatchingPairs.Initialization.LEVEL) * (MatchingPairs.Initialization.LEVEL - 1))));
                    gameTile.y = (this.game.world.centerY + (row * (levelTileScaling * MatchingPairs.Initialization.REAL_CARD_SIZE))
                        - (leveledAndScaledTile + ((leveledAndScaledTile / MatchingPairs.Initialization.LEVEL) * (MatchingPairs.Initialization.LEVEL - 1))));
                    gameTile.tileClickSignal.add(this.onTileClicked, this);
                    gameTile.tileDestroySignal.add(this.destroyAtTheSameTime, this);
                    //console.log(row, col, gameTile.uniqueId, gameTile.tileFaceId);
                    this.tileGraphics.push(gameTile);
                    MatchingPairs.Initialization.cardCounter++;
                }
            };
            Main.findById = function (tileArray, id) {
                for (var i = 0; i < tileArray.length; i++) {
                    if (tileArray[i].uniqueId === id) {
                        return tileArray[i];
                    }
                    else if (tileArray[i].tileFaceId === id) {
                        return tileArray[i];
                    }
                }
            };
            Main.prototype.onTileClicked = function (unId) {
                var currentTile = Main.findById(this.tileGraphics, unId);
                if (this.firstClickedTile == null) {
                    this.firstClickedTile = currentTile;
                    this.firstClickedTile.startFlip();
                    this.firstClickedTile.particlesOpen();
                    Main.firstTileOpen = true;
                    //console.log("First clicked card ", this.firstClickedTile.uniqueId, this.firstClickedTile.tileFaceId);
                    MatchingPairs.Initialization.MOVES++;
                    this.startCountdown(5);
                }
                else {
                    if (this.firstClickedTile.uniqueId == currentTile.uniqueId) {
                        if (this.secondClickedTile != null) {
                            //console.log("Keeping it First and closing the other tile! ");
                            try {
                                this.secondClickedTile.startFlip();
                                this.secondClickedTile.particlesClose();
                            }
                            catch (error) {
                                console.log(error.name, error.message);
                            }
                            this.secondClickedTile = null;
                            this.firstClickedTile = null;
                            this.firstClickedTile = currentTile;
                            Main.firstTileOpen = true;
                            Main.secondTileOpen = false;
                            this.startCountdown(5);
                        }
                        else {
                            //console.log("Same tile clicked! Closing. ");
                            try {
                                this.firstClickedTile.startFlip();
                                this.firstClickedTile.particlesClose();
                            }
                            catch (error) {
                                console.log(error.name, error.message);
                            }
                            this.firstClickedTile = null;
                            Main.firstTileOpen = false;
                            this.tileCountDownTimer.stop();
                            this.ctDwnTxt.setText("Countdown: --");
                        }
                    }
                    else {
                        if (this.secondClickedTile == null) {
                            this.secondClickedTile = currentTile;
                            try {
                                this.secondClickedTile.startFlip();
                                this.secondClickedTile.particlesOpen();
                            }
                            catch (error) {
                                console.log(error.name, error.message);
                            }
                            Main.secondTileOpen = true;
                            //console.log("Second clicked card ", this.secondClickedTile.uniqueId, this.secondClickedTile.tileFaceId);
                            MatchingPairs.Initialization.MOVES++;
                            if ((this.firstClickedTile.tileFaceId == this.secondClickedTile.tileFaceId) && (this.firstClickedTile.uniqueId != this.secondClickedTile.uniqueId)) {
                                this.destroyTiles();
                            }
                            else {
                                MatchingPairs.Initialization.userScore -= this.MINUS_SCORE;
                                if (this.countDownTimer <= 2) {
                                    this.startCountdown(2);
                                }
                            }
                        }
                        else {
                            if ((currentTile.uniqueId != this.firstClickedTile.uniqueId) && (currentTile.uniqueId != this.secondClickedTile.uniqueId)) {
                                //other clicked
                                //console.log("Other card!, making it First!", this.firstClickedTile.uniqueId, this.firstClickedTile.tileFaceId);
                                try {
                                    this.firstClickedTile.startFlip();
                                    this.firstClickedTile.particlesClose();
                                }
                                catch (error) {
                                    console.log(error.name, error.message);
                                }
                                try {
                                    this.secondClickedTile.startFlip(); //TODO FIX or maybe is ok
                                    this.secondClickedTile.particlesClose();
                                }
                                catch (error) {
                                    console.log(error.name, error.message);
                                }
                                this.secondClickedTile = null;
                                this.firstClickedTile = null;
                                this.firstClickedTile = currentTile;
                                try {
                                    this.firstClickedTile.startFlip();
                                    this.firstClickedTile.particlesOpen();
                                }
                                catch (error) {
                                    console.log(error.name, error.message);
                                }
                                MatchingPairs.Initialization.MOVES++;
                                Main.secondTileOpen = false;
                                Main.firstTileOpen = true;
                                this.startCountdown(5);
                            }
                            else {
                                //console.log("We are making the Second Tile - first and closing the other tile");
                                if (this.firstClickedTile != null) {
                                    try {
                                        this.firstClickedTile.startFlip();
                                        this.firstClickedTile.particlesClose();
                                    }
                                    catch (error) {
                                        console.log(error.name, error.message);
                                    }
                                    this.firstClickedTile = null;
                                    this.secondClickedTile = null;
                                    this.firstClickedTile = currentTile;
                                    Main.secondTileOpen = false;
                                    Main.firstTileOpen = true;
                                    this.startCountdown(5);
                                }
                                else {
                                }
                            }
                        }
                    }
                }
            };
            Main.prototype.destroyAtTheSameTime = function () {
                try {
                    this.firstClickedTile.continueTileFlipAndDestroy();
                }
                catch (error) {
                    console.log(error.name, error.message);
                }
                this.firstClickedTile = null;
            };
            Main.prototype.destroyTiles = function () {
                if ((this.firstClickedTile.tileFaceId == this.secondClickedTile.tileFaceId) && (this.firstClickedTile.uniqueId != this.secondClickedTile.uniqueId)) {
                    if (MatchingPairs.Initialization.cardCounter == 2) {
                        MatchingPairs.Initialization.cardCounter -= 2;
                        MatchingPairs.Initialization.userScore += this.MATCH_SCORE;
                        try {
                            // this also calls destroyAtTheSameTime() and destroys the first tile which was already open.
                            this.secondClickedTile.closeTileAndDestroy();
                        }
                        catch (error) {
                            console.log(error.name, error.message);
                        }
                        this.secondClickedTile = null;
                        Main.firstTileOpen = false;
                        Main.secondTileOpen = false;
                        //console.log("you matched the last cards!");
                        this.levelCompleteCountdown(1);
                    }
                    else {
                        MatchingPairs.Initialization.cardCounter -= 2;
                        MatchingPairs.Initialization.userScore += this.MATCH_SCORE;
                        //try {
                        //    this.firstClickedTile.continueTileFlipAndDestroy();
                        //} catch (error) {
                        //    console.log(error.name, error.message);
                        //}
                        // this also calls destroyAtTheSameTime() and destroys the first tile which was already open, above is the old code.
                        try {
                            this.secondClickedTile.closeTileAndDestroy();
                        }
                        catch (error) {
                            console.log(error.name, error.message);
                        }
                        this.secondClickedTile = null;
                        Main.firstTileOpen = false;
                        Main.secondTileOpen = false;
                    }
                }
                else {
                }
                this.tileCountDownTimer.stop(true);
                this.ctDwnTxt.setText("Countdown: --");
            };
            Main.prototype.levelCompleteCountdown = function (completeLevelInSeconds) {
                var tileCountDownTimer = this.game.time.create(true);
                tileCountDownTimer.add(completeLevelInSeconds * Phaser.Timer.SECOND, this.levelComplete, this);
                tileCountDownTimer.start();
            };
            Main.prototype.startCountdown = function (timeCtdw) {
                if ((this.tileCountDownTimer != undefined) && (this.tileCountDownTimer.running)) {
                    this.tileCountDownTimer.stop(true);
                }
                this.countDownTimer = timeCtdw;
                this.tileCountDownTimer = this.game.time.create(true);
                this.tileCountDownTimer.repeat(Phaser.Timer.SECOND, timeCtdw + 1, this.updateCountdown, this);
                this.tileCountDownTimer.start();
            };
            Main.prototype.updateCountdown = function () {
                if (this.countDownTimer <= 0) {
                    //console.log("its time to stop...");
                    this.ctDwnTxt.setText("Countdown: --");
                    if (this.firstClickedTile != null) {
                        try {
                            this.firstClickedTile.startFlip();
                            this.firstClickedTile = null;
                            Main.firstTileOpen = false;
                        }
                        catch (error) {
                            console.log(error.name, error.message);
                        }
                    }
                    if (this.secondClickedTile != null) {
                        try {
                            this.secondClickedTile.startFlip();
                            this.secondClickedTile = null;
                            Main.secondTileOpen = false;
                        }
                        catch (error) {
                            console.log(error.name, error.message);
                        }
                    }
                }
                else {
                    this.ctDwnTxt.setText("Countdown: " + this.countDownTimer);
                    //console.log("the time is -= 1 ...", this.countDownTimer);
                    this.countDownTimer -= 1;
                }
            };
            Main.prototype.update = function () {
                this.updateTimer();
                this.scoreTxt.setText("Score: " + MatchingPairs.Initialization.userScore);
                this.movesTxt.setText("Moves: " + MatchingPairs.Initialization.MOVES);
                this.cardsTxt.setText("Cards: " + MatchingPairs.Initialization.cardCounter);
                //hack
                //if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                //    this.firstClickedTile = null;
                //    this.secondClickedTile = null;
                //    this.levelComplete();
                //}
            };
            //render(): void {
            //    this.game.debug.text(this.game.time.fps + ' fps', 129, 14);
            //    this.game.debug.text("first click " + this.firstClickedTile + " Second clicked " + this.secondClickedTile, 0, 450);
            //    this.game.debug.text("first tile open " + Main.firstTileOpen + " second tile open " + Main.secondTileOpen, 0, 460);
            //}
            Main.prototype.updateTimer = function () {
                var minutes = Math.floor(this.game.time.now / Phaser.Timer.MINUTE) % 60;
                var seconds = Math.floor(this.game.time.now / Phaser.Timer.SECOND) % 60;
                this.timerTxt.setText("Total time: " + minutes + ':' + seconds);
                Main.gameTime = (minutes + ':' + seconds);
            };
            Main.timeHelper = function () {
                return this.gameTime;
            };
            Main.prototype.levelComplete = function () {
                //console.log("LEVEL COMPLETE");
                this.game.stage.backgroundColor = 0xCCFFCC;
                MatchingPairs.Initialization.cardCounter = 0;
                if (!this.loadingSounds.isPlaying) {
                    this.loadingSounds.play();
                }
                if (MatchingPairs.Initialization.LEVEL == 5) {
                    this.game.state.start("menu");
                }
                else {
                    MatchingPairs.Initialization.LEVEL += 1;
                    this.game.state.start("menu");
                }
            };
            return Main;
        })(Phaser.State);
        State.Main = Main;
    })(State = MatchingPairs.State || (MatchingPairs.State = {}));
})(MatchingPairs || (MatchingPairs = {}));
/**
 * Created by Krasen Ivanov.
 */
/// <reference path="../../vendor/phaser-official/typescript/phaser.d.ts"/>
/// <reference path="../Classes/Initialization.ts"/>
/// <reference path="Main.ts"/>
var MatchingPairs;
(function (MatchingPairs) {
    var State;
    (function (State) {
        var Menu = (function (_super) {
            __extends(Menu, _super);
            function Menu() {
                _super.apply(this, arguments);
                this.style = { font: "15px Arial", fill: "#ff0011", align: "center" };
                this.isMaxLevel = false;
            }
            Menu.prototype.create = function () {
                this.startOrContinueGame();
            };
            Menu.prototype.startOrContinueGame = function () {
                var _this = this;
                if (MatchingPairs.Initialization.LEVEL == 1) {
                    this.game.state.start("main");
                }
                else {
                    this.isWinCondition();
                    MatchingPairs.Initialization.MOVES = 0;
                    this.input.onDown.addOnce(function () {
                        _this.game.state.start("main");
                    });
                }
            };
            Menu.prototype.isWinCondition = function () {
                this.winText = this.game.add.text(this.game.width * 0.5, this.game.height * 0.5, "CONGRATULATIONS! \n " +
                    "You completed level " + this.getLevelHelper() + " with " + MatchingPairs.Initialization.MOVES + " moves. \nAnd total played time of: " + State.Main.timeHelper() +
                    " \n Click to continue...", this.style);
                this.winText.anchor.set(0.5, 0.5);
            };
            Menu.prototype.getLevelHelper = function () {
                var currentLevel = MatchingPairs.Initialization.LEVEL;
                if (currentLevel != 5) {
                    currentLevel = currentLevel - 1;
                    this.isMaxLevel = false;
                }
                else if (currentLevel == 5 && this.isMaxLevel == true) {
                    currentLevel = 5;
                }
                else {
                    currentLevel = 4;
                    this.isMaxLevel = true;
                }
                //console.log(currentLevel);
                return currentLevel;
            };
            return Menu;
        })(Phaser.State);
        State.Menu = Menu;
    })(State = MatchingPairs.State || (MatchingPairs.State = {}));
})(MatchingPairs || (MatchingPairs = {}));
/**
 * Created by Krasen Ivanov.
 */
/// <reference path="../vendor/phaser-official/typescript/phaser.d.ts"/>
/// <reference path='State/Boot.ts'/>
/// <reference path='State/Preload.ts'/>
/// <reference path='State/Menu.ts'/>
/// <reference path='State/Main.ts'/>
var MatchingPairs;
(function (MatchingPairs) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 500, 500, Phaser.AUTO, 'game-div');
            this.state.add('boot', MatchingPairs.State.Boot);
            this.state.add('preload', MatchingPairs.State.Preload);
            this.state.add('menu', MatchingPairs.State.Menu);
            this.state.add('main', MatchingPairs.State.Main);
            this.state.start('boot');
        }
        return Game;
    })(Phaser.Game);
    MatchingPairs.Game = Game;
})(MatchingPairs || (MatchingPairs = {}));
window.onload = function () {
    new MatchingPairs.Game();
};
//# sourceMappingURL=main.js.map