import { config } from 'dotenv';
import nodemailer from "nodemailer";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

config({ path: "/app/.env"});

var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_HOST_USER,   //put your mail here
    pass: process.env.EMAIL_HOST_PASSWORD          //password here
  }
});

async function tasksQuery() {
  const tasks = await prisma.task.findMany();
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    const punishment = await prisma.punishment.findFirst({where: {userId: task?.userId}});
    if (task?.dueDate != null && task?.dueDate <= new Date(Date.now()) && !task.finished) {
      const mailOptions = { 
        from: 'starlightproblemsolving@gmail.com',       // sender address
        to: punishment?.recipient,          // reciever address
        subject: punishment?.userName + ' failed to finish: ' + task?.desc,  
        html: "<p>" + punishment?.userName + ' failed to finish: ' + task?.desc + "</p>"
      };
      transporter.sendMail(mailOptions);
    }
  }
}

tasksQuery()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })