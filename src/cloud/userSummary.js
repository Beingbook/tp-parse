// @flow

import Promise from 'bluebird';

const fetchGame = async (review: Object): Object => {
  const game = await review.get('game').fetch();
  let thumbnail = game.get('thumbnail');
  if (thumbnail) {
    thumbnail = thumbnail.url();
    thumbnail = thumbnail.replace(/.*?:\/\//g, '//');
  }
  return {
    id: game.id,
    title: game.get('title'),
    koreanTitle: game.get('koreanTitle'),
    thumbnail,
    averageRate: game.get('averageRate'),
    rateCount: game.get('rateCount'),
  };
};

Parse.Cloud.define('userSummary', async (request, response) => {
  try {
    const { userId } = request.params;
    if (!userId) {
      throw new Error('No user id passed');
    }
    const query = new Parse.Query(Parse.User);
    const user = await query.get(userId);

    if (!user) {
      throw new Error('user is not existing');
    }
    // const rates: Array<Object> = await user.relation('rates').query()
    //   .include(['game', 'game.tags'])
    //   .find();
    // const rateCount: ?number = user.get('rateCount');

    // @TODO: implment giving user title
    // rates.map((review: Object) => {
    //   const rate = review.get('rate'); // rating score
    //   const game = review.get('game'); // target game
    //   const tags = game.get('tags'); // tags of target game
    // });

    const userReviews = user.relation('rates');
    const bestGamesQuery = userReviews.query();
    bestGamesQuery.exists('rate');
    bestGamesQuery.descending('rate');
    bestGamesQuery.limit(10);
    let bestGames = await bestGamesQuery.find();
    bestGames = await Promise.map(bestGames, fetchGame);
    const worstGamesQuery = userReviews.query();
    worstGamesQuery.exists('rate');
    worstGamesQuery.ascending('rate');
    worstGamesQuery.limit(10);
    let worstGames = await worstGamesQuery.find();
    worstGames = await Promise.map(worstGames, fetchGame);
    response.success({
      id: user.id,
      title: 'user title',
      profileImg: user.get('profileImg'),
      displayName: user.get('displayName'),
      averageRate: user.get('averageRate'),
      rateCount: user.get('rateCount'),
      bestGames,
      worstGames,
    });
  } catch (error) {
    response.error(error);
  }
});
