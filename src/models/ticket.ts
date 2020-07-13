import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

interface ICreateTicket{
    userId: string,
    title: String,
    body: String,
}

interface IChangeTicketStatus{   
    ticketId: string,
    status: String,
}

const TicketSchema = new mongoose.Schema({

    userId:{type: Schema.Types.ObjectId, ref: 'User'},
    status: {
        type: String,
        enum : ['unResolved','inProgress','resolved'],
        default: 'unResolved'
    },
    title: {type: String},
    body: {type: String},
    resolvedOn: {type: Date},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}]

},{
    timestamps: true
});
 
const TicketModel = mongoose.model('Ticket', TicketSchema);
 
export { TicketModel, ICreateTicket,IChangeTicketStatus}

