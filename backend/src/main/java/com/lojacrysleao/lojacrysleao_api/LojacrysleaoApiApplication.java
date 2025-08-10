package com.lojacrysleao.lojacrysleao_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LojacrysleaoApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(LojacrysleaoApiApplication.class, args);
	}

}
