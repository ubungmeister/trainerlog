package com.trainerlog.security;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse; // import org.springframework.http.HttpMethod;
import com.trainerlog.repository.UserRepository;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException; // import java.util.List;
import java.util.UUID;
import com.trainerlog.model.user.User;
import java.util.List;
import org.springframework.stereotype.Component;
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {


            String token = authorizationHeader.substring(7);
            try{
                //tiken validation and getting user id 
                UUID userId = jwtUtil.validateTokenAndGetUserId(token);
                // getting user from DB
                User user = userRepository.findById(userId)
                    .orElseThrow(()-> new RuntimeException("User not found"));

                // creating CustomUserPrincipal for avoiding LazyInitializationException 
                CustomUserPrincipal customUserPrincipal = new CustomUserPrincipal(
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                );
                // creating authentication token with user details and role
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    customUserPrincipal, 
                    null, 
                    List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                );
                //saving to the security config 
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            }catch(Exception e){
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or expired token");
            }
        }
        filterChain.doFilter(request, response);
    }
}