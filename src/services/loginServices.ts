import User, { UserAttrsResult, UserLoginAttrs } from '../models/usersModel';
import { sign } from 'jsonwebtoken';
import usersValidators from './validators/usersValidators';
import dotenv from "dotenv";
dotenv.config();
const secret = process.env.SECRET || '';

export default {
  async userValidation(user: UserLoginAttrs){
    usersValidators.validateUserLogin(user);
    const userFounded = await User.find({ email: user.email}).exec();
    usersValidators.validateUser(userFounded as unknown as UserAttrsResult[], user);

    const token = sign({
        id: userFounded[0].id,
        firstName: userFounded[0].firstName,
        lastName: userFounded[0].lastName,
    }, secret, {expiresIn: "1h"});
    return token;
  }
}