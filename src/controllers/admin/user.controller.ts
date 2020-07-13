import { UserModel } from '../../models/user';
import { IResponseOfAny } from '../../models/interfaces/response'
import { Body, Route, Get, Controller, Post, BodyProp, Put, Delete, SuccessResponse, Tags } from 'tsoa';

@Route('/api/admin')
@Tags('Admin: User Manager')
export class AdminUserController extends Controller {

    /**
     * @GET
     * Get all Users Here
     */
    @Get('/getAllUsers')
    public async getAllUsers(): Promise<IResponseOfAny> {
        try {

            let users: any[] = await UserModel.find({});

            this.setStatus(200);
            return {
                users
            };

        } catch (error) {

            this.setStatus(500);
            return {
                error
            };
        }
    }

    /**
     * @GET
     * Get a Users 
     */
    @Get('/getAUser/{userId}')
    public async getAUser(userId: string): Promise<IResponseOfAny> {
        try {

            let user: any = await UserModel.findOne({ _id: userId });

            this.setStatus(200);
            return {
                user
            };

        } catch (error) {

            this.setStatus(500);
            return {
                error
            };
        }
    }

    /**
     * @DELETE
     * Delete a user
     */
    @Delete('deleteAUser/{userId}')
    public async deleteAUser(userId: string): Promise<IResponseOfAny> {

        let deleteUser: any = await UserModel.findByIdAndRemove(userId)
        if(deleteUser){
            this.setStatus(200);
            return{
                message: "User successfully Deleted"
            }
          
        }
        else{

            this.setStatus(500);
            return{
                message: "An error occured"
            }
        }
    }
}
