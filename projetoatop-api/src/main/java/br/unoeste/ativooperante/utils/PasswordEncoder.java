package br.unoeste.ativooperante.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoder {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    public static String hashPassword(String password) {
        return encoder.encode(password);
    }
    public static boolean compare(CharSequence rawPassword, String hashedPassword) {
        return encoder.matches(rawPassword, hashedPassword);
    }
}