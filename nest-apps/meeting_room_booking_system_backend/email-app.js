const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 587,
  secure: false,
  auth: {
    user: '976275430@qq.com',
    pass: 'lbussqvqnakabeji',
  },
});

async function main() {
  const info = await transporter.sendMail({
    from: '"来自" <tannnb@qq.com>',
    to: 'tannnb@qq.com',
    subject: 'Hello 111',
    text: 'xxxxx',
  });
  console.log('info', info);
}

main().catch(console.error);
