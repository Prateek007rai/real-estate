const config = require('../config');

const style= `
           background: #eee;
           padding: 20px;
           border-radius: 20px
`

module.exports.emailTemplate = (email, content, replyTo, subject) => {
    return {
        Source: config.EMAIL_FROM,
        Destination:{
            ToAddresses: [email]
        },
        Message:{
            Body:{
                Html:{
                    Charset:"UTF-8",
                    Data: `
                    <html>
                        <div style="${style}">
                            <h1>Welcome, Live your dream with us</h1>
                            ${content}
                            <p>&copy; ${new Date().getFullYear()} </p>
                        </div>
                    </html>
                    `,
                },
            },
            Subject:{
                Charset:"UTF-8",
                Data: subject
            }
        }
    };
}