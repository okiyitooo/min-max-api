package com.kenny.minmaxapi.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueryResult {
    private int queryD;
    private int answer;
}