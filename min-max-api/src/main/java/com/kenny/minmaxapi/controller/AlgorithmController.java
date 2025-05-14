package com.kenny.minmaxapi.controller;

import com.kenny.minmaxapi.dto.AlgorithmRequest;
import com.kenny.minmaxapi.dto.AlgorithmResponse;
import com.kenny.minmaxapi.service.AlgorithmService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/algorithm")
@Validated 
public class AlgorithmController {

    private final AlgorithmService algorithmService;

    @Autowired
    public AlgorithmController(AlgorithmService algorithmService) {
        this.algorithmService = algorithmService;
    }

    @PostMapping("/solve")
    public ResponseEntity<?> solveAlgorithm(@Valid @RequestBody AlgorithmRequest request) {
        
        if (request.getArray() != null) {
            for (int d : request.getQueries()) {
                if (d < 1 || d > request.getArray().size()) {
                    return ResponseEntity.badRequest().body("Invalid query value: " + d);
                }
            }
        }

        AlgorithmResponse response = algorithmService.solve(request);
        return ResponseEntity.ok(response);
    }

    // health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Algorithm API is healthy!");
    }
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ResponseEntity<String> handleConstraintViolationException(ConstraintViolationException e) {
        return new ResponseEntity<>("Validation error: " + e.getMessage(), HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ResponseEntity<Object> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        List<String> errors = e.getBindingResult()
                               .getFieldErrors()
                               .stream()
                               .map(error -> error.getField() + ": " + error.getDefaultMessage())
                               .toList();
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}