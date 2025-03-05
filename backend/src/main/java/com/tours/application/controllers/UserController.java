package com.tours.application.controllers;

import com.tours.domain.dto.user.UserModifyDTO;
import com.tours.domain.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{email}")
    public ResponseEntity<?> get(@PathVariable String email) {
        return ResponseEntity.ok(userService.get(email));
    }

    @GetMapping
    public ResponseEntity<?> getList() {
        return ResponseEntity.ok(userService.getList());
    }

    @PutMapping("/{email}")
    public ResponseEntity<?> update(@PathVariable String email, @RequestBody UserModifyDTO user) {
        return ResponseEntity.ok(userService.update(email, user));
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<?> delete(@PathVariable String email) {
        return ResponseEntity.ok(userService.delete(email));
    }
}
