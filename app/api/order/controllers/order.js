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

    let stripeOrder;
    try {
      stripeOrder = await stripe.charges.create({
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

    await strapi.plugins['email'].services.email.send({
      to: 'hello@entrancedesign.co.nz',
      from: 'hello@entrancedesign.co.nz',
      subject: 'A new order has been created!',
      html: `<h4>
        Hi there Entrance Design team,
        </h4>

        <p>A new order has been placed through the site. The email address of the customer is <strong>${emailAddress}</strong></p>

        <p>You can view the full order information
         <a href="https://admin.entrancedesign.co.nz/admin/plugins/content-manager/collectionType/application::order.order/${order.id}">here</a>
        </p>
      `,
    });

    await strapi.plugins['email'].services.email.send({
      to: `${emailAddress}`,
      from: 'hello@entrancedesign.co.nz',
      subject: 'Thank you for your order',
      html: `<h4>
        Hi and thank you from the Entrance Design team.
        </h4>

        <p>Thank you very much for your order from the Entrance Design online store. Our team will be in touch shortly to finalise the order.</p>

        <p>You can find a full receipt of your order
         <a href="${stripeOrder.receipt_url}">here</a>
        </p>
      `,
    });

    return sanitizeEntity(order, { model: strapi.models.order });
  }
};
