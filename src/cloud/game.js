// @flow

import { recommendationEvent } from './utils';

Parse.Cloud.afterSave('Game', async (request) => {
  const game = request.object;
  if (!game.existed()) {
    try {
      await recommendationEvent.createItem({
        iid: game.id,
        eventTime: game.get('createdAt'),
      });
    } catch (error) {
      console.error(error); // eslint-disable-line
    }
  }
});
