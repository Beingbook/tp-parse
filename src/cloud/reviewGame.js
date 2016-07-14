// @flow
import {
  getUserBySessionToken,
} from './utils';

Parse.Cloud.define('reviewGame', async (request, response) => {
  try {
    Parse.Cloud.useMasterKey();
    const { sessionToken, gameId, rate } = request.params;
    if (!sessionToken) {
      throw new Error('need authentication');
    }
    const queryOptions = { sessionToken };
    const user: Object = await getUserBySessionToken(sessionToken);
    const gameQuery = new Parse.Query('Game');
    const game = await gameQuery.get(gameId, queryOptions);
    let myReview;
    const myReviewQuery = new Parse.Query('Review');
    myReviewQuery
      .equalTo('author', user)
      .equalTo('game', game);
    myReview = await myReviewQuery.first(queryOptions);
    if (!myReview) {
      myReview = new Parse.Object('Review');
      const myReviewACL = new Parse.ACL();
      myReviewACL.setPublicReadAccess(true);
      myReviewACL.setPublicWriteAccess(false);
      myReviewACL.setWriteAccess(user.id, true);
      myReviewACL.setRoleWriteAccess('Administrator', true);
      myReview.setACL(myReviewACL);
      myReview.set('author', user);
      myReview.set('game', game);
    }
    if (rate) {
      if (typeof(rate) !== 'number' || rate < 0.5 || rate > 5) {
        throw new Error('rate range should be 0.5 ~ 5 number');
      }
      myReview.set('rate', rate);
    }
    await myReview.save(null, queryOptions);
    game.relation('reviews').add(myReview);
    await game.save(null, queryOptions);
    user.relation('reviews').add(myReview);
    await user.save(null, queryOptions);
    response.success({
      user: user.id,
      game: game.id,
      rate,
    });
  } catch (error) {
    console.error(error); // eslint-disable-line
    response.error(error);
  }
});
