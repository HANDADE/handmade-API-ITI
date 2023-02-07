const { check } = require("express-validator");
const bcrypt = require("bcryptjs");
const validator = require("../../middleware/express_validator");
const User = require("../../models/users");

exports.changePasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("please input your current password")
    .custom(async (val, { req }) => {
      if (!(await bcrypt.compare(val, req.user.password))) {
        throw new Error("current password is incorrect");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm Password is required"),
  check("password")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 8 })
    .withMessage("password should be greater than 8 chars")
    .custom(async (val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("confirm password is incorrect");
      }
      return true;
    }),
  validator,
];
