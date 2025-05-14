package com.kenny.minmaxapi.service;

class SegmentTreeNode {
    int maxOnes;    // Maximum run of 1s in the range [start, end]
    int prefOnes;   // Length of prefix of 1s
    int suffOnes;   // Length of suffix of 1s
    int len;        // Length of the range (end - start + 1)

    SegmentTreeNode(int maxOnes, int prefOnes, int suffOnes, int len) {
        this.maxOnes = maxOnes;
        this.prefOnes = prefOnes;
        this.suffOnes = suffOnes;
        this.len = len;
    }
}