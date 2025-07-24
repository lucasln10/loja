package com.lojacrysleao.lojacrysleao_api.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/loja")
public class LojaController {

    @GetMapping("/public/status")
    public Map<String, String> getStatus() {
        return Map.of(
            "status", "online",
            "message", "API da Loja Crys Leão funcionando!",
            "timestamp", java.time.LocalDateTime.now().toString()
        );
    }

    @GetMapping("/public/produtos")
    public Map<String, Object> getProdutos() {
        return Map.of(
            "produtos", java.util.List.of(
                Map.of("id", 1, "nome", "Produto 1", "preco", 29.99),
                Map.of("id", 2, "nome", "Produto 2", "preco", 39.99),
                Map.of("id", 3, "nome", "Produto 3", "preco", 49.99)
            )
        );
    }
}
