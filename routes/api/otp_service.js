const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const client = require('twilio')(keys.twilioaccountSID, keys.twilioauthToken);

// Load input validation
const validateMobileNumberInput = require("../../validation/phone");

// Load Phone model
const Phone = require("../../models/Phone");

router.post("/sms_verification", (req, res) => {
  // Mobile Number Input validation
  const { errors, isValid } = validateMobileNumberInput(req.body.params);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let number = '+91' + req.body.params.mobile
  console.log(number)

    client.verify.services.create({friendlyName: 'Verification Code:'}).then(service => {
      console.log(service.sid);
      keys.serviceSID = service.sid;
      //send sms_verification
      client.verify.services(keys.serviceSID).verifications
        .create({to: number, channel: 'sms'})
          .then(verification => {
            console.log(verification.sid)
            res.json({
              success: true,
              message: "Otp sent",
              to: verification.to
            });
          }).catch(err => {
            console.log(err)
            return res.status(400).json({ mobile: "Otp sending failed. Please try again"});
          });
    }).catch(err => {
      console.log(err)
      return res.status(400).json({ mobile: "Service creation failed. Please try again"});
    });

})

router.post("/verify_otp", (req, res) => {
  client.verify.services(keys.serviceSID)
      .verificationChecks
      .create({to: req.body.params.to, code: req.body.params.otp_code})
      .then(verification_check => {
        console.log(verification_check.status)
        if(verification_check.status == "approved")
        {
          const payload = {
            id: verification_check.service_sid,
            name: verification_check.to
          };
          // Sign token
          jwt.sign(payload, keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            });
        }
        else {
          return res.status(400).json({ otp: "Wrong Otp"});
        }

      }).catch(err =>{
        console.log(err)
        return res.status(400).json({ otp: "Wrong Otp"});
      })

})

module.exports = router;
