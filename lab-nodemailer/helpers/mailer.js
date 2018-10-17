const mailer = require('nodemailer');


const transporter = mailer.createTransport({
  service: "Gmail",
  auth:{
      user: "lenguasbachilleratouic@gmail.com",
      pass: "lenguasbachuic"
  }
});

exports.send = (options)=> {
  const mailOptions = {
    from: 'Verify Status Service',
    to: options.email,
    subject: 'Please confirm your signup', 
    text: `Hola ${options.username}, por favor confirma tu registro`,
    html: '<b><a href="http://localhost:3000/auth/confirm/'+options.hashName+'">Presiona aqui para confirmar</></b>'
  };
  return transporter.sendMail(mailOptions);
}; 