package com.lojacrysleao.lojacrysleao_api.controller.testController;

import com.lojacrysleao.lojacrysleao_api.service.emailService.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send-email")
    public ResponseEntity<String> testEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email é obrigatório");
            }

            emailService.sendHtmlEmail(email, "Teste de Email - Loja Crysleão", 
                """
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Teste de Email - Loja Crysleão</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                        .container { background-color: #f9f9f9; padding: 30px; border-radius: 10px; }
                        .header { text-align: center; color: #e74c3c; font-size: 24px; margin-bottom: 20px; }
                        .content { background-color: white; padding: 20px; border-radius: 5px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">Loja Crysleão - Teste de Email</div>
                        <div class="content">
                            <h2>Email de Teste</h2>
                            <p>Este é um email de teste para verificar se o sistema de envio está funcionando.</p>
                            <p><strong>Se você recebeu este email, a configuração está correta!</strong></p>
                            <hr>
                            <p><em>Atenciosamente,<br>Equipe Loja Crysleão</em></p>
                        </div>
                    </div>
                </body>
                </html>
                """);

            return ResponseEntity.ok("Email de teste enviado com sucesso para: " + email);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Erro ao enviar email: " + e.getMessage());
        }
    }
}
