/* eslint-disable no-restricted-globals */
// self is defined differently for workers
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { clientsClaim, setCacheNameDetails } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute } from 'workbox-precaching/precacheAndRoute';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import {
  CacheFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';

const MAX_ENTRIES = 200;
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 Days
const PAGE_MAX_AGE_SECONDS = 60 * 15; // 15 Mins
const appShell = self.appShell;

setCacheNameDetails({
  prefix: '',
  suffix: '',
  precache: 'pwa_precache',
});

self.skipWaiting();
clientsClaim();

precacheAndRoute(appShell.concat(self.__WB_MANIFEST));

// Cache CSS, JS, and Web Worker requests with a Stale While Revalidate strategy
registerRoute(
  ({ url, request }) => {
    return url.origin === self.location.origin
            && (
              request.destination === 'style'
                || request.destination === 'script'
                || request.destination === 'worker'
                || request.destination === 'font'
                || request.destination === 'manifest'
            );
  },
  new CacheFirst({
    cacheName: 'pwa_assets',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  })
);

registerRoute(
  function ({ url, request }) {
    return request.destination === 'image';
  },
  new CacheFirst({
    cacheName: 'pwa_thirdPartyImages',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: MAX_ENTRIES,
        maxAgeSeconds: MAX_AGE_SECONDS,
      }),
    ],
  })
);

registerRoute(
  function ({ request }) {
    return request.destination === 'image';
  },
  new CacheFirst({
    cacheName: 'pwa_images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: MAX_ENTRIES,
        maxAgeSeconds: MAX_AGE_SECONDS,
      }),
    ],
  })
);

registerRoute(
  ({ url, request }) => {
    return url.origin === self.location.origin && request.mode === 'navigate';
  },
  new StaleWhileRevalidate({
    cacheName: 'pwa_pages',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: PAGE_MAX_AGE_SECONDS,
      }),
      new CacheableResponsePlugin({
        statuses: [200],
        headers: {
          'x-sf-cc-iscacheable': 'true',
        },
      }),
    ],
  })
);

setCatchHandler(({ event }) => {
  switch (event.request.destination) {
  case 'document':
    return caches.match(self.offlinePage, { ignoreSearch: true });
  default:
    // If we don't have a fallback, just return an error response.
    return Response.error();
  }
});
