module.exports = strapi => {
  return {
    initialize() {
      console.log(strapi.app.use);
      strapi.app.use(require('prerender-node').set('prerenderToken', 'TerfJ7KaEzx7t8S8wq64'));
    },
  };
};
