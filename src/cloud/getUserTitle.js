// @flow

Parse.Cloud.define('getUserTitle', async (request, response) => {
  try {
    const {
      userId,
    } = request.params;

    const user: ?Object = await Parse.User.get(userId);
    if (!user) {
      throw new Error('user is not existing');
    }
    const rates: Array<Object> = await user.relation('rates').query()
      .include(['game', 'game.tags'])
      .find();
    const games: Array<Object> = rates.map(rate => rate.game);
    const rateCount: ?number = user.get('rateCount');

    // @TODO: implment giving user title
    console.log(games, rateCount);

    response.success({
      id: user.id,
      title: '',
    });
  } catch (error) {
    response.error(error);
  }
});
