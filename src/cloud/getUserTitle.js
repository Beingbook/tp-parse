// @flow

Parse.Cloud.define('getUserTitle', async (request, response) => {
  try {
    const {
      userId,
    }: {
      userId?: ?string,
    } = request.params;

    const user: ?Object = await new Parse.Query(Parse.User)
      .get(userId);
    if (!user) {
      throw new Error('user is not existing');
    }
    const rates: Array<Object> = await user.relation('rates').query()
      .include(['game', 'game.tags'])
      .find();
    const rateCount: ?number = user.get('rateCount');

    // @TODO: implment giving user title
    rates.map((review: Object) => {
      const rate = review.get('rate'); // rating score
      const game = review.get('game'); // target game
      const tags = game.get('tags'); // tags of target game
    });

    response.success({
      id: user.id,
      title: '',
    });
  } catch (error) {
    console.error(error); // eslint-disable-line
    response.error(error);
  }
});
