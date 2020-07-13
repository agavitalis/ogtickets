import { TicketModel } from '../../models/ticket';
import { UserModel } from '../../models/user';
import { CommentModel, ICreateComment } from '../../models/comment';
import { IResponseOfAny } from '../../models/interfaces/response'
import { Body, Route, Controller, Put, Tags } from 'tsoa';
import * as mongoose from 'mongoose';

@Route('/api/customer/')
@Tags('Customer: Comments')
export class UserCommentController extends Controller {

    /**
     * @POST
     * Comment on a ticket
     * @param ICreateTicket
     */
    @Put('/commentOnATicket')
    public async commentOnATicket(@Body() requestBody: ICreateComment): Promise<IResponseOfAny> {

        if (mongoose.Types.ObjectId.isValid(requestBody.ticketId)) {

            let ticket = await TicketModel.findOne({ "_id": mongoose.Types.ObjectId(requestBody.ticketId) })
            if (ticket) {

                //check if there have ever been a comment on this ticket
                let commentCount = await CommentModel.countDocuments({ 'ticketId': requestBody.ticketId })
                if (commentCount > 0) {
                    let saveComment = await new CommentModel({

                        title: requestBody.title,
                        body: requestBody.body,
                        user: requestBody.userId,

                    }).save()
                    if (saveComment) {

                        let updateTicket = await TicketModel.update({ "_id": mongoose.Types.ObjectId(requestBody.ticketId) },
                            { $push: { "comments": saveComment._id } }, { new: true })

                        if (updateTicket) {
                            this.setStatus(200);
                            return {
                                message: "Comment successfull"
                            };

                        } else {

                            this.setStatus(500);
                            return {
                                message: "An error occured"
                            };
                        }

                    } else {

                        this.setStatus(500);
                        return {
                            message: "Comment could not be saved"
                        };
                    }
                }else{
                    this.setStatus(401);
                    return {
                        message: "You CANNOT comment on this ticket until a staff have commented on it"
                    };
                }

            }
        } else {

            this.setStatus(400);
            return {
                message: "A Ticket with that ID was not found"
            };

        }

    }

}