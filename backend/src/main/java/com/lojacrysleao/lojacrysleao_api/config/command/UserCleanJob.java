package com.lojacrysleao.lojacrysleao_api.config.command;

import com.lojacrysleao.lojacrysleao_api.service.userService.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class UserCleanJob {

    @Autowired
    private final UserService userService;

    @Autowired
    private final UserRepository userRepository;

    public UserCleanJob(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    // Limiar de usuarios inativos (>)
    @Value("${app.dayslimit.userinactivity:7}")
    private int limitDate;

    // Roda todo dia às 3h da manhã
    @Scheduled(cron = "0 0 3 * * *", zone = "America/Sao_Paulo")
    public void deleteOldUnverifiedAccounts() {
        List<User> oldUser = userRepository.findUnverifiedOlderThan(limitDate);

        if (!oldUser.isEmpty()){
            userRepository.deleteAll(oldUsers);
        }

    }
}
