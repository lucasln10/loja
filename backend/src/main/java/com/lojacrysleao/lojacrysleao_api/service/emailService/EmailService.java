package com.lojacrysleao.lojacrysleao_api.service.emailService;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendEmail(String to, String subject, String body) {
        // Aqui entra a lógica com JavaMailSender ou log apenas
        System.out.println("Email para: " + to);
        System.out.println("Assunto: " + subject);
        System.out.println("Mensagem: " + body);
    }
}
