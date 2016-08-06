// @flow

Parse.Cloud.define('milestones', async (request, response) => {
  try {
    const totalUserCount = await new Parse.Query(Parse.User).count();
    const totalGameCount = await new Parse.Query('Game').count();
    const totalRateCount = await new Parse.Query('Review')
      .exists('rate')
      .count();
    response.success({
      totalUserCount,
      totalGameCount,
      totalRateCount,
    });
  } catch (error) {
    response.error('Failed to fetch user count');
  }
});
