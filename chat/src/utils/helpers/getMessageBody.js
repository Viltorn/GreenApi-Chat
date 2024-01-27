const getMessageBody = (data) => {
  const type = data.typeMessage;
  switch (type) {
    case 'audioMessage':
      return { msgType: type, body: data.fileMessageData.downloadUrl };
    case 'textMessage':
      return { msgType: 'textMessage', body: data.textMessageData.textMessage };
    default:
      return { msgType: 'textMessage', body: '<wrong message format>' };
  }
};

export default getMessageBody;
