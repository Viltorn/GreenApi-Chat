import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  username: Yup.string(),
  password: Yup.string(),
});

export const chatsSchema = (chatIds) => Yup.object({
  phone: Yup
    .number('OnlyNumber').integer('OnlyNumber')
    .notOneOf(chatIds, 'Unique'),
});

export const chatsNamesSchema = (chatNames) => Yup.object({
  chatName: Yup
    .string()
    .notOneOf(chatNames, 'UniqueName'),
});
