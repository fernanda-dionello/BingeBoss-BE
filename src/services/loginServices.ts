import User, { UserAttrsResult, UserLoginAttrs } from '../models/usersModel';
import usersValidators from './validators/usersValidators';
import { server } from '../app';

export default {
  async userValidation(user: UserLoginAttrs){
    usersValidators.validateUserLogin(user);
    const userFounded = await User.find({ email: user.email}).exec();
    usersValidators.validateUser(userFounded as unknown as UserAttrsResult[], user);

    const token = server.jwt.sign({
      id: userFounded[0].id,
      firstName: userFounded[0].firstName,
      lastName: userFounded[0].lastName,
      email: userFounded[0].email,
      spoilerProtection: userFounded[0].spoilerProtection
  }, { expiresIn: "24h" });
    return token;
  }
}