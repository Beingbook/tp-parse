// @flow
import Promise from 'bluebird';
import { getUserBySessionToken } from './utils';

type gamesFuncArgs = {
  skip?: ?number,
  limit?: ?number,
  tags?: ?Array<string>,
  search?: ?string,
  sessionToken?: ?string,
  mainTag?: ?string,
  contentFilter?: void | 'onlyRatedByMe' | 'withoutRatedByMe',
};

const fetchTags = (tag) => ({
  id: tag.id,
  label: tag.get('label'),
});

Parse.Cloud.define('findGames', async (request, response) => {
  try {
    const {
      skip, limit, tags, search, mainTag,
      sessionToken, contentFilter,
    }: gamesFuncArgs = request.params;
    const queryOptions = { sessionToken };
    let query = new Parse.Query('Game');
    const user:? Object = sessionToken ? await getUserBySessionToken(sessionToken) : undefined;
    query
      .skip(skip || 0)
      .limit(limit || 40)
      .addDescending('poplularOrder');
    if (mainTag) {
      const tagFilter = new Parse.Query('Tag');
      tagFilter.equalTo('label', mainTag);
      query.matchesQuery('tags', tagFilter);
    }
    if (tags && tags.length) {
      const tagFilter = new Parse.Query('Tag');
      tagFilter.containedIn('label', tags);
      query.matchesQuery('tags', tagFilter);
    }
    if (user) {
      if (contentFilter) {
        const reviewFilter = new Parse.Query('Review');
        reviewFilter.equalTo('author', user);
        if (contentFilter === 'onlyRatedByMe') {
          reviewFilter.exists('rate');
        } else if (contentFilter === 'withoutRatedByMe') {
          reviewFilter.doesNotExist('rate');
        }
        query.matchesQuery('reviews', reviewFilter);
      }
    }
    if (typeof(search) === 'string' && search.length) {
      const containsTitle = new Parse.Query('Game');
      containsTitle.contains('title', search);
      const containsWord = new Parse.Query('Game');
      containsWord.equalTo('words', search);
      const containsKoreanTitle = new Parse.Query('Game');
      containsKoreanTitle.contains('koreanTitle', search);
      query = Parse.Query.or(containsTitle, containsWord, containsKoreanTitle);
    }
    let games = await query.find(queryOptions);
    const fetchGames = async (game: Object): Promise<Object> => {
      let myReview: ?Object;
      if (user) {
        const myReviewQuery = new Parse.Query('Review');
        myReviewQuery.equalTo('author', user);
        myReviewQuery.equalTo('game', game);
        const myReviewParse = await myReviewQuery.first();
        if (myReviewParse) {
          myReview = {
            id: myReviewParse.id,
            rate: myReviewParse.get('rate'),
            game: myReviewParse.get('game').id,
            author: user.id,
          };
        }
      }
      const gameTags: Array<Object> = await game.relation('tags').query().find(queryOptions);
      const thumbnail: ?Object = game.get('thumbnail');
      return {
        id: game.id,
        title: game.get('title'),
        koreanTitle: game.get('koreanTitle'),
        description: game.get('description'),
        words: game.get('words'),
        thumbnail: thumbnail && thumbnail.url(),
        averageRate: game.get('averageRate'),
        reviewCount: game.get('reviewCount'),
        rateCount: game.get('rateCount'),
        myReview,
        tags: gameTags.map(fetchTags),
      };
    };
    games = await Promise.map(games, fetchGames);
    response.success(games);
  } catch (error) {
    console.error(error); // eslint-disable-line
    response.error(error);
  }
});
