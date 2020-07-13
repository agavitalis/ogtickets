import { TicketModel, IChangeTicketStatus } from '../../models/ticket';
import { IResponseOfAny } from '../../models/interfaces/response'
import { Body, Route, Get, Controller, Request, Put, Tags } from 'tsoa';
import * as mongoose from 'mongoose';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as express from 'express';

@Route('/api/support/')
@Tags('Support: Tickets')
export class SupportTicketController extends Controller {

    /**
     * @GET
     * Get all the tickets here
     */
    @Get('getAllTickets')
    public async getAllTickets(): Promise<IResponseOfAny> {

        let tickets: any = await TicketModel.find({}).populate('comments')

        this.setStatus(200);
        return {
            tickets
        };
    }

    /**
     * @GET
     * Get a Ticket by ticket ID
     * @param ticketId 
     */
    @Get('getATicket/{ticketId}')
    public async getATicket(ticketId: string): Promise<IResponseOfAny> {

        if (mongoose.Types.ObjectId.isValid(ticketId)) {

            await TicketModel.findOne({ "_id": mongoose.Types.ObjectId(ticketId) }).populate('comments')
                .then((ticket) => {
                    this.setStatus(200);
                    return {
                        ticket
                    };
                })
                .catch((error) => {
                    this.setStatus(500);
                    return {
                        message: error
                    };
                })

        } else {
            this.setStatus(300);
            return {
                message: "Invalid Ticket ID supplied"
            };
        }

    }

    /**
     * @PUT
     * Change a Ticket Status
     * @param IChangeTicketStatus 
     */
    @Put('changeTicketStatus')
    public async changeTicketStatus(@Body() requestBody: IChangeTicketStatus): Promise<IResponseOfAny> {

        if (mongoose.Types.ObjectId.isValid(requestBody.ticketId)) {

            let ticket: any = await TicketModel.findOne({ "_id": mongoose.Types.ObjectId(requestBody.ticketId) })
            if (ticket) {

                await TicketModel.findOneAndUpdate({ "_id": mongoose.Types.ObjectId(requestBody.ticketId) }, { "status": requestBody.status })

                this.setStatus(200);
                return {
                    message: "Ticket Status Successfully changed"
                };

            } else {

                this.setStatus(300);
                return {
                    message: "Ticket with that ID was not found"
                };
            }

        } else {
            this.setStatus(300);
            return {
                message: "Invalid Ticket ID supplied"
            };
        }
    }

    /**
     * @GET
     * Generate CSV Report
     */
    @Get('generateReportCSV')
    public async generateReportCSV(@Request() request: express.Request){
        //const response = (<any>request).res as express.Response;
        const json2csv = require('json2csv').parse;
        let csv: any;

        const filePath ="./src/exports/report.csv";
        fs.open(filePath, 'w', function () { })

        //grab date here
        let date = new Date(); 
        let todayDate =  new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).toISOString();
        let lastMonthDate =  new Date(date.getUTCFullYear(), date.getUTCMonth()-1, date.getUTCDate()).toISOString();


        let reports:any = await TicketModel.find({"createdAt": {"$gte": lastMonthDate, "$lt": todayDate}}).populate('userId')
        reports = reports.map((ticket) => { return { createdBy: ticket.userId.lastName+" "+ticket.userId.firstName, email: ticket.userId.email, title: ticket.title, body: ticket.body, status: ticket.status, } });

        const headerFields = ['Ticket Created By','email','title', 'body','status'];

        try {
            csv = await json2csv(reports, { headerFields });
        } catch (err) {
            this.setStatus(500)
        }

        fs.writeFile(filePath, csv, function (err) {
            if (err) {
                console.log(err)
            }
        })

        return {
            message: "Your CSV Reports is ready for download"
        };     
      
    }

    /**
     * @GET
     * Download CSV Report
     */
    @Get('downloadReportCSV')
    public async downloadReportCSV(@Request() request: express.Request) {
       
        //console.log((<any>request).res, (<any>request).res === <any>response);
        const mystream = fs.createReadStream('./src/exports/report.csv');
        mystream.pipe(request.res);
        await new Promise((resolve, reject) => {
            mystream.on("end", () => {
                request.res.end();
                resolve();
            });
        });
  
    }

    
    /**
     * @GET
     * Generate PDF Report
     */
    @Get('generateReportPDF')
    public async generateReportPDF(@Request() request: express.Request) {

        const filePath ="./src/exports/report.pdf";
        const doc = new PDFDocument();

        // Pipe its output somewhere, like to a file or HTTP response
        // See below for browser usage
        doc.pipe(fs.createWriteStream(filePath));

        // Embed a font, set the font size, and render some text
        //grab date here
        let date = new Date(); 
        let todayDate =  new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).toISOString();
        let lastMonthDate =  new Date(date.getUTCFullYear(), date.getUTCMonth()-1, date.getUTCDate()).toISOString();

        let reports:any = await TicketModel.find({"createdAt": {"$gte": lastMonthDate, "$lt": todayDate}}).populate('userId')
        //reports = reports.map((report) => { return { id: report._id, title: report.title, body: report.body, status: report.status, } });
        console.log(reports)
        doc.fontSize(8);
        
        doc.text(`OGTickets Reports`, {
            width: 410,
            align: 'center'
            }
        );
        doc.moveDown();
        reports.forEach(report => {
            doc.text(`Ticket created by: ${report.userId.lastName}  ${report.userId.firstName}`, {
                width: 410,
                align: 'left'
                }
            );
            
            doc.moveDown();
            doc.text(`Email: ${report.userId.email}`, {
                width: 410,
                align: 'left'
                }
            );
    
            doc.moveDown();
            doc.text(`Ticket Title: ${report.title}`, {
                width: 410,
                align: 'left'
                }
            );
    
            doc.moveDown();
            doc.text(`Ticket Content: ${report.body}`, {
                width: 410,
                align: 'left'
                }
            );
    
            doc.moveDown();
            doc.text(`Status: ${report.status}`, {
                width: 410,
                align: 'left'
                }
            );

            doc.moveDown();
            doc.moveDown();
        });
       
        // Finalize PDF file
        doc.end();

        return {
            message: "Your PDF Reports is ready for download"
        };

    }

    
    /**
     * @GET
     * Download PDF Report
     */
    @Get('downloadReportPDF')
    public async downloadReportPDF(@Request() request: express.Request) {
       
        //console.log((<any>request).res, (<any>request).res === <any>response);
        const mystream = fs.createReadStream('./src/exports/report.pdf');
        mystream.pipe(request.res);
        await new Promise((resolve, reject) => {
            mystream.on("end", () => {
                request.res.end();
                resolve();
            });
        });
  
    }

    
    // @Get('getCSV')
    // public async getCSV (@Request() request: express.Request){
    //      const response = (<any>request).res as express.Response;
    //     try {
    //         let items: any = await TicketModel.find({});
    //         items = items.map((item) => { return { id: item._id, title: item.title, body: item.body, status: item.status, } });
    //         response.json(items);
    //     } catch (err) {
    //         response.status(500);
    //         response.end();
    //         console.error('Caught error', err);
    //     }
    // }

}
