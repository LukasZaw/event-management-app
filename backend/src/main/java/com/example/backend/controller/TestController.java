package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {
    @GetMapping("/all")
    public String allAccess() {
        return "Public Content. for all";
    }
    @GetMapping("/user")
    public String userAccess() {
        return "User Content.";
    }
}