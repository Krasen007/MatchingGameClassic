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

module MatchingPairs.State {
    export class Main extends Phaser.State {
        private style = { font: "15px Arial", fill: "#ff0011", align: "center" };

        private movesTxt: Phaser.Text;
        private timerTxt: Phaser.Text;
        private cardsTxt: Phaser.Text;
        private levelTxt: Phaser.Text;

        private scoreTxt: Phaser.Text;
        private MINUS_SCORE: number = 10;
        private MATCH_SCORE: number = 100;

        private tileGraphics: Tile[];
        private static gameTime: string;

        private ctDwnTxt: Phaser.Text;
        private tileCountDownTimer: Phaser.Timer;
        private countDownTimer: number = 0;

        private firstClickedTile: Tile = null;
        private secondClickedTile: Tile = null;

        public static firstTileOpen: boolean;
        public static secondTileOpen: boolean;

        private loadingSounds: Phaser.Sound;

        create(): void {
            this.stage.backgroundColor = 0xCCFF66;

            this.loadingSounds = this.game.add.audio("loadingFX");

            Main.firstTileOpen = false;
            Main.secondTileOpen = false;
            this.tileGraphics = [];
            this.drawBoard();
            this.drawText();
        }

        private drawText(): void {
            this.scoreTxt = this.game.add.text(10, 1, "Score: " + Initialization.userScore, this.style); // 50, 1 , this.game.world.width
            this.movesTxt = this.game.add.text((this.game.world.width - 60) / 2, 1, "Moves: " + Initialization.MOVES, this.style); //215
            this.levelTxt = this.game.add.text(this.game.world.width - 80, 1, "Level: " + Initialization.LEVEL, this.style); // 355
            this.cardsTxt = this.game.add.text(10, this.game.world.height - 20, "Cards: " + Initialization.cardCounter, this.style);
            this.ctDwnTxt = this.game.add.text((this.game.world.width - 120) / 2, this.game.world.height - 20, "Countdown: waiting", this.style); //195
            this.timerTxt = this.game.add.text(this.game.world.width - 120, this.game.world.height - 20, "Total time: ", this.style); // x, 480
        }
        private drawBoard(): void {
            var LEVEL_SCALING: number = Initialization.LEVEL * (Initialization.LEVEL * 2);
            var tiles: string[] = ReturnRandomCard.drawCardString(LEVEL_SCALING);
            var tilesLength: number = tiles.length;
            for (var i: number = 0; i < tilesLength; i++) {
                tiles.push(tiles[i]);
            }
            ReturnRandomCard.shuffleArray(tiles);

            var gridSize: number = Math.sqrt(tiles.length);
            switch (Initialization.LEVEL) {
                case 1:
                case 2:
                    var levelTileScaling: number = 1;
                    break;
                case 3:
                    var levelTileScaling: number = 0.120 * (10 - Initialization.LEVEL);
                    break;
                case 4:
                case 5:
                    var levelTileScaling: number = 0.111 * (10 - Initialization.LEVEL);
                    break;
            }
            var leveledAndScaledTile: number = ((((Initialization.REAL_CARD_SIZE / 2) * Initialization.LEVEL) * levelTileScaling));

            for (var i: number = 0; i < tiles.length; i++) {
                var row: number = Math.floor(i / gridSize);
                var col: number = i % gridSize;
                var gameTile: Tile = new Tile(this.game, tiles[i], row, col);
                gameTile.scale.set(levelTileScaling);
                gameTile.x = (this.game.world.centerX + (col * (levelTileScaling * Initialization.REAL_CARD_SIZE))
                    - (leveledAndScaledTile + ((leveledAndScaledTile / Initialization.LEVEL) * (Initialization.LEVEL - 1))));
                gameTile.y = (this.game.world.centerY + (row * (levelTileScaling * Initialization.REAL_CARD_SIZE))
                    - (leveledAndScaledTile + ((leveledAndScaledTile / Initialization.LEVEL) * (Initialization.LEVEL - 1))));

                gameTile.tileClickSignal.add(this.onTileClicked, this);
                gameTile.tileDestroySignal.add(this.destroyAtTheSameTime, this);
                //console.log(row, col, gameTile.uniqueId, gameTile.tileFaceId);
                this.tileGraphics.push(gameTile);
                Initialization.cardCounter++;
            }
        }

        private static findById(tileArray: Tile[], id: string): Tile {
            for (var i: number = 0; i < tileArray.length; i++) {
                if (tileArray[i].uniqueId === id) {
                    return tileArray[i];
                } else if (tileArray[i].tileFaceId === id) {
                    return tileArray[i];
                }
            }
        }

