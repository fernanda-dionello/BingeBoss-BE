import Joi from "joi";
import { UserAttrsResult, UserLoginAttrs } from "../../models/usersModel";
import { errorHandler } from "./common";
import { createHash } from "crypto";

const UserLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export default {
  validateUserId(id: string) {
    if (!id) {
      errorHandler("Id is missing", "User Id is missing");
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
