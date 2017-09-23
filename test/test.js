const assert = require('chai').assert;
import PokerEvaluator from '../App';
import {CARD_VALUES} from '../constants/poker'

describe('PokerEvaluator', () => {
  let defaultObject, hand, zeroValueHand;
  const generateSubject = args => new PokerEvaluator(args);

  beforeEach(() => {
    hand = 'Ah As 10c 7d 6s';
    zeroValueHand = generateSubject('Ah 3s 10c 7d 6s');
    defaultObject = generateSubject(hand);
  })

  it('saves the initial hand', () => {
    const subject = generateSubject(hand);
    assert.deepEqual(subject.hand, hand)
  })

  describe('#getCards', () => {
    it('returns array', () => {
      assert.isArray(defaultObject.getCards(hand))
    })
    it('returns correct length', () => {
      assert.equal(defaultObject.getCards(hand).length, 5)
    })
  })

  describe('#createCardValue', () => {
    it('returns string', () => {
      assert.isString(defaultObject.createCardValue('As'))
    })
    it('works with 1 character value', () => {
      assert.equal(defaultObject.createCardValue('As'), 'A')
    })
    it('works with 2 character value', () => {
      assert.equal(defaultObject.createCardValue('10s'), '10')
    })
  })

  describe('#createCardSuite', () => {
    it('returns string', () => {
      assert.isString(defaultObject.createCardSuite('As'))
    })
    it('works with 1 character value', () => {
      assert.equal(defaultObject.createCardSuite('As'), 's')
    })
    it('works with 2 character value', () => {
      assert.equal(defaultObject.createCardSuite('10s'), 's')
    })
  })

  describe('#getCardValues', () => {
    it('returns array', () => {
      assert.isArray(defaultObject.getCardValues())
    })
    it('array consists only of card values', () => {
      defaultObject.getCardValues().map(card => {
        assert.isTrue(CARD_VALUES.includes(card))
      })
    })
  })

  describe('#getCardSuites', () => {
    it('returns array', () => {
      assert.isArray(defaultObject.getCardSuites())
    })
    it('array consists only of card suites', () => {
      defaultObject.getCardSuites().map(card => {
        assert.isTrue(/[a-z]/.test(card))
      })
    })
  })

  describe('#getCardCounts', () => {
    it('returns object', () => {
      assert.isObject(defaultObject.getCardCounts())
    })
    it('returns has correct values', () => {
      const subject = defaultObject.getCardCounts();
      assert.equal(subject['A'], 2)
      assert.equal(subject['10'], 1)
    })
  })

  describe('#hasFlush', () => {
    it('returns true with flush', () => {
      const subject = generateSubject('As As 7s 7s 6s')
      assert.isTrue(subject.hasFlush())
    })
    it('returns false without flush', () => {
      const subject = generateSubject('Ah As 7c 7d 6s')
      assert.isFalse(subject.hasFlush(), 1)
    })
  })

  describe('#isCardInHand', () => {
    it('returns Boolean', () => {
      const subject = generateSubject('Ah As 7c 7d 6s')
      assert.isBoolean(subject.isCardInHand('A'))
    })
    it('returns true if the hand includes value', () => {
      const subject = generateSubject('Ah As Ac 7d 6s')
      assert.isTrue(subject.isCardInHand('A'))
    })
    it('returns false if value is not in hand', () => {
      const subject = generateSubject('Ah As 7c 7d 6s')
      assert.isFalse(subject.isCardInHand('1'))
    })
  })

  describe('#getHighCard', () => {
    it('returns highest non numeric', () => {
      const subject = generateSubject('As As 7s 7s 6s')
      assert.equal(subject.getHighCard(), 'A')
    })
    it('returns highest numeric', () => {
      const subject = generateSubject('10s 1s 7s 7s 6s')
      assert.equal(subject.getHighCard(), '10')
    })
  })

  describe('#getPairs', () => {
    it('returns array', () => {
      assert.isArray(defaultObject.getPairs())
    })
    it('returns one pair', () => {
      assert.equal(defaultObject.getPairs().length, 1)
    })
    it('returns value of only pair', () => {
      assert.equal(defaultObject.getPairs()[0], 'A')
    })
  })

  describe('#hasCardCount', () => {
    it('returns Boolean', () => {
      const subject = generateSubject('Ah As 7c 7d 6s')
      assert.isBoolean(subject.hasCardCount(2))
    })
    it('returns true if a card has that count', () => {
      const subject = generateSubject('Ah As Ac 7d 6s')
      assert.isTrue(subject.hasCardCount(3))
    })
    it('returns false if no card matches', () => {
      const subject = generateSubject('Ah As 7c 7d 6s')
      assert.isFalse(subject.hasCardCount(-1))
    })
  })

  describe('#hasStraight', () => {
    it('returns false if no straight', () => {
      const subject = generateSubject('Ah As 7c 7d 6s')
      assert.isFalse(subject.hasStraight())
    })
    it('returns true with alphanumeric straight', () => {
      const subject = generateSubject('Kh Qh Jh 10h 9s')
      assert.isTrue(subject.hasStraight())
    })
    it('returns true with numeric straight', () => {
      const subject = generateSubject('1h 2h 3h 4h 5h')
      assert.isTrue(subject.hasStraight())
    })
  })

  describe('#hasAllRoyalValues', () => {
    it('returns true if all are royal', () => {
      const subject = generateSubject('Ah As Ac Ad As')
      assert.isFalse(subject.hasAllRoyalValues())
    })
    it('returns false with non royal values', () => {
      const subject = generateSubject('Kh Qh Jh 10h 9s')
      assert.isFalse(subject.hasAllRoyalValues())
    })
  })

  describe('#evaluteHand', () => {
    it('returns string', () => {
      assert.isString(defaultObject.evaluateHand());
    })

    it('evalutes highest card', () => {
      assert.equal(zeroValueHand.evaluateHand(), 'you have ace high');
    })

    it('evalutes single pair', () => {
      assert.equal(defaultObject.evaluateHand(), 'Pair of Aces');
    })

    it('evalutes 2 pair', () => {
      const subject = generateSubject('Ah As 7c 7d 6s')
      assert.equal(subject.evaluateHand(), '2 Pair');
    })

    it('evalutes 3 of a kind', () => {
      const subject = generateSubject('Ah 7s 7c 7d 6s')
      assert.equal(subject.evaluateHand(), 'You have 3 of a kind');
    })

    it('evalutes flush', () => {
      const subject = generateSubject('As As 7s 7s 6s')
      assert.equal(subject.evaluateHand(), 'Flush');
    })

    it('evalutes straight flush', () => {
      const subject = generateSubject('1s 2s 3s 4s 5s')
      assert.equal(subject.evaluateHand(), 'Straight Flush');
    })

    it('evalutes royal flush', () => {
      const subject = generateSubject('As Ks Qs Js 10s')
      assert.equal(subject.evaluateHand(), 'Royal Flush');
    })

    it('evalutes 4 of a kind', () => {
      const subject = generateSubject('As As As Ah 10s')
      assert.equal(subject.evaluateHand(), '4 of a Kind');
    })

    it('evalutes full house', () => {
      const subject = generateSubject('As As 10s 10h 10s')
      assert.equal(subject.evaluateHand(), 'Full House');
    })

    it('evalutes straight', () => {
      const subject = generateSubject('1s 2s 3s 4h 5s')
      assert.equal(subject.evaluateHand(), 'Straight');
    })
  })
});
