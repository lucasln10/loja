package com.lojacrysleao.lojacrysleao_api.service;

import com.lojacrysleao.lojacrysleao_api.repository.UserRepository;

public class UserService {

    public UserService(UserRepository userRepository) {
        userRepository = userRepository;
    }
}
