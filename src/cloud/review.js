// @flow

Parse.Cloud.beforeSave('Review', (request, response) => {
  try {
    const review = request.object;
    const author:? Object = review.get('author');
    if (!author) {
      throw new Error('review should have author');
    }
    const rate: ?number = review.get('rate');
    if (rate) {
      if (typeof(rate) !== 'number' || rate < 0.5 || rate > 5) {
        throw new Error('rate should be 0.5 ~ 5 number');
      }
      if (rate % 0.5 !== 0) {
        throw new Error('rate minimum unit is 0.5');
      }
    }
    response.success();
  } catch (error) {
    response.error(error);
  }
});

Parse.Cloud.afterSave('Review', async (request) => {
  try {
    const review = request.object;
    let game: ?Object = review.get('game');
    if (game) {
      game = await game.fetch();
    }
    const user: Object = await review.get('author').fetch();
    if (!review.existed()) {
      user.increment('reviewCount');
      user.increment('rateCount');
      user.relation('reviews').add(review);
      await user.save();
      if (game) {
        const rate: ?number = review.get('rate');
        let averageRate: number = game.get('averageRate') || 0;
        let rateCount: number = game.get('rateCount') || 0;
        if (rate) {
          rateCount += 1;
          averageRate = ((averageRate * (rateCount - 1)) + rate) / rateCount;
          game.set('averageRate', averageRate);
          game.set('rateCount', rateCount);
        }
        const reviewCount: number = (game.get('reviewCount') || 0) + 1;
        game.set('reviewCount', reviewCount);
        game.relation('reviews').add(review);
        await game.save();
      }
    } else {
      if (game) {
        const rate: ?number = review.get('rate');
        const previousRate: ?number = review.get('previousRate');
        if (rate !== previousRate) {
          let averageRate = game.get('averageRate') || 0;
          let rateCount = game.get('rateCount') || 0;
          const rateSum = averageRate * rateCount;
          if (rate && !previousRate) {
            // new rate
            rateCount += 1;
            averageRate = (rateSum + rate) / rateCount;
            user.increment('rateCount');
          } else if (!rate && previousRate) {
            // remove rate
            rateCount -= 1;
            averageRate = (rateSum - previousRate) / rateCount;
            user.increment('rateCount', -1);
          } else {
            // update rate
            if (typeof(rate) === 'number' && typeof(previousRate) === 'number') {
              averageRate = (rateSum + (rate - previousRate)) / rateCount;
            }
          }
          if (user.dirty()) {
            await user.save();
          }
          game.set('averageRate', averageRate);
          game.set('rateCount', rateCount);
          if (game.dirty()) {
            await game.save();
          }
        }
      }
    }
  } catch (error) {
    console.error(error); // eslint-disable-line
  }
});

Parse.Cloud.afterDelete('Review', async (request, response) => {
  try {
    const review = request.object;
    const user: Object = await review.get('author').fetch();
    const rate: ?number = review.get('rate');
    if (rate) {
      user.increment('rateCount', -1);
    }
    user.increment('reviewCount', -1);
    user.relation('reviews').remove(review);
    await user.save(null);
    const game = await review.get('game').fetch();
    if (game) {
      if (rate) {
        const rateCount = game.get('rateCount') - 1;
        let averageRate = game.get('averageRate');
        averageRate = rateCount === 0 ? 0 : ((averageRate * (rateCount + 1)) - rate) / rateCount;
        game.set('rateCount', rateCount);
        game.set('averageRate', averageRate);
      }
      game.increment('reviewCount', -1);
      game.relation('reviews').remove(review);
      await game.save(null);
    }
    response.success();
  } catch (error) {
    console.error(error); // eslint-disable-line
    response.error(error);
  }
});
