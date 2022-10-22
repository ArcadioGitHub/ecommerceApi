const stripe = require("stripe")(process.env.STRIPE_KEY)
const status = require('http-status');

const createPayment = async (req, res) => {

    stripe.charges.create(
        {
          source: req.body.tokenId,
          amount: req.body.amount,
          currency: "usd",
        },
        (stripeErr, stripeRes) => {
          if (stripeErr) {
            res.status(status.INTERNAL_SERVER_ERROR).json(stripeErr);
          } else {
            res.status(status.OK).json(stripeRes);
          }
        }
      );
}

module.exports = { createPayment };