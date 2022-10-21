const { body } = require('express-validator')

exports.validate = (method) => {
  switch (method) {

    case 'CreateUser': {
      return [
        body('userName').not().isEmpty().isLength({ min: 5 }).isString().withMessage('UserName field can not be Integer'),
        body('userName').not().isEmpty().isLength({ min: 5 }).withMessage('UserName field must have more than 5 characters'),
        body('password').not().isEmpty().isLength({ min: 5 }).withMessage('password  field must have more than 5 characters'),
        body('userEmail').not().isEmpty().isLength({ min: 5 }).isEmail().normalizeEmail().withMessage('UserEmail field should be a valid email'),
      ]
    }

    case 'Login': {
      return [
        body('userName').not().isEmpty().isLength({ min: 5 }).withMessage('UserName field can not be empty'),
        body('userName').not().isEmpty().isLength({ min: 5 }).isString().withMessage('UserName field can not be Integer'),
        body('password').not().isEmpty().isLength({ min: 5 }).withMessage('password  field must have more than 5 characters'),
      ]
    }
  }
}