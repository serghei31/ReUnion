const express = require('express');
const router = express.Router();
const User = require('../models/users.model');

router.post('/', async function (req, res) {
   try {
      const newUser = await User.create({
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         email: req.body.email,
         mobile: req.body.mobile,
         password: req.body.password,
         passwordConfirm: req.body.passwordConfirm,
         houseNumber: req.body.houseNumber,
         entrance: req.body.entrance,
         apartment: req.body.apartment,
      });

      res.status(200).json({
         status: 'success',
         data: newUser,
      });
   } catch (err) {
      res.status(400).json({
         error: err.message,
      });
   }
});

module.exports = router;
