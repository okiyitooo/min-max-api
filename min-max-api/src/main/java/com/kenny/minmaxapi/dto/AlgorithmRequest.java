package com.kenny.minmaxapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;


@Data 
@NoArgsConstructor
@AllArgsConstructor
public class AlgorithmRequest {

    @NotNull(message = "Array cannot be null")
    @NotEmpty(message = "Array cannot be empty")
    private List<Integer> array;

    @NotNull(message = "Queries cannot be null")
    @NotEmpty(message = "Queries cannot be empty")
    private List<Integer> queries;
}