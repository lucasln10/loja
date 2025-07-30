package com.lojacrysleao.lojacrysleao_api.service.emailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("noreply@lojacrysleao.com");

            mailSender.send(message);
            System.out.println("Email enviado com sucesso para: " + to);
        } catch (Exception e) {
            System.err.println("Erro ao enviar email para " + to + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Falha ao enviar email: " + e.getMessage());
        }
    }

    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true indica que é HTML
            helper.setFrom("noreply@lojacrysleao.com");

            mailSender.send(message);
            System.out.println("Email HTML enviado com sucesso para: " + to);
        } catch (MessagingException e) {
            System.err.println("Erro ao enviar email HTML para " + to + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Falha ao enviar email HTML: " + e.getMessage());
        }
    }

    public String createVerificationEmailTemplate(String userName, String verificationUrl) {
        return """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirme seu cadastro - Loja Crysleão</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        .container {
                            background-color: #ffffff;
                            padding: 40px;
                            border-radius: 10px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo {
                            font-size: 28px;
                            font-weight: bold;
                            color: #e74c3c;
                            margin-bottom: 10px;
                        }
                        .welcome {
                            font-size: 24px;
                            color: #2c3e50;
                            margin-bottom: 20px;
                        }
                        .content {
                            margin-bottom: 30px;
                        }
                        .button {
                            display: inline-block;
                            background-color: #e74c3c;
                            color: white;
                            padding: 15px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            font-size: 16px;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .button:hover {
                            background-color: #c0392b;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #eee;
                            font-size: 14px;
                            color: #666;
                        }
                        .warning {
                            background-color: #fff3cd;
                            border: 1px solid #ffeaa7;
                            border-radius: 5px;
                            padding: 15px;
                            margin: 20px 0;
                            color: #856404;
                        }
                        .link-fallback {
                            word-break: break-all;
                            background-color: #f8f9fa;
                            padding: 10px;
                            border-radius: 5px;
                            font-family: monospace;
                            font-size: 12px;
                            margin: 10px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">🍰 Loja Crysleão</div>
                            <h1 class="welcome">Bem-vindo, %s!</h1>
                        </div>
                        
                        <div class="content">
                            <p>Obrigado por se cadastrar na <strong>Loja Crysleão</strong>! Estamos muito felizes em tê-lo(a) conosco.</p>
                            
                            <p>Para finalizar seu cadastro e ativar sua conta, por favor clique no botão abaixo:</p>
                            
                            <div style="text-align: center;">
                                <a href="%s" class="button">✅ Confirmar Cadastro</a>
                            </div>
                            
                            <div class="warning">
                                <strong>⏰ Importante:</strong> Este link de verificação é válido por <strong>48 horas</strong>. Após esse período, será necessário solicitar um novo link.
                            </div>
                            
                            <p>Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</p>
                            <div class="link-fallback">%s</div>
                        </div>
                        
                        <div class="footer">
                            <p><strong>Não solicitou este cadastro?</strong><br>
                            Se você recebeu este email por engano, pode ignorá-lo com segurança. Nenhuma conta será criada sem a confirmação.</p>
                            
                            <p style="margin-top: 20px;">
                                <strong>Atenciosamente,</strong><br>
                                Equipe Loja Crysleão<br>
                                <em>Criando momentos doces para você! 🎂</em>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(userName, verificationUrl, verificationUrl);
    }

    public String createPasswordResetEmailTemplate(String userName, String resetUrl) {
        return """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Redefinir senha - Loja Crysleão</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        .container {
                            background-color: #ffffff;
                            padding: 40px;
                            border-radius: 10px;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .logo {
                            font-size: 28px;
                            font-weight: bold;
                            color: #e74c3c;
                            margin-bottom: 10px;
                        }
                        .title {
                            font-size: 24px;
                            color: #2c3e50;
                            margin-bottom: 20px;
                        }
                        .content {
                            margin-bottom: 30px;
                        }
                        .button {
                            display: inline-block;
                            background-color: #3498db;
                            color: white;
                            padding: 15px 30px;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: bold;
                            font-size: 16px;
                            margin: 20px 0;
                            text-align: center;
                        }
                        .button:hover {
                            background-color: #2980b9;
                        }
                        .footer {
                            margin-top: 30px;
                            padding-top: 20px;
                            border-top: 1px solid #eee;
                            font-size: 14px;
                            color: #666;
                        }
                        .warning {
                            background-color: #f8d7da;
                            border: 1px solid #f5c6cb;
                            border-radius: 5px;
                            padding: 15px;
                            margin: 20px 0;
                            color: #721c24;
                        }
                        .link-fallback {
                            word-break: break-all;
                            background-color: #f8f9fa;
                            padding: 10px;
                            border-radius: 5px;
                            font-family: monospace;
                            font-size: 12px;
                            margin: 10px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">🍰 Loja Crysleão</div>
                            <h1 class="title">🔐 Redefinir Senha</h1>
                        </div>
                        
                        <div class="content">
                            <p>Olá, <strong>%s</strong>!</p>
                            
                            <p>Recebemos uma solicitação para redefinir a senha da sua conta na Loja Crysleão.</p>
                            
                            <p>Para criar uma nova senha, clique no botão abaixo:</p>
                            
                            <div style="text-align: center;">
                                <a href="%s" class="button">🔓 Redefinir Senha</a>
                            </div>
                            
                            <div class="warning">
                                <strong>⏰ Importante:</strong> Este link é válido por <strong>24 horas</strong>. Após esse período, será necessário solicitar um novo link.
                            </div>
                            
                            <p>Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:</p>
                            <div class="link-fallback">%s</div>
                        </div>
                        
                        <div class="footer">
                            <p><strong>Não solicitou esta redefinição?</strong><br>
                            Se você não fez esta solicitação, pode ignorar este email com segurança. Sua senha atual permanecerá inalterada.</p>
                            
                            <p style="margin-top: 20px;">
                                <strong>Atenciosamente,</strong><br>
                                Equipe Loja Crysleão<br>
                                <em>Criando momentos doces para você! 🎂</em>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(userName, resetUrl, resetUrl);
    }
}
