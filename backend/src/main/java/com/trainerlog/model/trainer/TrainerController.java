package com.trainerlog.model.trainer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

    private final TrainerRepository trainerRepository;

    @Autowired
    public TrainerController(TrainerRepository trainerRepository) {
        this.trainerRepository = trainerRepository;
    }

    @PostMapping
    public Trainer createTrainer(@RequestBody Trainer trainer) {
        return trainerRepository.save(trainer);
    }

    @GetMapping
    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    @GetMapping("/{id}")
    public Trainer getTrainerById(@PathVariable UUID id) {
        return trainerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));
    }

    @DeleteMapping("/{id}")
    public void deleteTrainer(@PathVariable UUID id) {
        trainerRepository.deleteById(id);
    }
    
    @GetMapping("/ping")
    public String ping() {
        return "✅ Backend is working!";
    }
}
