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
  getContactsPath: (id, api) => [host, `waInstance${id}`, 'getContacts', `${api}`].join('/'),
  deleteNotifPath: (id, api, notifId) => [host, `waInstance${id}`, 'deleteNotification', `${api}`, notifId].join('/'),
  getNotifPath: (id, api) => [host, `waInstance${id}`, 'receiveNotification', `${api}`].join('/'),
  checkWhatsAppPath: (id, api) => [host, `waInstance${id}`, 'checkWhatsapp', `${api}`].join('/'),
  getContactInfo: (id, api) => [host, `waInstance${id}`, 'GetContactInfo', `${api}`].join('/'),
};
