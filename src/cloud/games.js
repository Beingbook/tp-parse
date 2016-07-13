// @flow
import Promise from 'bluebird';
import {
  Tag, Game, Review,
  getUserBySessionToken,
} from './utils';

Parse.Cloud.define('games', async (request, response) => {
  try {
    const { skip, limit, tags, search, token } = request.params;
    const queryOptions = {};
    let query = new Parse.Query(Game);
    const user:? Object = token ? await getUserBySessionToken(token) : undefined;
    if (search) {
      const containsTitle = new Parse.Query(Game);
      containsTitle.contains('title', search);
      const containsWord = new Parse.Query(Game);
      containsWord.equalTo('words', search);
      query = Parse.Query.or(containsTitle, containsWord);
    }
    query
      .skip(skip)
      .limit(limit)
      .addDescending('poplularOrder');
    if (tags.length) {
      const tagFilter = new Parse.Query(Tag);
      tagFilter.containedIn('objectId', tags);
      query.matchesQuery('tags', tagFilter);
    }
    let games = await query.find(queryOptions);
    const fetchRelation = async (game: Object): Promise<Object> => {
      let myReview;
      if (user) {
        const myReviewQuery = new Parse.Query(Review);
        myReviewQuery.equalTo('author', user);
        myReviewQuery.equalTo('game', game);
        myReview = await myReviewQuery.first();
      }
      const thumbnail = game.get('thumbnail');
      return {
        id: game.id,
        title: game.get('title'),
        createdAt: game.get('createdAt'),
        updatedAt: game.get('updatedAt'),
        thumbnail: thumbnail && thumbnail.url(),
        description: game.get('description'),
        releaseDate: game.get('releaseDate'),
        canPlay: !!game.get('canPlay'),
        tags: (await game.relation('tags').query().find(queryOptions)).map((tag) => ({
          id: tag.id,
          label: tag.get('label'),
        })),
        myReview,
      };
    };
    games = await Promise.map(games, fetchRelation);
    response.success(games);
  } catch (error) {
    console.error(error); // eslint-disable-line
    response.error(error);
  }
});
