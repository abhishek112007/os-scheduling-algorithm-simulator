class Process {
    constructor(process_id = -1, arrival_time = 0, burst_time = 0) {
        this.process_id = process_id;
        this.arrival_time = arrival_time;
        this.burst_time = burst_time;
        this.completion_time = 0;
        this.turnaround_time = 0;
        this.waiting_time = 0;
    }

    setCompletionTime(completion_time) {
        this.completion_time = completion_time;
    }

    setTurnaroundTime(turnaround_time) {
        this.turnaround_time = turnaround_time;
    }

    setWaitingTime(waiting_time) {
        this.waiting_time = waiting_time;
    }

    getCompletionTime() {
        return this.completion_time;
    }

    getTurnaroundTime() {
        return this.turnaround_time;
    }

    getWaitingTime() {
        return this.waiting_time;
    }
}

function cmp(p1, p2) {
    if (p1.arrival_time === p2.arrival_time) {
        return p1.burst_time - p2.burst_time;
    } else {
        return p1.arrival_time - p2.arrival_time;
    }
}

function outputAsJSON(processes) {
    const n = processes.length;
    let output = "[";

    for (let i = 0; i < n; ++i) {
        output += "{";
        output += `"process_id":${processes[i].process_id},`;
        output += `"arrival_time":${processes[i].arrival_time},`;
        output += `"burst_time":${processes[i].burst_time},`;
        output += `"completion_time":${processes[i].completion_time},`;
        output += `"turnaround_time":${processes[i].turnaround_time},`;
        output += `"waiting_time":${processes[i].waiting_time}`;
        output += "}";

        if (i < n - 1) output += ",";
    }

    output += "]";
    return output;
}

function heapPush(heap, item) {
    heap.push(item);
    let idx = heap.length - 1;

    while (idx > 0) {
        const parentIdx = Math.floor((idx - 1) / 2);
        
        if (heap[parentIdx][0] < heap[idx][0] || 
            (heap[parentIdx][0] === heap[idx][0] && heap[parentIdx][1] <= heap[idx][1])) {
            break;
        }

        [heap[parentIdx], heap[idx]] = [heap[idx], heap[parentIdx]];
        idx = parentIdx;
    }
}

function heapPop(heap) {
    const top = heap[0];
    const bottom = heap.pop();
    if (heap.length > 0) {
        heap[0] = bottom;
        let idx = 0;

        while (true) {
            const leftChildIdx = 2 * idx + 1;
            const rightChildIdx = 2 * idx + 2;
            let smallestIdx = idx;

            if (leftChildIdx < heap.length && 
                (heap[leftChildIdx][0] < heap[smallestIdx][0] || 
                (heap[leftChildIdx][0] === heap[smallestIdx][0] && heap[leftChildIdx][1] < heap[smallestIdx][1]))) {
                smallestIdx = leftChildIdx;
            }

            if (rightChildIdx < heap.length && 
                (heap[rightChildIdx][0] < heap[smallestIdx][0] || 
                (heap[rightChildIdx][0] === heap[smallestIdx][0] && heap[rightChildIdx][1] < heap[smallestIdx][1]))) {
                smallestIdx = rightChildIdx;
            }

            if (smallestIdx === idx) break;

            [heap[smallestIdx], heap[idx]] = [heap[idx], heap[smallestIdx]];
            idx = smallestIdx;
        }
    }

    return top;
}

export function sjf_non_preemptive(processes_array) {
    const n = processes_array.length;
    const processes = [];

    for (let i = 0; i < n; ++i) {
        const arrival_time = processes_array[i].arrival_time;
        const burst_time = processes_array[i].burst_time;
        processes.push(new Process(i, arrival_time, burst_time));
    }

    processes.sort(cmp);

    const ganntChart_process = [];
    const min_heap = [];

    let completion_time = processes[0].arrival_time;
    const ganntChart_startTime = completion_time;
    let j = 1;

    heapPush(min_heap, [processes[0].burst_time, processes[0].arrival_time, 0]);

    while (min_heap.length > 0) {
        let initial_time = completion_time;

        const curr = heapPop(min_heap)[2];
        const arrival_time = processes[curr].arrival_time;
        const burst_time = processes[curr].burst_time;

        if (arrival_time > completion_time) {
            completion_time = arrival_time;
            ganntChart_process.push({ pid: -1, time: completion_time });
            initial_time = completion_time;
        }

        completion_time += burst_time;
        const turnaround_time = completion_time - arrival_time;
        const waiting_time = turnaround_time - burst_time;
        processes[curr].setCompletionTime(completion_time);
        processes[curr].setTurnaroundTime(turnaround_time);
        processes[curr].setWaitingTime(waiting_time);

        ganntChart_process.push({ pid: processes[curr].process_id, time: completion_time });

        let flag = true;
        while (j < n && processes[j].arrival_time <= completion_time) {
            heapPush(min_heap, [processes[j].burst_time, processes[j].arrival_time, j]);
            flag = false;
            ++j;
        }
        if (flag && j < n) {
            heapPush(min_heap, [processes[j].burst_time, processes[j].arrival_time, j]);
            ++j;
        }
    }

    let total_turnaround_time = 0;
    let total_waiting_time = 0;
    for (let i = 0; i < n; ++i) {
        total_turnaround_time += processes[i].getTurnaroundTime();
        total_waiting_time += processes[i].getWaitingTime();
    }

    const average_turnaround_time = (total_turnaround_time / n).toFixed(2);
    const average_waiting_time = (total_waiting_time / n).toFixed(2);

    const process_output = outputAsJSON(processes);

    return {
        ganntChart_process,
        ganntChart_startTime,
        average_turnaround_time,
        average_waiting_time,
        process_output
    };
}

