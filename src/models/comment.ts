import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

interface ICreateComment{
    userId: string,
    ticketId: string,
    title: String,
    body: String
}
 
const CommentSchema = new mongoose.Schema({

    title: String,
    body: String,
    user:{type: Schema.Types.ObjectId, ref: 'User'},
    ticket: {type:Schema.Types.ObjectId, ref: 'Ticket'},

},{
    timestamps: true
});
 
const CommentModel = mongoose.model('Comment', CommentSchema);
 
export { CommentModel, ICreateComment }