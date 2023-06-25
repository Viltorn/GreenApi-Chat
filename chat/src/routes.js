// const getIdInstance = () => {
//   const { IdInstance } = getAuthToken();
//   return IdInstance;
// };

// const getapiTokenInstance = () => {
//   const { apiTokenInstance } = getAuthToken();
//   return apiTokenInstance;
// };

const host = 'https://api.green-api.com';

export default {
  basePath: () => [host, 'waInstance'].join('/'),
  getAvatarPath: (id, api) => [host, `waInstance${id}`, 'getAvatar', `${api}`].join('/'),
};
