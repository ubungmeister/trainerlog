package com.trainerlog.util;
import org.springframework.security.core.Authentication;

import java.util.UUID;

import org.springframework.security.core.context.SecurityContextHolder;

import com.trainerlog.security.CustomUserPrincipal;

public class SecurityUtil {

    private SecurityUtil() {
        // Private constructor to prevent instantiation
    }

    public static UUID getAuthorizedTrainerId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserPrincipal user = (CustomUserPrincipal) authentication.getPrincipal();
        return user.getId();
    }
    
}
