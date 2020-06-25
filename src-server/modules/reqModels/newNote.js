module.exports = {
  note_id: {
    isString: true,
    notEmpty: true,
    isLength: {
      errorMessage: 'Note ID should be at least 24 char long',
      // Multiple options would be expressed as an array
      options: { min: 24 }
    }
  },
  title: {
    isString: true,
    notEmpty: true
  },
  note: {
    isString: true,
    notEmpty: true
  }
};
