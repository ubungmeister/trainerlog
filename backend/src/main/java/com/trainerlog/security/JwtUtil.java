package com.trainerlog.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    private final String SECRET = "superSecretKeyForJWTGenerationMustBeLongEnough!123";
    //TODO: add refreshToken(30 days) + accessToken(1hour)
    private final long EXPIRATION_TIME = 1000 * 60 * 60  * 24; // token for 24 hours

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(UUID userId) {
        return Jwts.builder()
                .setSubject(userId.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public UUID validateTokenAndGetUserId(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        return UUID.fromString(claims.getSubject());
    }
}
