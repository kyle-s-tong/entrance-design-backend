'use strict';

/**
 * A set of functions called "actions" for `result`
 */

module.exports = {
  generate: async (ctx, next) => {
    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  }
};
