// @flow

Parse.Cloud.beforeSave(Parse.User, (request, response) => {
  try {
    const user = request.object;
    const authData = user.get('authData');
    const displayName = user.get('displayName');
    if (
      !authData &&
      (!displayName || displayName.length < 1 || displayName.length > 24)
    ) {
      throw new Error('Invalid displayName');
    }
    response.success();
  } catch (error) {
    console.log(error); // eslint-disable-line
    response.error(error);
  }
});

Parse.Cloud.afterDelete(Parse.User, async (request) => {
  try {
    const user = request.object;
    const reviewQuery = new Parse.Query('Review');
    reviewQuery.equalTo('author', user);
    const reviews = await reviewQuery.find();
    const reviewObject = Parse.Object.extend('Review');
    await reviewObject.destroyAll(reviews);
  } catch (error) {
    console.log(error); // eslint-disable-line
  }
});