        private onTileClicked(unId: string) {
            var currentTile: Tile = Main.findById(this.tileGraphics, unId);

            if (this.firstClickedTile == null) {
                this.firstClickedTile = currentTile;
                this.firstClickedTile.startFlip();
                this.firstClickedTile.particlesOpen();
                Main.firstTileOpen = true;
                //console.log("First clicked card ", this.firstClickedTile.uniqueId, this.firstClickedTile.tileFaceId);
                Initialization.MOVES++;
                this.startCountdown(5);
            } else {
                if (this.firstClickedTile.uniqueId == currentTile.uniqueId) {
                    if (this.secondClickedTile != null) {
                        //console.log("Keeping it First and closing the other tile! ");
                        try {
                            this.secondClickedTile.startFlip();
                            this.secondClickedTile.particlesClose();
                        } catch (error) {
                            console.log(error.name, error.message);
                        }
                        this.secondClickedTile = null;
                        this.firstClickedTile = null;
                        this.firstClickedTile = currentTile;
                        Main.firstTileOpen = true;
                        Main.secondTileOpen = false;
                        this.startCountdown(5);
                    } else {
                        //console.log("Same tile clicked! Closing. ");
                        try {
                            this.firstClickedTile.startFlip();
                            this.firstClickedTile.particlesClose();
                        } catch (error) {
                            console.log(error.name, error.message);
                        }
                        this.firstClickedTile = null;
                        Main.firstTileOpen = false;
                        this.tileCountDownTimer.stop();
                        this.ctDwnTxt.setText("Countdown: --");
                    }
                } else {
                    if (this.secondClickedTile == null) {
                        this.secondClickedTile = currentTile;
                        try {
                            this.secondClickedTile.startFlip();
                            this.secondClickedTile.particlesOpen();
                        } catch (error) {
                            console.log(error.name, error.message);
                        }
                        Main.secondTileOpen = true;
                        //console.log("Second clicked card ", this.secondClickedTile.uniqueId, this.secondClickedTile.tileFaceId);
                        Initialization.MOVES++;
                        if ((this.firstClickedTile.tileFaceId == this.secondClickedTile.tileFaceId) && (this.firstClickedTile.uniqueId != this.secondClickedTile.uniqueId)) {
                            this.destroyTiles();
                        } else {
                            Initialization.userScore -= this.MINUS_SCORE;
                            if (this.countDownTimer <= 2) {
                                this.startCountdown(2);
                            }
                        }
                    } else {
                        if ((currentTile.uniqueId != this.firstClickedTile.uniqueId) && (currentTile.uniqueId != this.secondClickedTile.uniqueId)) {
                            //other clicked
                            //console.log("Other card!, making it First!", this.firstClickedTile.uniqueId, this.firstClickedTile.tileFaceId);
                            try {
                                this.firstClickedTile.startFlip();
                                this.firstClickedTile.particlesClose();
                            } catch (error) {
                                console.log(error.name, error.message);
                            }
                            try {
                                this.secondClickedTile.startFlip(); //TODO FIX or maybe is ok
                                this.secondClickedTile.particlesClose();
                            } catch (error) {
                                console.log(error.name, error.message);
                            }
                            this.secondClickedTile = null;
                            this.firstClickedTile = null;
                            this.firstClickedTile = currentTile;
                            try {
                                this.firstClickedTile.startFlip();
                                this.firstClickedTile.particlesOpen();
                            } catch (error) {
                                console.log(error.name, error.message);
                            }
                            Initialization.MOVES++;
                            Main.secondTileOpen = false;
                            Main.firstTileOpen = true;
                            this.startCountdown(5);
                        } else {
                            //console.log("We are making the Second Tile - first and closing the other tile");
                            if (this.firstClickedTile != null) {
                                try {
                                    this.firstClickedTile.startFlip();
                                    this.firstClickedTile.particlesClose();
                                } catch (error) {
                                    console.log(error.name, error.message);
                                }
                                this.firstClickedTile = null;
                                this.secondClickedTile = null;
                                this.firstClickedTile = currentTile;
                                Main.secondTileOpen = false;
                                Main.firstTileOpen = true;
                                this.startCountdown(5);
                            } else {
                                //console.log("firstClickedTile is = null", this.firstClickedTile);
                            }
                        }
                    }
                }
            }
        }

