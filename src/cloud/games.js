// @flow
import Promise from 'bluebird';
import {
  Tag, Game, Review,
  getUserBySessionToken,
} from './utils';

type gamesFuncArgs = {
  skip: ?number,
  limit: ?number,
  tags: ?Array<string>,
  search: ?string,
  sessionToken: ?string,
};

const fetchTags = (tag) => ({
  id: tag.id,
  label: tag.get('label'),
});

Parse.Cloud.define('games', async (request, response) => {
  try {
    const { skip, limit, tags, search, sessionToken }: gamesFuncArgs = request.params;
    const queryOptions = { sessionToken };
    let query = new Parse.Query(Game);
    const user:? Object = sessionToken ? await getUserBySessionToken(sessionToken) : undefined;
    if (search) {
      const containsTitle = new Parse.Query(Game);
      containsTitle.contains('title', search);
      const containsWord = new Parse.Query(Game);
      containsWord.equalTo('words', search);
      query = Parse.Query.or(containsTitle, containsWord);
    }
    query
      .skip(skip || 0)
      .limit(limit || 40)
      .addDescending('poplularOrder');
    if (tags && tags.length) {
      const tagFilter = new Parse.Query(Tag);
      tagFilter.containedIn('objectId', tags);
      query.matchesQuery('tags', tagFilter);
    }
    let games = await query.find(queryOptions);
    const fetchGames = async (game: Object): Promise<Object> => {
      let myReview: ?Object;
      if (user) {
        const myReviewQuery = new Parse.Query(Review);
        myReviewQuery.equalTo('author', user);
        myReviewQuery.equalTo('game', game);
        const review = await myReviewQuery.first();
        myReview = {
          id: review.id,
          rate: review.get('rate'),
          user: user.id,
        };
      }
      const gameTags: Array<Object> = await game.relation('tags').query().find(queryOptions);
      const thumbnail: ?Object = game.get('thumbnail');
      return {
        id: game.id,
        title: game.get('title'),
        description: game.get('description'),
        words: game.get('words'),
        thumbnail: thumbnail && thumbnail.url(),
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
