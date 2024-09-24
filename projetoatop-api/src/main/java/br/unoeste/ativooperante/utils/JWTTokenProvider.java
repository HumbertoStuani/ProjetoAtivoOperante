package br.unoeste.ativooperante.utils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JWTTokenProvider {
    private static final SecretKey CHAVE = Keys.hmacShaKeyFor(
            "Pq o PaTo dE BoRRaCHa cAiU nO pOçO dE PiCH3? Pq Um m4C4Co JoGoU El3 d3 C1m4 DA 4rVOrE p3Ns4Nd0 qu3 3r4 c0cô".getBytes(StandardCharsets.UTF_8));

    static public String getToken(long id, int nivel)
    {
        String jwtToken = Jwts.builder()
                .setSubject("usuario")
                .setIssuer("localhost:8080")
                .claim("id", id)
                .claim("nivel", nivel)
                .setIssuedAt(new Date())
                .setExpiration(Date.from(LocalDateTime.now().plusMinutes(15L)
                        .atZone(ZoneId.systemDefault()).toInstant()))
                .signWith(CHAVE)
                .compact();
        return jwtToken;
    }

    static public boolean verifyToken(String token)
    {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(CHAVE)
                    .build()
                    .parseClaimsJws(token).getSignature();
            return true;
        } catch (Exception e) {
            System.out.println(e);
        }
        return false;
    }

    static public Claims getAllClaimsFromToken(String token)
    {
        Claims claims=null;
        try {
            claims = Jwts.parserBuilder()
                    .setSigningKey(CHAVE)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println("Erro ao recuperar as informações (claims)");
        }
        return claims;
    }

}