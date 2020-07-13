import { CommentModel,ICreateComment } from '../../models/comment';
import { IResponseOfAny } from '../../models/interfaces/response'
import { Body, Route, Get, Controller, Post, Security, Put, Delete, Tags } from 'tsoa';
import * as mongoose from 'mongoose';


@Route('/api/admin')
@Tags('Admin: Comments Manager')
export class AdminCommentController extends Controller {

    /**
     * @GET
     * Get all comments here
     */
    @Security("jwt")
    @Get('getAllComments')
    public async getAllComments(): Promise<IResponseOfAny> {
       
        let comments:any = await CommentModel.find({}).populate('user')

        this.setStatus(200);
        return {
            comments
        };
    }

    /**
     * @GET
     * Get a comment with commentId
     * @param commentId
     */
    @Get('getAComment/{commentId}')
    public async getAComment(commentId: string): Promise<IResponseOfAny> {
       
        if(mongoose.Types.ObjectId.isValid(commentId)){

            let comment:any = await (await CommentModel.findOne({ "_id": mongoose.Types.ObjectId(commentId)})).populate('user')
            if(comment){

                this.setStatus(200);
                return {
                    comment
                };
            }
            else{
                this.setStatus(404);
                return {
                    message:"No comments found"
                };
            }

        }else{
            this.setStatus(300);
            return {
                message:"Invalid Comment ID supplied"
            };
        }

    }
    
    /**
     * @DELETE
     * Delete comment with commentId
     * @param commentId
     */
    @Delete('deleteAComment/{commentId}')
    public async remove(commentId: string): Promise<IResponseOfAny> {
        if(mongoose.Types.ObjectId.isValid(commentId)){

            let comment: any= await CommentModel.findOne({ "_id": mongoose.Types.ObjectId(commentId)})
            if(comment){

                await CommentModel.findByIdAndRemove(commentId)
                
                this.setStatus(200);
                return {
                    message:"Comment Successfully deleted"
                };

            }else{

                this.setStatus(300);
                return {
                    message:"Comment with that ID was not found"
                };
            }

        }else{
            this.setStatus(300);
            return {
                message:"Invalid Comment ID supplied"
            };
        }
    }
}
