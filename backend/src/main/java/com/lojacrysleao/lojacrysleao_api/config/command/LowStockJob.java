package com.lojacrysleao.lojacrysleao_api.config.command;

import com.lojacrysleao.lojacrysleao_api.model.storage.Storage;
import com.lojacrysleao.lojacrysleao_api.service.storageService.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class LowStockJob {

    private final StorageService storageService;

    public LowStockJob(StorageService storageService) {
        this.storageService = storageService;
    }

    // URL do frontend para construir links (padrão localhost)
    @Value("${app.frontend.base-url:}")
    private String frontendBaseUrl;

    // Lista de emails separados por vírgula
    @Value("${app.alert.lowstock.recipients:}")
    private String recipientsCsv;

    // Limiar de estoque baixo (<=)
    @Value("${app.alert.lowstock.threshold:5}")
    private int lowStockThreshold;

    // Roda a cada 1 minuto
    @Scheduled(cron = "0 * * * * *", zone = "America/Sao_Paulo")
    public void checkLowStorage() {
    // Busca estoques com quantidade <= threshold
    List<Storage> lowStocks = storageService.findLowStock(lowStockThreshold);
        if (lowStocks == null || lowStocks.isEmpty()) return;

        // Monta destinatários a partir das propriedades; se vazio, não envia
        List<String> recipients = Arrays.stream(recipientsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());

        if (recipients.isEmpty()) {
            // Sem destinatários configurados; não dispara envio
            return;
        }

        storageService.alertLowStock(lowStocks, recipients, frontendBaseUrl);
    }
}
