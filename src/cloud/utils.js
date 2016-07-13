// @flow

export const Game: Object = Parse.Object.extend('Game');
export const Review: Object = Parse.Object.extend('Review');
export const Tag: Object = Parse.Object.extend('Tag');

export async function getUserBySessionToken(sessionToken: string): Promise<Object> {
  const query = new Parse.Query(Parse.Session);
  query
    .equalTo('sessionToken', sessionToken)
    .include('user');
  const session = await query.first({ sessionToken });
  return session.get('user');
}
