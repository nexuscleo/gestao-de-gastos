import nodemailer from "nodemailer";

// Configura o transporter do Nodemailer
// Se existirem credenciais SMTP no .env, utiliza o serviço real (ex: Gmail, SendGrid, etc.)
// Caso contrário, opera em modo desenvolvimento seguro (registra no console e devolve o código)
export async function sendEmail({ to, subject, html, text }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    return transporter.sendMail({
      from: SMTP_FROM || `"FinançasPro" <${SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
  }

  // Modo Simulado de Desenvolvimento (útil para testes imediatos sem configurar SMTP externo)
  console.log("\n==================================================");
  console.log(`📧 [EMAIL SIMULADO] Para: ${to}`);
  console.log(`📌 Assunto: ${subject}`);
  console.log(`📝 Conteúdo:`);
  console.log(text || html);
  console.log("==================================================\n");

  return { messageId: "simulated_" + Date.now(), simulated: true };
}
