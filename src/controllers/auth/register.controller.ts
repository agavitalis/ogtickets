import * as Bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as Jwt from 'jsonwebtoken';
import {
  Body,
  Controller,
  Get,
  Post,
  Route,
  Tags,
} from 'tsoa';

import { IResponseOfAny } from '../../models/interfaces/response';
import {
  IUserRegister,
  UserModel,
} from '../../models/user';

dotenv.config();


@Route('/api/register')
@Tags('Auth: User Registration')
export class RegisterController extends Controller {

    @Get('/')
    public async testEndpoint() {
        this.setStatus(201);
        return {
            message: 'cool bear tip'
        }
    }

    /**
     * @POST
     * Register a user
     * @param IUserRegister
     */
    @Post('/')
    public async registerUser(@Body() requestBody: IUserRegister): Promise<IResponseOfAny> {

        let checkUser: any = await UserModel.countDocuments({ email: requestBody.email })
        if (checkUser > 0) {
            this.setStatus(301);
            return {
                "message": "A User with this email already exist",
            };
        } else {

            let hashedPassword: any = await Bcrypt.hash(requestBody.password, 10)

            if (!hashedPassword) {
                this.setStatus(500);
                return {
                    "message": "Internal Server error",
                };
            }
            else {

                let user: any = await new UserModel({

                    firstName: requestBody.firstName,
                    lastName: requestBody.lastName,
                    email: requestBody.email,
                    password: hashedPassword,

                }).save()

                let token: any = await Jwt.sign({ user }, process.env.SECRET, { expiresIn: '12h' });
                this.setStatus(200);
                return {
                    user,
                    token,
                    "message": "User successfully Registered",

                };
            }

        }

    }

}
