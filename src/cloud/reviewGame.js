// @flow
import {
  getUserBySessionToken,
} from './utils';

Parse.Cloud.define('reviewGame', async (request, response) => {
  try {
    Parse.Cloud.useMasterKey();
    const { sessionToken, gameId, rate, cancelRate } = request.params;
    const user: Object = await getUserBySessionToken(sessionToken);
    const gameQuery = new Parse.Query('Game');
    const game = await gameQuery.get(gameId);
    let myReview;
    const myReviewQuery = new Parse.Query('Review');
    myReviewQuery
      .equalTo('author', user)
      .equalTo('game', game);
    myReview = await myReviewQuery.first();
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
    if (rate || cancelRate) {
      const previousRate = myReview.get('rate');
      if (myReview.existed()) {
        if (previousRate) {
          myReview.set('previousRate', previousRate);
        } else {
          myReview.unset('previousRate');
        }
      }
      if (cancelRate) {
        myReview.unset('rate');
      } else {
        myReview.set('rate', rate);
      }
    }
    await myReview.save();
    response.success({
      id: myReview.id,
      author: user.id,
      game: game.id,
      rate,
    });
  } catch (error) {
    console.error(error); // eslint-disable-line
    response.error(error);
  }
});
