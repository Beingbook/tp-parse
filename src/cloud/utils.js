// @flow

import pio from 'predictionio-driver';
import {
  PIO_TELPO_RECOMMENDATION,
} from '../config';

export const recommendationEvent = new pio.Events({
  appId: PIO_TELPO_RECOMMENDATION.appId,
  accessKey: PIO_TELPO_RECOMMENDATION.accessKey,
  url: PIO_TELPO_RECOMMENDATION.url,
  port: PIO_TELPO_RECOMMENDATION.eventPort,
});

export const recommendationEngine = new pio.Engine({
  url: PIO_TELPO_RECOMMENDATION.url,
  port: PIO_TELPO_RECOMMENDATION.enginePort,
});

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
