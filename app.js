import {CARD_VALUES, PRINTABLE_VALUES} from './constants/poker'
/*
* i3logix Code Challenge
*
* Please refer to the README.md for challenge questions and complete your challenge below.
*
* Steps:
*
* 1. Write your challenge code below.
* 2. Export a higher order function that will accept arguments for testing
*/

// export your function for testing
export default class PokerEvaluator {
  constructor(hand) {
    this.hand = hand;
    this.cards = this.getCards(hand);
    this.cardValues = this.getCardValues();
    this.cardCounts = this.getCardCounts();
    this.highCard = this.getHighCard();
  }

  sortCardValues = (a, b) => CARD_VALUES.indexOf(a) - CARD_VALUES.indexOf(b);

  getCards = hand => hand.split(' ');

  createCardValue = card => card.substring(0, card.length - 1);

  createCardSuite = card => card.substring(card.length - 1, card.length);

  getCardValues = () =>  this.cards
    .map(this.createCardValue)
    .sort(this.sortCardValues);

  getCardSuites = () => this.cards.map(this.createCardSuite);

  getHighCard = () => CARD_VALUES.find(this.isCardInHand);

  isCardInHand = card => this.cardValues.includes(card);

  getCardCounts = () => {
    return this.cardValues.reduce((acc, card) => {
      acc[card] ? acc[card]++ : acc[card] = 1;
      return acc;
    }, {})
  }

  getPairs = () => {
    const pairs = Object.keys(this.cardCounts).reduce((acc, key) => {
    this.cardCounts[key] === 2 ? acc.push(key) : null
    return acc;
    }, [])
    return pairs.length ? pairs : false;
  }

  hasStraight = () => {
    return this.cardValues.every((value, i) => {
      const firstCard = i === 0;
      const previousCardIndex = CARD_VALUES.indexOf(this.cardValues[i-1]);
      const currentCardIndex = CARD_VALUES.indexOf(value);
      const cardFollowsPrevious = (previousCardIndex - currentCardIndex) === -1;
      return firstCard || cardFollowsPrevious;
    });
  }

  hasAllRoyalValues = () => CARD_VALUES.slice(0,5).every(this.isCardInHand);

  hasCardCount = num => {
    return Object.keys(this.cardCounts)
    .some(key => this.cardCounts[key] === num);
  }

  hasFlush = () => {
    const suiteSet = new Set(this.getCardSuites());
    return suiteSet.size === 1;
  }

  printHighCard = () => PRINTABLE_VALUES[this.highCard].toLowerCase();

  evaluateHand = () => {
    const pairs = this.getPairs();
    const flush = this.hasFlush();
    const trips = this.hasCardCount(3);
    const quads = this.hasCardCount(4);
    const royal = this.hasAllRoyalValues();
    const onePair = pairs.length === 1;
    const straight = this.hasStraight();
    if(royal && flush) {
      return 'Royal Flush';
    } else if(straight && flush) {
      return 'Straight Flush';
    } else if(quads) {
      return '4 of a Kind';
    } else if(trips && onePair) {
      return 'Full House';
    } else if(flush) {
      return 'Flush';
    } else if(straight) {
      return 'Straight';
    } else if(trips) {
      return 'You have 3 of a kind'
    } else if(pairs) {
      return onePair ? `Pair of ${PRINTABLE_VALUES[pairs[0]]}s` : '2 Pair';
    } else {
      return `you have ${this.printHighCard()} high`
    }
  }
};
