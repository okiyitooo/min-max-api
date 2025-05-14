package com.kenny.minmaxapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlgorithmResponse {
    private List<QueryResult> results;
}