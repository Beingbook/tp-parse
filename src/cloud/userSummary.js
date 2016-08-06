// @flow

import Promise from 'bluebird';
import { removeProtocol } from './utils';

const fetchGame = async (review: Object): Object => {
  const game = await review.get('game').fetch();
  let thumbnailExtraSmall = game.get('thumbnailExtraSmall');
  if (thumbnailExtraSmall) {
    thumbnailExtraSmall = thumbnailExtraSmall.url();
    thumbnailExtraSmall = removeProtocol(thumbnailExtraSmall);
  }
  return {
    id: game.id,
    title: game.get('title'),
    koreanTitle: game.get('koreanTitle'),
    thumbnailExtraSmall,
    averageRate: game.get('averageRate'),
    rateCount: game.get('rateCount'),
    rating: review.get('rate'),
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
    const userReviews = user.relation('rates');
    const bestGamesQuery = userReviews.query();
    bestGamesQuery.exists('rate');
    bestGamesQuery.descending('rate');
    bestGamesQuery.limit(5);
    let bestGames = await bestGamesQuery.find();
    bestGames = await Promise.map(bestGames, fetchGame);
    const worstGamesQuery = userReviews.query();
    worstGamesQuery.exists('rate');
    worstGamesQuery.ascending('rate');
    worstGamesQuery.limit(5);
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
