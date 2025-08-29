package com.trainerlog.controller;
import lombok.AllArgsConstructor;

import java.util.UUID;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.trainerlog.dto.training_session.TrainingSessionRequestDto;
import com.trainerlog.dto.training_session.TrainingSessionResponseDto;
import com.trainerlog.util.SecurityUtil;
import com.trainerlog.service.training_session.TrainingSessionService;
import com.trainerlog.service.training_session.TrainingSessionServiceImpl;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDate;
import java.time.ZoneId;
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
public List<TrainingSessionResponseDto> getAllTrainingSessions(
    @RequestParam UUID clientId,
    @RequestParam(required = false) String fromDate, // YYYY-MM-DD
    @RequestParam(required = false) String toDate    // YYYY-MM-DD
) {
  UUID trainerId = SecurityUtil.getAuthorizedTrainerId();

  if ((fromDate == null || fromDate.isBlank()) && (toDate == null || toDate.isBlank())) {
    ZoneId zone = ZoneId.of("Europe/Prague"); 
    LocalDate today = LocalDate.now(zone);
    LocalDate start = today.withDayOfMonth(1);
    LocalDate end   = today.withDayOfMonth(today.lengthOfMonth());
    return trainingSessionService.getAllTrainingSessions(clientId, trainerId, start, end);
  }

  try {
    LocalDate start = LocalDate.parse(fromDate, DateTimeFormatter.ISO_DATE);
    LocalDate end   = LocalDate.parse(toDate,   DateTimeFormatter.ISO_DATE);
    if (start.isAfter(end)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "`fromDate` must be <= `toDate`");
    }
    return trainingSessionService.getAllTrainingSessions(clientId, trainerId, start, end);
  } catch (DateTimeParseException e) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format. Use YYYY-MM-DD.", e);
  }
}

}
//telefo x - new phone - sim works 
// six x - new sim, old phone - I cant wirite on whatsapp 
//telefo stolen - new phone, new sim - I cant write on whatsapp
// last time at 21:30 online - so 