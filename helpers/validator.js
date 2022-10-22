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

    case 'CreateProduct': {
      return [
        body('title').not().isEmpty().isLength({ min: 5 }).withMessage('Title field can not be empty'),
        body('description').not().isEmpty().isLength({ min: 5 }).isString().withMessage('Description field must have more than 5 characters'),
        body('img').not().isEmpty().isLength({ min: 1 }).withMessage('Img field can not be empty'),
        body('price').not().isEmpty().isLength({ min: 1 }).withMessage('Price field can not be empty'),
        body('price').not().isEmpty().isLength({ min: 1 }).isNumeric().withMessage('Price field must be a number'),
      ]
    }

    case 'CreateCart': {
      return [
        body('userId').not().isEmpty().isLength({ min: 5 }).withMessage('userId field can not be empty'),
        body('products').not().isEmpty().isArray(),
      ]
    }

    case 'CreateOrder': {
      return [
        body('userId').not().isEmpty().isLength({ min: 5 }).withMessage('userId field can not be empty'),
        body('products').not().isEmpty().isArray(),
        body('amount').not().isEmpty().isLength({ min: 1 }).withMessage('amount field can not be empty'),
        body('address').not().isEmpty().isLength({ min: 1 }).withMessage('address field can not be empty'),
      ]
    }
  }
}