package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;
@Service
public class CustomUserDetailsService  implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByEmail(username); // zamiast findByName
    if (user == null) {
        throw new UsernameNotFoundException("User Not Found with email: " + username);
    }
    return new org.springframework.security.core.userdetails.User(
            user.getEmail(), // lub user.getName() jeśli chcesz logować po nazwie
            user.getPassword(),
            Collections.emptyList()
    );
}
}