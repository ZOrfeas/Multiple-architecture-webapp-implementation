import * as Yup from "yup";

/**
 * Schema validation using yup
 */

const schema = Yup.object({
  username: Yup.string()
      .email('Invalid email address')
      .required('Email cannot be empty'),
  password: Yup.string()
      .matches(
          /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
          'Password must be at least 8 characters long' +
          ', including at least 1 letter and 1 number'
      )
      .min(8, 'Password must be at least 8 characters long')
      .required('Password cannot be empty'),
  re_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .required('Password cannot be empty')
});

export default schema;
