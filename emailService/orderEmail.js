const { createTransport } = require("nodemailer");

const orderEmail = async (data, price, orderNo, total, productName) => {
    // You've successfully signed up. Welcome to Galiver!
    return new Promise(async (resolve, reject) => {
        try {
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
                to: 'aryansohan02@gmail.com',
                subject: `Order No. ${orderNo}`,
                html: `<!DOCTYPE html>
                <html>
                  <head>
                  </head>
                  <body>
                     <h4>Order No. ${orderNo}</h4>
                        <p style="margin: 5px">Order date: ${formatDate}</p>
                     <p style="margin: 5px">Product name: ${productName} </p>
                     <p style="margin: 5px">Product price: ${price} tk</p>
                     <p style="margin: 5px">Customer name: ${data.name}</p>
                        <p style="margin: 5px">Phone: ${data.phone}</p>
                        <p style="margin: 5px">Address: ${data.address}</p>
                        <p style="margin: 5px">District: ${data.district}</p>
                        <p style="margin: 5px">Upazila: ${data.subDistrict}</p>
                        <p style="margin: 5px">Quantity: ${data.quantity}</p>
                         <p style="margin: 5px">color: ${data.color || 'N/A'}</p>
                         <p style="margin: 5px">size: ${data.size || 'N/A'}</p>
                         <p style="margin: 5px">height: ${data.height || 'N/A'}</p>
                         <p style="margin: 5px">width: ${data.width || 'N/A'}</p>
                         <p style="margin: 5px">material: ${data.material || 'N/A'}</p>
                         <p style="margin: 5px">variant: ${data.variant || 'N/A'}</p>
                        <p style="margin: 5px">Delivery charge: ${data.deliveryCharge} tk</p>
                        <p style="margin: 5px">Total: ${total} tk</p>
                        <p style="margin: 5px">Due: ${total} tk</p>
                  </body>
                </html>`
            };

            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('email sent=>', info?.response);
                    resolve(info);
                }
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });

}


module.exports = orderEmail;