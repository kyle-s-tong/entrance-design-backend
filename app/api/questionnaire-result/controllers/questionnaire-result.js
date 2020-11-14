'use strict';

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

    let data;
    try {
      data = await strapi.plugins['users-permissions'].services.user.add(user);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        ctx.response.status = 409;
        ctx.response.message = 'This username is not unique.';
        ctx.response.body = {
          message: 'This username is not unique.',
          error: 'User already exists',
          statusCode: 409
        };
      }

      return;
    }


    await strapi.plugins['email'].services.email.send({
      to: 'kyle.simon.tong@gmail.com',
      from: 'hello@entrancedesign.co.nz',
      subject: 'A new user completed the design quiz',
      html: `<h4>
        Hi there Entrance Design team,
        </h4>

        <p>A new user has completed the design quiz. Their email address is <strong>${data.email}</strong></p>

        <p>Their quiz result was:</p>
        <p><strong>${data.questionnaireResult}</strong></p>
        <br>
        <p>For more information, you can view this data in the backend systems
        <a href="https://admin.entrancedesign.co.nz/admin/plugins/content-manager/collectionType/plugins::users-permissions.user">here</a>
        </p>
      `,
    });

    ctx.response.status = 201;
    ctx.response.body = {
      message: 'Result saved successfully',
      statusCode: 201
    };
    return;
  },
};
