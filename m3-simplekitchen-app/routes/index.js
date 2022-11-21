const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { check, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');
const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', (req, res) => {
  //res.send('It works!');
  res.render('index', { title: 'Simple Kitchen' });
});
//add another get below
router.get('/register', (req, res) => {
 res.render('register', { title: 'Registration form'}); 
})

//another for thankyou
router.get('/thankyou', (req, res) => {
  res.render('thankyou', { title: 'Thank you!'});
});

// change registrations to registrant
router.get('/registrant', basic.check((req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('registrant', { title: 'Listing registrations', registrations });
    })
    .catch(() => { 
      res.send('Sorry! Something went wrong.'); 
    });
}));

router.post('/', 
    [
        check('name')
        .isLength({ min: 1 })
        .withMessage('Please enter a name'),
        check('email')
        .isLength({ min: 1 })
        .withMessage('Please enter an email'),
    ],
    (req, res) => {
        //console.log(req.body);
        const errors = validationResult(req);
        if (errors.isEmpty()) {
          const registration = new Registration(req.body);
          registration.save()
            .then(() => {res.send('Thank you for your registration!');})
            .catch((err) => {
              console.log(err);
              res.send('Sorry! Something went wrong.');
            });
          } else {
            res.render('form', { 
                title: 'Registration form',
                errors: errors.array(),
                data: req.body,
             });
          }
    });

module.exports = router;