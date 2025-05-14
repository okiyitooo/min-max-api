package com.kenny.minmaxapi.service;

import org.springframework.stereotype.Service;
import com.kenny.minmaxapi.dto.AlgorithmRequest;
import com.kenny.minmaxapi.dto.AlgorithmResponse;
import com.kenny.minmaxapi.dto.QueryResult;

import java.util.ArrayList;
import java.util.List;
import java.util.Comparator;

@Service
public class AlgorithmService {
    private SegmentTreeNode [] tree;
    private int arraySize;

    private SegmentTreeNode merge(SegmentTreeNode left, SegmentTreeNode right) {
        if (left == null || right == null) {
            return left == null ? right : left;
        }
        int len = left.len + right.len;
        int prefOnes = left.prefOnes;
        if (left.prefOnes == left.len) {
            prefOnes += right.prefOnes;
        }
        int suffOnes = right.suffOnes;
        if (right.suffOnes == right.len) {
            suffOnes += left.suffOnes;
        }
        int maxOnes = Math.max(left.maxOnes, right.maxOnes);
        maxOnes = Math.max(maxOnes, left.suffOnes + right.prefOnes);
        return new SegmentTreeNode(maxOnes, prefOnes, suffOnes, len);
    }
    private void buildTree( int k, int start, int end) {
        if (start == end) {
            tree[k] = new SegmentTreeNode(0, 0, 0, 1);
            return;
        }
        int mid = start + (end-start) / 2;
        buildTree(2 * k + 1, start, mid);
        buildTree(2 * k + 2, mid + 1, end);
        tree[k] = merge(tree[2 * k + 1], tree[2 * k + 2]);
    }
    private void updateTree(int k, int start, int end, int index) {
        if (start == end) {
            tree[k] = new SegmentTreeNode(1, 1, 1, 1);
            return;
        }
        int mid = start + (end-start) / 2;
        if (index <= mid) {
            updateTree(2 * k + 1, start, mid, index);
        } else {
            updateTree(2 * k + 2, mid + 1, end, index);
        }
        tree[k] = merge(tree[2 * k + 1], tree[2 * k + 2]);
    }
    private int queryMaxRun() {
        if (tree==null||tree.length==0||tree[0]==null) {
            return 0;
        }
        return tree[0].maxOnes;
    }
    public AlgorithmResponse solve (AlgorithmRequest request) {
        List<Integer> array = request.getArray();
        List<Integer> queries = request.getQueries();
        this.arraySize = array.size();
        if (arraySize == 0) {
            List<QueryResult> emptyResults = new ArrayList<>();
            for (int i = 0; i < queries.size(); i++) {
                emptyResults.add(new QueryResult(queries.get(i), 0));
            }
            return new AlgorithmResponse(emptyResults);
        }
        List<int[]> valueIdxPairs = new ArrayList<>();
        for (int i = 0; i < arraySize; i++) {
            valueIdxPairs.add(new int[]{array.get(i), i});
        }
        valueIdxPairs.sort(Comparator.comparingInt(a -> a[0]));
        
        int treeSize = 4 * this.arraySize;
        tree = new SegmentTreeNode[treeSize];
        buildTree(0, 0, arraySize - 1);

        int [] finalAnsForD = new int[arraySize+1];
        int lastLProcessed = 0;
        int pairPointer = 0;
        while (pairPointer < valueIdxPairs.size()) {
            int currentValue = valueIdxPairs.get(pairPointer)[0];
            int tempPointer = pairPointer;
            while (tempPointer < array.size() && valueIdxPairs.get(tempPointer)[0] == currentValue) {
                int idx = valueIdxPairs.get(tempPointer)[1];
                updateTree(0, 0, arraySize-1, idx);
                tempPointer++;
            }
            pairPointer = tempPointer;
            int currentMaxRun = queryMaxRun();
            for (int i = lastLProcessed; i <= currentMaxRun; i++) {
                if (i > arraySize) break;
                finalAnsForD[i] = currentValue;
            }
            lastLProcessed = currentMaxRun;
            if (lastLProcessed == arraySize) {
                break;
            }
        }
        List<QueryResult> results = new ArrayList<>();
        for (int queryD : queries){
            if (queryD < 1 || queryD > arraySize) {
                results.add(new QueryResult(queryD, 0));
                continue;
            } else {
                results.add(new QueryResult(queryD, finalAnsForD[queryD]));
            }
        }
        return new AlgorithmResponse(results);
    }
}
