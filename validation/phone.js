const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateMobileNumberInput(data) {
  let errors = {};
  console.log(data)
// Convert empty fields to an empty string so we can use validator functions
  data.mobile = !isEmpty(data.mobile) ? data.mobile : "";

// Mobile checks
  if (Validator.isEmpty(data.mobile)) {
    errors.mobile = "Mobile number is required";
  } else if (!Validator.isMobilePhone(data.mobile)) {
    errors.mobile = "Mobile number is invalid";
  }

return {
    errors,
    isValid: isEmpty(errors)
  };
};
