import {hasAdaptiveCard, getCardConfig, getAdaptiveCard, getPatchedAdaptiveCard} from './adaptiveCardUtil';

describe('Adaptive Card Util functions', () => {
  const activityWithCard = {
    object: {
      displayName: 'Hello World!',
      displayNameHTML: {
        __html: 'Hello World!'
      },
      cards: [
        '{"type":"AdaptiveCard","version":"1.0","body":[{"type":"TextBlock","text":"**Adaptive Cards**","separation":"none"}]}'
      ],
      objectType: 'comment'
    },
    verb: 'post'
  };
  const activityWithoutCard = {
    object: {
      displayName: 'Hello World!',
      displayNameHTML: {
        __html: 'Hello World!'
      },
      cards: [
      ],
      objectType: 'comment'
    },
    verb: 'post'
  };
  const sdkInstance = {};
  const adaptiveCardActivity = {
    actor: {
      fullName: 'Some Bot',
      displayName: 'Some Bot',
      emailAddress: 'some-bot@webex.bot',
      id: '53e63861-c0af-4643-96d3-8dde5c19149b',
      objectType: 'person',
      isBot: true
    },
    clientTempId: 'web-client-temp-id1409086527563',
    id: '4df9b460-2d63-11e4-b8eb-ee17142ef128',
    object: {
      displayName: 'Hello World!',
      displayNameHTML: {
        __html: 'Hello World!'
      },
      cards: ['{"$schema":"http://adaptivecards.io/schemas/adaptive-card.json","type":"AdaptiveCard","version":"1.0","body":[{"type":"TextBlock","size":"Medium","weight":"Bolder","text":"Input.Text elements","horizontalAlignment":"Center"},{"type":"Input.Text","placeholder":"Name","style":"text","maxLength":0,"id":"SimpleVal"},{"type":"Input.Number","placeholder":"Quantity","min":-5,"max":5,"id":"NumVal"},{"type":"Input.Date","placeholder":"Due Date","id":"DateVal","value":"2017-09-20"},{"type":"Input.Time","placeholder":"Start time","id":"TimeVal","value":"16:59"},{"type":"TextBlock","size":"Medium","weight":"Bolder","text":"Input.ChoiceSet","horizontalAlignment":"Center"},{"type":"TextBlock","text":"What color do you want? (compact)"},{"type":"Input.ChoiceSet","id":"CompactSelectVal","value":"1","choices":[{"title":"Red","value":"1"},{"title":"Green","value":"2"},{"title":"Blue","value":"3"}]},{"type":"TextBlock","text":"What color do you want? (expanded)"},{"type":"Input.ChoiceSet","id":"SingleSelectVal","style":"expanded","value":"1","choices":[{"title":"Red","value":"1"},{"title":"Green","value":"2"},{"title":"Blue","value":"3"}]},{"type":"TextBlock","text":"What colors do you want? (multiselect)"},{"type":"Input.ChoiceSet","id":"MultiSelectVal","isMultiSelect":true,"value":"1,3","choices":[{"title":"Red","value":"1"},{"title":"Green","value":"2"},{"title":"Blue","value":"3"}]},{"type":"TextBlock","size":"Medium","weight":"Bolder","text":"Input.Toggle","horizontalAlignment":"Center"},{"type":"Input.Toggle","title":"I accept the terms and conditions (True/False)","id":"AcceptsTerms","value":"false","wrap":false},{"type":"Input.Toggle","title":"Red cars are better than other cars","valueOn":"RedCars","valueOff":"NotRedCars","id":"ColorPreference","value":"NotRedCars","wrap":false}],"actions":[{"type":"Action.Submit","title":"Submit","data":{"id":"1234567890"}},{"type":"Action.ShowCard","title":"Show Card","card":{"type":"AdaptiveCard","body":[{"type":"Input.Text","placeholder":"enter comment","style":"text","maxLength":0,"id":"CommentVal"}],"actions":[{"type":"Action.Submit","title":"OK"}],"$schema":"http://adaptivecards.io/schemas/adaptive-card.json"}}]}'],
      objectType: 'comment'
    },
    objectType: 'activity',
    published: '2014-08-26T20:55:26.118Z',
    target: {
      activities: {},
      id: '4d7912b0-2d63-11e4-9b70-a20f8d5fb2fd',
      objectType: 'conversation',
      participants: {},
      tags: [],
      url: 'https://conv-a.wbx2.com/conversation/api/v1/conversations/4d7912b0-2d63-11e4-9b70-a20f8d5fb2fd'
    },
    url: 'https://conv-a.wbx2.com/conversation/api/v1/activities/4df9b460-2d63-11e4-b8eb-ee17142ef128',
    verb: 'post'
  };

  describe('#isAdaptiveCard', () => {
    it('should return true when message contains adaptive card', () => {
      expect(hasAdaptiveCard(activityWithCard.object.cards, sdkInstance)).toEqual(true);
    });

    it('should return false when message does not contains adaptive card', () => {
      expect(hasAdaptiveCard(activityWithoutCard.object.cards, sdkInstance)).toEqual(false);
    });
  });

  describe('#getAdaptiveCard', () => {
    it('returns a new adaptive card instance when the card config is received', () => {
      expect(getAdaptiveCard(activityWithCard.object.cards, activityWithCard.object.displayName, sdkInstance)).not.toBe('Hello World!');
    });
  });

  describe('#getCardConfig', () => {
    it('returns the parsed card config when a strigified JSON is received', () => {
      expect(getCardConfig(activityWithCard.object.cards[0])).not.toBe(null);
    });
  });

  it('returns a proccesed adaptive card when the card json has markdown', () => {
    expect(getAdaptiveCard(activityWithCard.object.cards, sdkInstance)).toMatchSnapshot();
  });

  describe('#getPatchedAdaptiveCard', () => {
    it('returns the custom element adaptive card', () => {
      const cardConfig = getCardConfig(adaptiveCardActivity.object.cards[0], sdkInstance);
      const addChildNode = null;
      const PatchedAdaptiveCard = getPatchedAdaptiveCard(addChildNode);
      const adaptiveCard = new PatchedAdaptiveCard.AdaptiveCard();

      adaptiveCard.parse(cardConfig);
      expect(adaptiveCard).toMatchSnapshot();
    });
  });
});