import { TicketModel,IChangeTicketStatus } from '../../models/ticket';
import { IResponseOfAny } from '../../models/interfaces/response'
import { Body, Route, Get, Controller, Post, BodyProp, Put, Delete, Tags } from 'tsoa';
import * as mongoose from 'mongoose';


@Route('/api/admin')
@Tags('Admin: Ticket Manager')
export class AdminTicketController extends Controller {

    /**
     * @GET
     * Get all tickets here
     */
    @Get('getAllTickets')
    public async getAllTickets(): Promise<IResponseOfAny> {
       
        let tickets:any = await TicketModel.find({})

        this.setStatus(200);
        return {
            tickets
        };
    }

    /**
     * @GET
     * Get a ticket with ticketId
     * @param ticketId
     */
    @Get('getATicket/{ticketId}')
    public async getATicket(ticketId: string): Promise<IResponseOfAny> {
       
        if(mongoose.Types.ObjectId.isValid(ticketId)){

            let ticket:any = await TicketModel.findOne({ "_id": mongoose.Types.ObjectId(ticketId)})
            if(ticket){
                this.setStatus(200);
                return {
                    ticket
                };
            }
            else{
                this.setStatus(404);
                return {
                    message:"No tickets found"
                };
            }

        }else{
            this.setStatus(300);
            return {
                message:"Invalid Ticket ID supplied"
            };
        }

    }

    /**
     * @PUT
     * Change a ticket status
     * @param ticketId
     */
    @Put('IChangeTicketStatus')
    public async changeTicketStatus(@Body() requestBody: IChangeTicketStatus): Promise<IResponseOfAny> {
        
        if(mongoose.Types.ObjectId.isValid(requestBody.ticketId)){

           let ticket: any= await TicketModel.findOne({ "_id": mongoose.Types.ObjectId(requestBody.ticketId)})
            if(ticket){

                await TicketModel.findOneAndUpdate({ "_id": mongoose.Types.ObjectId(requestBody.ticketId)},{ "status": requestBody.status })
               
                this.setStatus(200);
                return {
                    message:"Ticket Status Successfully changed"
                };
               
            }else{

                this.setStatus(300);
                return {
                    message:"Ticket with that ID was not found"
                };
            }
            
        }else{
            this.setStatus(300);
            return {
                message:"Invalid Ticket ID supplied"
            };
        }
    }
    
    /**
     * @DELETE
     * Delete a ticket by ticketId
     * @param ticketId
     */
    @Delete('deleteATicket/{ticketId}')
    public async remove(ticketId: string): Promise<IResponseOfAny> {
        if(mongoose.Types.ObjectId.isValid(ticketId)){

            let ticket: any= await TicketModel.findOne({ "_id": mongoose.Types.ObjectId(ticketId)})
            if(ticket){

                await TicketModel.findByIdAndRemove(ticketId)
                
                this.setStatus(200);
                return {
                    message:"Ticket Successfully deleted"
                };

            }else{

                this.setStatus(300);
                return {
                    message:"Ticket with that ID was not found"
                };
            }

        }else{
            this.setStatus(300);
            return {
                message:"Invalid Ticket ID supplied"
            };
        }
    }
}
