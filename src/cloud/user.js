// @flow

Parse.Cloud.afterDelete(Parse.User, async (request, response) => {
  try {
    const user = request.object;
    const reviewQuery = new Parse.Query('Review');
    reviewQuery.equalTo('author', user);
    const reviews = await reviewQuery.find();
    const reviewObject = Parse.Object.extend('Review');
    await reviewObject.destroyAll(reviews);
    response.success();
  } catch (error) {
    response.error(error);
  }
});
