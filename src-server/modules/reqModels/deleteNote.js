module.exports = {
  note_id: {
    in: ['params'],
    isString: true,
    notEmpty: true,
    isLength: {
      errorMessage: 'Note ID should be at least 24 char long',
      // Multiple options would be expressed as an array
      options: { min: 24 }
    }
  }
};
