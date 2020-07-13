import { UserModel, IUserLogin } from '../../models/user';
import { IResponseOfAny } from '../../models/interfaces/response'
import { Body, Route, Controller, Post, Tags } from 'tsoa';
import * as Jwt from "jsonwebtoken";
import * as Bcrypt from'bcryptjs';
import * as  dotenv from 'dotenv';
dotenv.config();

@Route('/api/login')
@Tags('Auth: User Login')
export class LoginController extends Controller {

    /**
     * @POST
     * Login a user
     * @param IUserRegister
     */
    @Post('/')
    public async loginUser(@Body() requestBody: IUserLogin): Promise<IResponseOfAny> {

        let user:any = await UserModel.findOne({ email: requestBody.email }).select('+password')

        if (user) {
            let userPassword:any = Bcrypt.compareSync(requestBody.password, user.password)

            if (userPassword) {

                let token:any = await Jwt.sign({user},process.env.SECRET, { expiresIn: '12h' });

                this.setStatus(200);
                return {
                    user,
                    token,
                    "message":"User authentication successful",
                };

            }else{
                
                this.setStatus(302);
                return {
                    "message":"Invalid user credentials",
                };
            }
        }else{
          
            this.setStatus(302);
            return {
                "message":"User not registered",
            };

        }

    }

}
