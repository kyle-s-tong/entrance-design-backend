'use strict';

const axios = require('axios');

const RESULT_TO_TAG_MAP = {
  'resort-casual': 5,
  'luxury-lodge': 4,
  'industrial': 10,
  'mid-century-modern': 8,
  'scandi-and-minimal': 7,
  'sophisticated-and-elegant': 6,
  'vintage-and-eclectic': 9
};

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

    const activeCampaignHost = strapi.config.get('active-campaign.host');
    const activeCampaignKey = strapi.config.get('active-campaign.key');

    let activeCampaignData;
    try {
      activeCampaignData = await axios.get(
        `${activeCampaignHost}/api/3/contacts?email=${user.email}`,
        {
          headers: {
            Accept: 'application/json',
            'Api-Token': activeCampaignKey,
          },
        }
      );
    } catch (e) {
      console.log(e.response.data.errors);
      ctx.response.status = e.response.status;
      ctx.response.message = e.response.data.errors[0].title;
      ctx.response.body = {
        message: e.response.data.errors[0].title,
        statusCode: e.response.status
      };

      return;
    }

    let activeCampaignUser;
    const userExistsInActiveCampaign = activeCampaignData.data.contacts.length > 0;
    if (userExistsInActiveCampaign) {
      activeCampaignUser = activeCampaignData.data.contacts[0];
    } else {
      try {
        const userNames = user.name.split(' ');
        const firstName = userNames[0];

        const userRequest = {
          contact: {
            email: user.email,
            firstName,
          }
        };

        if (userNames.length > 1) {
          lastName = userNames[userNames.length - 1];
          userRequest.contact.lastName = lastName;
        }

        activeCampaignUser = await axios.post(
          `${activeCampaignHost}/api/3/contacts`,
          userRequest,
          {
            headers: {
              Accept: 'application/json',
              'Api-Token': activeCampaignKey,
            },
          }
        );
      } catch (e) {
        console.log(e.response.data.errors);
        ctx.response.status = e.response.status;
        ctx.response.message = e.response.data.errors[0].title;
        ctx.response.body = {
          message: e.response.data.errors[0].title,
          statusCode: e.response.status
        };

        return;
      }
    }

    if (data.questionnaireResult !== null && user.quizCompleted === true) {
      if (activeCampaignUser && typeof RESULT_TO_TAG_MAP[data.questionnaireResult] !== 'undefined') {
        const tagToAddToActiveCampaign = RESULT_TO_TAG_MAP[data.questionnaireResult];

        let contactTagResponse;
        try {
          const userTagRequest = {
            contactTag: {
              tag: tagToAddToActiveCampaign.toString(),
              contact: activeCampaignUser.id.toString(),
            }
          };

          contactTagResponse = await axios.post(
            `${activeCampaignHost}/api/3/contactTags`,
            userTagRequest,
            {
              headers: {
                Accept: 'application/json',
                'Api-Token': activeCampaignKey,
              },
            }
          );
        } catch (e) {
          console.log(e.response.data.errors);
          ctx.response.status = e.response.status;
          ctx.response.message = e.response.data.errors[0].title;
          ctx.response.body = {
            message: e.response.data.errors[0].title,
            statusCode: e.response.status
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
    }

    console.log('belop');
    ctx.response.status = 201;
    ctx.response.body = {
      message: 'Result saved successfully',
      statusCode: 201
    };
    return;
  },
};
