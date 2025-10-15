import nodemailer from "nodemailer";


export class SendMail{
    constructor(){

    }

    sendEmail(email:string,message:string,subject:any){
        try {
            
            let transport = nodemailer.createTransport({
                service:"gmail",
                auth:{
                    user:"samplem970@gmail.com",
                    pass:"oplt ytyf pgna ijjo"
                }
            })

            let mailOptions = {
                from:"samplem970@gmail.com",
                to:email,
                text:message,
                subject:subject
            }

            transport.sendMail(mailOptions).then(data=>{
                console.log("Email sent successfully",data.response);
                
            }).catch(err=>console.log("Error in sending email",JSON.stringify(err))
            )
        } catch (error) {
            console.log("Error in Email sending",JSON.stringify(error));
            
        }
    }
}