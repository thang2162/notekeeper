module.exports = {
  email: {
    isEmail: true,
    isString: true,
    notEmpty: true
  },
  password: {
    isString: true,
    notEmpty: true
  },
  key: {
    isString: true,
    notEmpty: true,
    isLength: {
      errorMessage: 'ResetKey should be at least 32 char long',
      // Multiple options would be expressed as an array
      options: { min: 32 }
    }
  }
};
