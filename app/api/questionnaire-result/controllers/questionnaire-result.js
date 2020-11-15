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

    const userService = strapi.plugins['users-permissions'].services.user;

    const existingUser = await userService.fetch({ username: user.username });
    let data;
    if (existingUser) {
      try {
        data = await userService.edit({ id: existingUser.id }, ctx.request.body);
      } catch (e) {
        ctx.response.status = e.status || 500;
        ctx.response.message = e.message;
        ctx.response.body = {
          message: e.message,
          statusCode: e.status
        };

        return;
      }
    } else {
      try {
        data = await userService.add(user);
      } catch (e) {
        ctx.response.status = e.status;
        ctx.response.message = e.message;
        ctx.response.body = {
          message: e.message,
          statusCode: e.status
        };

        return;
      }
    }

    await strapi.plugins['email'].services.email.send({
      to: 'hello@entrancedesign.co.nz',
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
