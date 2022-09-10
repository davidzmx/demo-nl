module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
//     {
//       name      : 'API',
//       script    : 'grunt',
//       env: {
//         COMMON_VARIABLE: 'true'
//       },
//       env_production : {
//         NODE_ENV: 'production'
//       }
//     },

    // Second application
    {
      name      :"demo-nl-backend",
      script    : "npm",
      args      : "run dev"
    }
  ]
};

