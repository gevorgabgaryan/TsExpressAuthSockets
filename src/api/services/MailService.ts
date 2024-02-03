import { Service } from 'typedi';
import sgMail from '@sendgrid/mail';
import config from '../../config';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

@Service()
export class MailService {
  public async sendMail(
    recipientEmail: string,
    verificationCode: string,
    subject: string,
    id: string,
  ): Promise<boolean> {
    sgMail.setApiKey(config.sendgridAPIKey);
    const msg = {
      to: recipientEmail,
      from: config.fromEmail,
      subject,
      text: `Your verification code is: ${verificationCode}. Id is ${id}`,
    };

    try {
      const [response] = await sgMail.send(msg);
      if (response.statusCode === 202) {
        console.log(`Mail sent to ${recipientEmail}`);
        return true;
      } else {
        console.error(`Failed to send mail to ${recipientEmail}`);
        return false;
      }
    } catch (e: any) {
      console.error(`Error sending mail: ${e.message}`);
      return false;
    }
  }
}
