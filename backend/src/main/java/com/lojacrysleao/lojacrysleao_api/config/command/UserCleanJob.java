package com.lojacrysleao.lojacrysleao_api.config.command;

import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import com.lojacrysleao.lojacrysleao_api.service.userService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class UserCleanJob {

    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public UserCleanJob(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // Limiar de usuarios inativos (>)
    @Value("${app.dayslimit.userinactivity:7}")
    private int limitDays;

    // Roda todo dia às 3h da manhã
    @Scheduled(cron = "0 0 3 * * *", zone = "America/Sao_Paulo")
    public void deleteOldUnverifiedAccounts() {
        LocalDateTime limitDateTime = LocalDateTime.now().minusDays(limitDays);
        List<User> oldUsers = userRepository.findUnverifiedOlderThan(limitDateTime);

        if (!oldUsers.isEmpty()){
            userRepository.deleteAll(oldUsers);
        }

    }
}
