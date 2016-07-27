// @flow

import { recommendationEvent } from './utils';

Parse.Cloud.beforeSave(Parse.User, (request, response) => {
  try {
    const user = request.object;
    const displayName = user.get('displayName');
    if (!displayName || displayName.length < 1 || displayName.length > 24) {
      throw new Error('Invalid displayName');
    }
    response.success();
  } catch (error) {
    response.error(error);
  }
});

Parse.Cloud.afterSave(Parse.User, async (request) => {
  const user = request.object;
  try {
    await recommendationEvent.createUser({
      uid: user.id,
      eventTime: user.get('createdAt'),
    });
  } catch (error) {
    console.error(error); // eslint-disable-line
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
