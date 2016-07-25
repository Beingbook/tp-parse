// @flow

Parse.Cloud.beforeSave('Review', async (request, response) => {
  try {
    const review = request.object;
    let author:? Object = review.get('author');
    if (!author) {
      throw new Error('review should have author');
    }
    author = await author.fetch();
    const rate: ?number = review.get('rate');
    if (rate) {
      const emailVerified: ?boolean = author.get('emailVerified');
      const authData: ?Object = author.get('authData');
      const canRate = (
        (authData && authData.facebook && authData.facebook.id) ||
        emailVerified
      );
      if (!canRate) {
        throw new Error('only email verified user or 3rd-authenticated user can write review');
      }
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
    const rate: ?number = review.get('rate');
    if (!review.existed()) {
      if (game) {
        let averageRate: number = game.get('averageRate') || 0;
        let rateCount: number = game.get('rateCount') || 0;
        if (rate) {
          rateCount += 1;
          averageRate = ((averageRate * (rateCount - 1)) + rate) / rateCount;
          game.set('averageRate', averageRate);
          game.set('rateCount', rateCount);
        }
        game.relation('rates').add(review);
      }
      if (rate) {
        const rateCount: number = (user.get('rateCount') || 0) + 1;
        let averageRate: number = user.get('averageRate') || 0;
        averageRate = ((averageRate * (rateCount - 1)) + rate) / rateCount;
        user.set('averageRate', averageRate);
        user.set('rateCount', rateCount);
        user.relation('rates').add(review);
      }
    } else {
      const previousRate: ?number = review.get('previousRate');
      if (game) {
        if (rate !== previousRate) {
          let averageRate = game.get('averageRate') || 0;
          let rateCount = game.get('rateCount') || 0;
          const rateSum = averageRate * rateCount;
          if (rate && !previousRate) {
            // new rate
            rateCount += 1;
            averageRate = (rateSum + rate) / rateCount;
          } else if (!rate && previousRate) {
            // remove rate
            rateCount -= 1;
            averageRate = (rateSum - previousRate) / rateCount;
          } else {
            // update rate
            if (typeof(rate) === 'number' && typeof(previousRate) === 'number') {
              averageRate = (rateSum + (rate - previousRate)) / rateCount;
            }
          }
          game.set('averageRate', averageRate);
          game.set('rateCount', rateCount);
        }
      }
      if (rate !== previousRate) {
        let averageRate = user.get('averageRate') || 0;
        let rateCount = user.get('rateCount') || 0;
        const rateSum = averageRate * rateCount;
        if (rate && !previousRate) {
          rateCount += 1;
          averageRate = (rateSum + rate) / rateCount;
          user.relation('rates').add(review);
        } else if (!rate && previousRate) {
          rateCount -= 1;
          averageRate = (rateSum - previousRate) / rateCount;
          user.relation('rates').remove(review);
        } else {
          if (typeof(rate) === 'number' && typeof(previousRate) === 'number') {
            averageRate = (rateSum + (rate - previousRate)) / rateCount;
          }
        }
        user.set('averageRate', averageRate);
        user.set('rateCount', rateCount);
      }
    }
    if (game && game.dirty()) {
      await game.save();
    }
    if (user.dirty()) {
      await user.save();
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
      const rateCount = user.get('rateCount') - 1;
      let averageRate = user.get('averageRate');
      averageRate = rateCount === 0 ? 0 : ((averageRate * (rateCount + 1)) - rate) / rateCount;
      user.set('rateCount', rateCount);
      user.set('averageRate', averageRate);
      user.relation('rates').remove(review);
    }
    const game: ?Object = await review.get('game').fetch();
    if (game) {
      if (rate) {
        const rateCount = game.get('rateCount') - 1;
        let averageRate = game.get('averageRate');
        averageRate = rateCount === 0 ? 0 : ((averageRate * (rateCount + 1)) - rate) / rateCount;
        game.set('rateCount', rateCount);
        game.set('averageRate', averageRate);
      }
      game.relation('rates').remove(review);
      if (game.dirty()) {
        await game.save(null);
      }
    }
    if (user.dirty()) {
      await user.save(null);
    }
    response.success();
  } catch (error) {
    console.error(error); // eslint-disable-line
    response.error(error);
  }
});
