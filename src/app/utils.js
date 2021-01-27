/**
 * Here you can define helper functions to use across your app.
 */

/**
 * setTimeout wrapped in a promise
 */
export function delay(seconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(seconds);
    }, seconds * 1000);
  });
}
