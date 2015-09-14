/**
 * Created by krasen on 15-8-12.
 */

module MatchingPairs {
    export class ReturnRandomCard {
        public static drawCardString(count: number): string[] {
            var FACES: string = "2,3,4,5,6,7,8,9,T,J,Q,K,A";
            var SUITS: string = "h,d,c,s";
            var cardFacesArray: string[] = FACES.split(',');
            var cardSuitsArray: string[] = SUITS.split(',');

            var idtas: string[] = [];
            for (var i = 0; i < cardFacesArray.length; i++) {
                for (var j = 0; j < cardSuitsArray.length; j++) {
                    idtas.push(cardFacesArray[i] + cardSuitsArray[j]);
                }
            }
            //console.log(idtas);
            var result: string[] = [];
            for (var i: number = 0; i < count; i++) {
                var randomIndex: number = Math.floor((Math.random() * idtas.length));
                //console.log(randomIndex); //array splice
                result.push(idtas.splice(randomIndex - 1, 1)[0]);
            }
            return result;
        }
        public static shuffleArray(array) {
            var counter: number = array.length;
            var temp: number;
            var index: number;
            while (counter > 0) {
                index = Math.floor(Math.random() * counter);
                counter--;
                temp = array[counter];
                array[counter] = array[index];
                array[index] = temp;
            }
            return array;
        }
    }
}