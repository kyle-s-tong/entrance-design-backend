'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');
// const stripe = require("stripe")("sk_test_XwW4fZoYKTuJP8JDRJJPGph8");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  async create(ctx) {
    const { token, emailAddress, products } = ctx.request.body;

    const mappedProducts = await Promise.all(products.map(async (product) => {
      return strapi.services.product.findOne({ id: product });
    }))

    let amount = 0;
    mappedProducts.forEach(product => {
      amount += product.Price * 100;
    })

    const now = new Date();
    const createdDate = now.toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland'})

    try {
      await stripe.charges.create({
        amount,
        currency: 'nzd',
        description: `Order by ${ emailAddress } at ${ createdDate }`,
        source: token,
      });
    } catch (e) {
      console.log('Error occured creating order in Stripe, error was: ' + e);
    }

    const order = await strapi.services.order.create({
      EmailAddress: emailAddress,
      OrderedAt: now,
      Products: mappedProducts
    })

    return sanitizeEntity(order, { model: strapi.models.order });
  }
};
