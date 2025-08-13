package com.lojacrysleao.lojacrysleao_api.config.command;

import com.lojacrysleao.lojacrysleao_api.service.userService.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class UsersInativeOneWeek {

    private final UserService userService;

    public UsersInativeOneWeek(UserService userService) {
        this.userService = userService;
    }

    // Limiar de usuarios inativos (>)
    @Value("${app.dayslimit.userinactivity:7}")
    private int daysLimit;

    // isso roda todos os dias as 1 da manha.
    @Scheduled(cron = "0 0 1 * * *", zone = "America/Sao_Paulo")
    public void inativeUsers() {

    }
}
