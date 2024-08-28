const { createTransport } = require("nodemailer");

const emailOtp = async (to, subject, otp, type, name) => {
  console.log(otp);
    return new Promise(async (resolve, reject) => {
        const date = new Date();
        const formatDate = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)

        const transporter = await createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        });

        const mailOptions = await {
            from: process.env.EMAIL,
            to: to,
            subject: subject,
            html: `<html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <title>Static Template</title>
      
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          style="
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background: #ffffff;
            font-size: 14px;
          "
        >
          <div
            style="
              max-width: 680px;
              margin: 0 auto;
              padding: 15px 20px 60px;
              background: #FFA447;
              background-repeat: no-repeat;
              background-size: 800px 452px;
              background-position: top center;
              font-size: 14px;
              color: #434343;
            "
          >
            <header>
              <table style="width: 100%;">
                <tbody>
                  <tr style="height: 0;">
                    <td>
                      <img
                        alt=""
                        src="https://i.ibb.co/ZXyy4Qm/png-04.png"
                        height="25px"
                      />
                    </td>
                    <td style="text-align: right;">
                      <span
                        style="font-size: 14px; line-height: 30px; color: black;"
                        >${formatDate}</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </header>
      
            <main>
              <div
                style="
                  margin: 0;
                  margin-top: 33px;
                  padding: 30px 30px 40px;
                  background: #ffffff;
                  border-radius: 30px;
                  text-align: center;
                "
              >
                <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                  <h1
                    style="
                      margin: 0;
                      font-size: 24px;
                      font-weight: 500;
                      color: #1f1f1f;
                    "
                  >
                    Your OTP
                  </h1>
                  <p
                    style="
                      margin: 0;
                      margin-top: 17px;
                      font-size: 16px;
                      font-weight: 500;
                    "
                  >
                     ${name},
                  </p>
                  <p
                    style="
                      margin: 0;
                      margin-top: 17px;
                      font-weight: 500;
                      letter-spacing: 0.56px;
                    "
                  >
                   Use the following OTP
                    to complete the procedure to ${type} your account. OTP is
                    valid for
                    <span style="font-weight: 600; color: #1f1f1f;">3 minutes</span>.
                    Do not share this code with others
                  </p>
                  <p
                    style="
                      margin: 0;
                      margin-top: 60px;
                      font-size: 40px;
                      font-weight: 600;
                      letter-spacing: 25px;
                      color: #ba3d4f;
                    "
                  >
                    ${otp}
                  </p>
                </div>
              </div>
            </main>
      
            <footer
              style="
                width: 100%;
                max-width: 490px;
                margin: 20px auto 0;
                text-align: center;
                border-top: 1px solid #e6ebf1;
              "
            >
              <img style="width: 80px; margin-top: 20px"  src="https://i.ibb.co/WsYdqd7/png-02.png" />
              <p
                style="
                  margin: 0;
                  font-size: 16px;
                  font-weight: 600;
                  color: #434343;
                "
              >
                Galiver
              </p>
              <p style="margin: 0; margin-top: 8px; color: #434343;">
               Dhaka, Bangladesh.
              </p>
              <div style="margin: auto; margin-top: 16px;">
              </div>
              <p style="margin: 0; margin-top: 16px; color: #434343;">
                Copyright © ${new Date().getFullYear()} Galiver. All rights reserved.
              </p>
            </footer>
          </div>
        </body>
      </html>`
        };

        await transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err);
            } else {
                console.log('email sent=>',info?.response);
                resolve(info);
            }
        });
    });

}


module.exports = emailOtp;