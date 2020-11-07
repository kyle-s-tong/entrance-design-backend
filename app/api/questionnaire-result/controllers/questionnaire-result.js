'use strict';

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const user = {
      ...ctx.request.body,
      provider: 'local'
    }
    const data = await strapi.plugins['users-permissions'].services.user.add(user);

    await strapi.plugins['email'].services.email.send({
      to: 'kyle.simon.tong@gmail.com',
      from: 'hello@entrancedesign.co.nz',
      subject: 'A new user completed the design quiz',
      text: `
        A new user completed the design quiz. Their email address is ${data.email}

        Their quiz result was:
        ${data.questionnaireResult}
      `,
    });

    return 'strapi';
  },
};
