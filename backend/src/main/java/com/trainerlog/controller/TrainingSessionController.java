package com.trainerlog.controller;
import lombok.AllArgsConstructor;

import java.util.UUID;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trainerlog.dto.training_session.TrainingSessionRequestDto;
import com.trainerlog.dto.training_session.TrainingSessionResponseDto;
import com.trainerlog.util.SecurityUtil;
import com.trainerlog.service.training_session.TrainingSessionService;
import com.trainerlog.service.training_session.TrainingSessionServiceImpl;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
@RestController
@AllArgsConstructor
@RequestMapping("/api/training-sessions")
public class TrainingSessionController {

    private static final Logger log = LoggerFactory.getLogger(TrainingSessionController.class);
    private final TrainingSessionService trainingSessionService;

    
    @PostMapping("/create")
    public TrainingSessionResponseDto createTrainingSession(@Valid @RequestBody TrainingSessionRequestDto trainingSessionRequestDto) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return trainingSessionService.createTrainingSession(trainingSessionRequestDto, trainerId);

    }
    @PutMapping("/update/{sessionId}")
    public TrainingSessionResponseDto updateTrainingSession(@Valid @RequestBody TrainingSessionRequestDto trainingSessionRequestDto, 
                                                            @PathVariable UUID sessionId) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return trainingSessionService.updateTrainingSession(trainingSessionRequestDto, trainerId, sessionId);
    }
    @DeleteMapping("/delete/{sessionId}")
    public void deleteTrainingSession(@PathVariable UUID sessionId, @RequestParam UUID clientId) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        trainingSessionService.deleteTrainingSession(clientId, trainerId, sessionId);
    }
    @GetMapping("/{sessionId}")
    public TrainingSessionResponseDto getTrainingSessionById(@PathVariable UUID sessionId, @RequestParam UUID clientId) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();
        return trainingSessionService.getTrainingSessionById(sessionId, clientId, trainerId);
    }
    @GetMapping("/all")
    public List<TrainingSessionResponseDto> getAllTrainingSessions(@RequestParam UUID clientId, 
        @RequestParam(required = false) String beforeDate) {
        UUID trainerId = SecurityUtil.getAuthorizedTrainerId();

       LocalDateTime cursorDate = null;
            if (beforeDate != null && !beforeDate.isEmpty()) {
                try {
        cursorDate = LocalDate.parse(beforeDate, DateTimeFormatter.ISO_DATE).atStartOfDay();
    } catch (DateTimeParseException e) {
        log.error("Invalid beforeDate format: {}", beforeDate, e);
    }
}

        log.info("Fetching all training sessions for clientId={}, trainerId={}, cursorDate={}", 
            clientId, trainerId, cursorDate);

        return trainingSessionService.getAllTrainingSessions(clientId, trainerId, cursorDate);
    }

}