        private destroyAtTheSameTime(): void {
            try {
                this.firstClickedTile.continueTileFlipAndDestroy();
            } catch (error) {
                console.log(error.name, error.message);
            }
            this.firstClickedTile = null;
        }
        private destroyTiles(): void {
            if ((this.firstClickedTile.tileFaceId == this.secondClickedTile.tileFaceId) && (this.firstClickedTile.uniqueId != this.secondClickedTile.uniqueId)) {
                if (Initialization.cardCounter == 2) {
                    Initialization.cardCounter -= 2;
                    Initialization.userScore += this.MATCH_SCORE;
                    try {
                        // this also calls destroyAtTheSameTime() and destroys the first tile which was already open.
                        this.secondClickedTile.closeTileAndDestroy();
                    } catch (error) {
                        console.log(error.name, error.message);
                    }
                    this.secondClickedTile = null;

                    Main.firstTileOpen = false;
                    Main.secondTileOpen = false;
                    //console.log("you matched the last cards!");
                    this.levelCompleteCountdown(1);
                } else {
                    Initialization.cardCounter -= 2;
                    Initialization.userScore += this.MATCH_SCORE;
                    //try {
                    //    this.firstClickedTile.continueTileFlipAndDestroy();
                    //} catch (error) {
                    //    console.log(error.name, error.message);
                    //}

                    // this also calls destroyAtTheSameTime() and destroys the first tile which was already open, above is the old code.
                    try {
                        this.secondClickedTile.closeTileAndDestroy();
                    } catch (error) {
                        console.log(error.name, error.message);
                    }
                    this.secondClickedTile = null;

                    Main.firstTileOpen = false;
                    Main.secondTileOpen = false;
                    //console.log("you matched 2 cards!!!");
                }
            } else {
                //console.log("no match");
            }
            this.tileCountDownTimer.stop(true);
            this.ctDwnTxt.setText("Countdown: --");
        }
        private levelCompleteCountdown(completeLevelInSeconds: number): void {
            var tileCountDownTimer = this.game.time.create(true);
            tileCountDownTimer.add(completeLevelInSeconds * Phaser.Timer.SECOND, this.levelComplete, this);
            tileCountDownTimer.start();
        }

        private startCountdown(timeCtdw: number): void {
            if ((this.tileCountDownTimer != undefined) && (this.tileCountDownTimer.running)) {
                this.tileCountDownTimer.stop(true);
            }
            this.countDownTimer = timeCtdw;
            this.tileCountDownTimer = this.game.time.create(true);
            this.tileCountDownTimer.repeat(Phaser.Timer.SECOND, timeCtdw + 1, this.updateCountdown, this);
            this.tileCountDownTimer.start();
        }
        private updateCountdown(): void {
            if (this.countDownTimer <= 0) {
                //console.log("its time to stop...");
                this.ctDwnTxt.setText("Countdown: --");
                if (this.firstClickedTile != null) {
                    try {
                        this.firstClickedTile.startFlip();
                        this.firstClickedTile = null;
                        Main.firstTileOpen = false;
                    } catch (error) {
                        console.log(error.name, error.message);
                    }
                }
                if (this.secondClickedTile != null) {
                    try {
                        this.secondClickedTile.startFlip();
                        this.secondClickedTile = null;
                        Main.secondTileOpen = false;
                    } catch (error) {
                        console.log(error.name, error.message);
                    }
                }
            } else {
                this.ctDwnTxt.setText("Countdown: " + this.countDownTimer);
                //console.log("the time is -= 1 ...", this.countDownTimer);
                this.countDownTimer -= 1;
            }
        }

        update(): void {
            this.updateTimer();
            this.scoreTxt.setText("Score: " + Initialization.userScore);
            this.movesTxt.setText("Moves: " + Initialization.MOVES);
            this.cardsTxt.setText("Cards: " + Initialization.cardCounter);

            //hack
            //if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            //    this.firstClickedTile = null;
            //    this.secondClickedTile = null;
            //    this.levelComplete();
            //}
        }

        //render(): void {
        //    this.game.debug.text(this.game.time.fps + ' fps', 129, 14);
        //    this.game.debug.text("first click " + this.firstClickedTile + " Second clicked " + this.secondClickedTile, 0, 450);
        //    this.game.debug.text("first tile open " + Main.firstTileOpen + " second tile open " + Main.secondTileOpen, 0, 460);
        //}

        private updateTimer(): void {
            var minutes: number = Math.floor(this.game.time.now / Phaser.Timer.MINUTE) % 60;
            var seconds: number = Math.floor(this.game.time.now / Phaser.Timer.SECOND) % 60;
            this.timerTxt.setText("Total time: " + minutes + ':' + seconds);

            Main.gameTime = (minutes + ':' + seconds);
        }
        public static timeHelper(): string {
            return this.gameTime;
        }

        private levelComplete(): void {
            //console.log("LEVEL COMPLETE");
            this.game.stage.backgroundColor = 0xCCFFCC;
            Initialization.cardCounter = 0;
            this.loadingSounds.play();

            if (Initialization.LEVEL == 5) {
                this.game.state.start("menu");
            } else {
                Initialization.LEVEL += 1;
                this.game.state.start("menu");
            }
        }
    }
}