import { TicketModel, ICreateTicket } from '../../models/ticket';
import { IResponseOfAny } from '../../models/interfaces/response'
import { Body, Route, Get, Controller, Post, BodyProp, Put, Delete, Tags } from 'tsoa';
import * as mongoose from 'mongoose';

@Route('/api/customer/')
@Tags('Customer: Tickets')
export class UserTicketController extends Controller {

    /**
     * @POST
     * Get a ticket status
     * @param ICreateTicket
     */
    @Post('/createATicket')
    public async createATicket(@Body() requestBody: ICreateTicket): Promise<IResponseOfAny> {

        const Ticket = new TicketModel(requestBody);
        let message: String;

        await Ticket.save().then(() => {
            this.setStatus(200);
            message = "Support Ticket successfully created"

        }).catch(() => {
            this.setStatus(500);
            message = "Support NOT creeated"

        })

        return {
            message
        };

    }
    
    /**
     * @GET
     * Get all the tickets belonging to a customer
     * @param customerId 
     */
    @Get('getAllCustomerTickets/{customerId}')
    public async getAllCustomerTickets(customerId: string): Promise<IResponseOfAny> {
       
        if(mongoose.Types.ObjectId.isValid(customerId)){

            let tickets = await TicketModel.find({ "userId": mongoose.Types.ObjectId(customerId)}).populate('comments')
            if(tickets){

                this.setStatus(200);
                return {
                    tickets
                };
            }
            else{
                this.setStatus(400);
                return {
                    message:"No ticket found"
                };
            }

        }else{
            this.setStatus(400);
            return {
                message:"Invalid Customer ID"
            };
        }

    }

    /**
     * @GET
     * Get a ticket using ticketId
     * @param ticketId
     */
    @Get('getACustomerTicket/{ticketId}')
    public async getACustomerTicket(ticketId: string): Promise<IResponseOfAny> {
       
        if(mongoose.Types.ObjectId.isValid(ticketId)){

            let tickets = await TicketModel.find({ "_id": mongoose.Types.ObjectId(ticketId)}).populate('comments')
            if(tickets){
                
                this.setStatus(200);
                return {
                    tickets
                };
            }
            else{
                this.setStatus(400);
                return {
                    message:"No ticket found"
                };
            }
            
        }else{
            this.setStatus(400);
            return {
                message:"Invalid Ticket ID supplied"
            };
        }

    }

    /**
     * @GET
     * Get a ticket status
     * @param ticketId
     */
    @Get('getATicketStatus/{ticketId}')
    public async getATicketStatus(ticketId: string): Promise<IResponseOfAny> {
       
        if(mongoose.Types.ObjectId.isValid(ticketId)){

            let ticket: any = await TicketModel.findOne({ "_id": mongoose.Types.ObjectId(ticketId)})
            if(ticket){
                this.setStatus(200);
                return {
                   status: ticket.status
                };
            }else{
                this.setStatus(400);
                return {
                   message: "Ticket with that ID is not found"
                };
            }

        }else{
            this.setStatus(400);
            return {
                message:"Invalid Ticket ID supplied"
            };
        }

    }
    
}
