import Joi from "joi";
import { UpdateUserAttrs, UserAttrsResult, UserLoginAttrs } from "../../models/usersModel";
import { errorHandler } from "./common";
import { createHash } from "crypto";

const UserLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const UpdateUserSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  oldPassword: Joi.string().when('newPassword', {is: Joi.exist(), then: Joi.required(), otherwise: Joi.optional()}),
  newPassword:  Joi.string().optional(),
  confirmedPassword:  Joi.ref('newPassword'),
})
.with('oldPassword', ['newPassword', 'confirmedPassword'])
.with('confirmedPassword', ['newPassword', 'oldPassword'])
.with('newPassword', ['confirmedPassword', 'oldPassword']);

export default {
  validateUserId(id: string) {
    if (!id) {
      errorHandler("Id is missing", "User Id is missing");
    }
  },

  validateDeleteUserId(id: string, userId: string) {
    if(userId !== id){
      errorHandler("Forbidden", "User can only edit/delete their own profile", 403, "403");
    }
    this.validateUserId(id);
  },

  validateUpdateUserId(id: string, userId: string, user: UpdateUserAttrs) {
    this.validateDeleteUserId(id, userId);
    const result = UpdateUserSchema.validate(user);
    if (result.error) {
      errorHandler(
        "Missing",
        result.error.details.map(({ message }) => message).join(";"),
        400,
        "400"
      );
    }
  },

  validateUpdateUserPassword(user: UpdateUserAttrs, userFound: UserAttrsResult) {
    const encryptPassword = createHash("sha1");
    encryptPassword.update(user.oldPassword || '');

    if (userFound.password !== encryptPassword.digest("hex")) {
      errorHandler("Password incorrect", "Password is incorrect", 401, "401");
    }
  },

  validateUser(userFounded: UserAttrsResult[], user: UserLoginAttrs) {
    if (userFounded.length == 0) {
      errorHandler("Not found", "User not found");
    }
    const encryptPassword = createHash("sha1");
    encryptPassword.update(user.password);

    if (userFounded[0].password !== encryptPassword.digest("hex")) {
      errorHandler("Password incorrect", "Password is incorrect", 401, "401");
    }
  },

  validateUserLogin(userLoginBody: UserLoginAttrs) {
    const result = UserLoginSchema.validate(userLoginBody);
    if (result.error) {
      errorHandler(
        "Missing",
        result.error.details.map(({ message }) => message).join(";"),
        400,
        "400"
      );
    }
  },
};
