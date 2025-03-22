import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";

class Email {
  constructor(user, claim = null, url = null, booking = null, reason = null) {
    this.to = user.email;
    this.firstname = user.firstname;
    this.password = user.password;
    this.email = user.email;
    this.from = 'cedrickhakuzimana@gmail.com'; // Hardcoded sender address
    this.url = url;
    this.message = claim ? claim.message : '';  // Default empty message if not provided
   
  }

  // Create a transporter object using SMTP transport
  createTransport() {
    return nodemailer.createTransport({
      service: 'gmail', // or your email service provider
      auth: {
        user: 'cedrickhakuzimana@gmail.com', // Hardcoded email user
        pass: 'ksmg wyea tfzx aazu', // Hardcoded email password or app password
      },
    });
  }

  // Send the actual email
  async send(template, subject, title) {
    const transporter = this.createTransport();

    // 1) Render HTML based on an ejs template
    const html = await ejs.renderFile(
      path.join(__dirname, `./../views/email/${template}.ejs`),
      {
        firstname: this.firstname,
        password: this.password,
        email: this.email,
        url: this.url,
        message: this.message,
        
      }
    );

    // 2) Define email options
    const mailOptions = {
      to: this.to, // Recipient's email address
      from: this.from, // Sender's email address (hardcoded)
      subject,
      text: title, // Fallback text version of the email
      html, // HTML version of the email
    };

    // 3) Send email
    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent");
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async sendAccountAdded() {
    await this.send("accountAdded", "Welcome! Now", "Welcome to our service.");
  }

  async sendNotification() {
    await this.send("Notification", "Notification", "Notification");
  }


  async sendResetPasswordCode() {
    await this.send("ResetPasswordCode", "Your Reset Password Code", "Here is your reset password code.");
  }
}


export default Email;
