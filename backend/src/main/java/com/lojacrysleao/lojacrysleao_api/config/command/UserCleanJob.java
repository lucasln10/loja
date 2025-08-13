package com.lojacrysleao.lojacrysleao_api.config.command;

import com.lojacrysleao.lojacrysleao_api.model.user.User;
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import com.lojacrysleao.lojacrysleao_api.service.userService.UserService;
<<<<<<< HEAD
<<<<<<< Updated upstream
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
=======
>>>>>>> 236ef02deb3259031b99b26a0c5e807b880f7dac
=======
=======
import com.lojacrysleao.lojacrysleao_api.repository.userRepository.UserRepository;
import com.lojacrysleao.lojacrysleao_api.model.user.User;
>>>>>>> 39ef745 (corrigindo metodos e adicionando imports)
>>>>>>> Stashed changes
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDateTime;

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

<<<<<<< HEAD
<<<<<<< Updated upstream
        if (!oldUser.isEmpty()){
            userRepository.deleteAll(oldUser);
=======
        if (!oldUsers.isEmpty()){
            userRepository.deleteAll(oldUsers);
>>>>>>> 236ef02deb3259031b99b26a0c5e807b880f7dac
=======
        if (!oldUsers.isEmpty()){
            userRepository.deleteAll(oldUsers);
=======
        if (!oldUser.isEmpty()){
            userRepository.deleteAll(oldUser);
>>>>>>> 39ef745 (corrigindo metodos e adicionando imports)
>>>>>>> Stashed changes
        }

    }
}
