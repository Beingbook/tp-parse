// @flow

export const removeProtocol = (text: string) => text.replace(/.*?:\/\//g, '//');

export async function getUserBySessionToken(sessionToken: string): Promise<Object> {
  const query = new Parse.Query(Parse.Session);
  query
    .equalTo('sessionToken', sessionToken)
    .include('user');
  const session = await query.first({ sessionToken });
  return session.get('user');
}
