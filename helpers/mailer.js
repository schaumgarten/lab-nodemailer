const mailer = require('nodemailer');


const transporter = mailer.createTransport({
  service: "Gmail",
  auth:{
      user: process.env.EMAIL,
      pass: process.env.SECURE
  }
});

const hbs          = require(`hbs`),
      fs           = require(`fs`),
      generateHTML = (filename, options = {}) => {
        const html = hbs.compile(fs.readFileSync((__dirname, `./views/${filename}.hbs`), `utf8`));
        return html(options);
      };

exports.send = options => {
  const html        = generateHTML(options.filename, options);
  const mailOptions = {
    from:    'Verify Status Service',
    to:      options.email,
    subject: 'Please confirm your signup', 
    text:    `Hola ${options.username}, por favor confirma tu registro`,
    html
  };
  return transporter.sendMail(mailOptions);
};