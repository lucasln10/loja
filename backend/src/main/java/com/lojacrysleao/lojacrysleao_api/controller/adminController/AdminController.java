package com.lojacrysleao.lojacrysleao_api.controller.adminController;

import com.lojacrysleao.lojacrysleao_api.dto.authDTO.UserDTO;
import com.lojacrysleao.lojacrysleao_api.service.loginAndRegisterService.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/promote/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> promoteUserToAdmin(@PathVariable Long userId) {
        adminService.promoteUserToAdmin(userId);
        return ResponseEntity.ok("Usuário promovido para ADMIN com sucesso");
    }

    @PostMapping("/demote/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> demoteUserToUser(@PathVariable Long userId) {
        adminService.demoteUserToUser(userId);
        return ResponseEntity.ok("Usuário rebaixado para USER com sucesso");
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

}
