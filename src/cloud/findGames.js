// @flow
import Promise from 'bluebird';
import { getUserBySessionToken, removeProtocol } from './utils';

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
      .addDescending('popularOrder');
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
        const reviewFilter = user.relation('rates').query();
        reviewFilter.exists('rate');
        reviewFilter.equalTo('author', user);
        const rateCount = user.get('rateCount');
        if (contentFilter === 'onlyRatedByMe') {
          if (rateCount) {
            query.matchesQuery('rates', reviewFilter);
          } else {
            response.success([]);
            return;
          }
        } else if (contentFilter === 'withoutRatedByMe') {
          if (rateCount) {
            query.doesNotMatchQuery('rates', reviewFilter);
          }
        }
      }
    }
    if (typeof (search) === 'string' && search.length) {
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
      const seriesTags: Array<Object> = await game.relation('tags').query()
        .equalTo('isSeries', true)
        .find(queryOptions);
      let thumbnail = game.get('thumbnail');
      if (thumbnail) {
        thumbnail = thumbnail.url();
        thumbnail = removeProtocol(thumbnail);
      }
      let thumbnailMedium = game.get('thumbnailMedium');
      if (thumbnailMedium) {
        thumbnailMedium = thumbnailMedium.url();
        thumbnailMedium = removeProtocol(thumbnailMedium);
      }
      let thumbnailSmall = game.get('thumbnailSmall');
      if (thumbnailSmall) {
        thumbnailSmall = thumbnailSmall.url();
        thumbnailSmall = removeProtocol(thumbnailSmall);
      }
      return {
        id: game.id,
        title: game.get('title'),
        koreanTitle: game.get('koreanTitle'),
        description: game.get('description'),
        words: game.get('words'),
        thumbnail,
        thumbnailSmall,
        thumbnailMedium,
        averageRate: game.get('averageRate'),
        reviewCount: game.get('reviewCount'),
        rateCount: game.get('rateCount'),
        myReview,
        series: seriesTags.map(fetchTags),
      };
    };
    games = await Promise.map(games, fetchGames);
    response.success(games);
  } catch (error) {
    console.error(error); // eslint-disable-line
    response.error(error);
  }
});
