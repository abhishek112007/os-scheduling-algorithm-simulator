class Process {
    constructor(process_id = -1, arrival_time = 0, burst_time = 0, priority = 0) {
        this.process_id = process_id;
        this.arrival_time = arrival_time;
        this.burst_time = burst_time;
        this.remaining_time = burst_time;
        this.priority = priority;
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
        if (p1.priority === p2.priority) {
            return p1.burst_time - p2.burst_time;
        } else {
            return p1.priority - p2.priority;
        }
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
        output += `"priority":${processes[i].priority},`;
        output += `"completion_time":${processes[i].completion_time},`;
        output += `"turnaround_time":${processes[i].turnaround_time},`;
        output += `"waiting_time":${processes[i].waiting_time}`;
        output += "}";

        if (i < n - 1) output += ",";
    }

    output += "]";
    return output;
}

class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(item) {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }

    pop() {
        if (this.size() === 0) return null;

        const root = this.heap[0];
        const end = this.heap.pop();
        if (this.size() > 0) {
            this.heap[0] = end;
            this.heapifyDown(0);
        }

        return root;
    }

    size() {
        return this.heap.length;
    }

    heapifyUp(index) {
        const element = this.heap[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            const parent = this.heap[parentIndex];

            if (this.compare(element, parent) >= 0) break;

            this.heap[index] = parent;
            index = parentIndex;
        }

        this.heap[index] = element;
    }

    heapifyDown(index) {
        const length = this.heap.length;
        const element = this.heap[index];

        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let swap = null;

            if (leftChildIndex < length) {
                const leftChild = this.heap[leftChildIndex];
                if (this.compare(leftChild, element) < 0) {
                    swap = leftChildIndex;
                }
            }

            if (rightChildIndex < length) {
                const rightChild = this.heap[rightChildIndex];
                if (
                    (swap === null && this.compare(rightChild, element) < 0) ||
                    (swap !== null && this.compare(rightChild, this.heap[swap]) < 0)
                ) {
                    swap = rightChildIndex;
                }
            }

            if (swap === null) break;

            this.heap[index] = this.heap[swap];
            index = swap;
        }

        this.heap[index] = element;
    }

    compare(a, b) {
        if (a.priority !== b.priority) {
            return a.priority - b.priority;
        } else if (a.arrival_time !== b.arrival_time) {
            return a.arrival_time - b.arrival_time;
        } else {
            return a.index - b.index;
        }
    }
}

export function priority_preemptive(processes_array) {
    const n = processes_array.length;
    const processes = [];

    for (let i = 0; i < n; ++i) {
        const { arrival_time, burst_time, priority } = processes_array[i];
        processes.push(new Process(i, arrival_time, burst_time, priority));
    }

    // Sort processes based on arrival time
    processes.sort(cmp);

    const pq = new MinHeap();
    let time = processes[0].arrival_time;
    let j = 1;
    const ganttChartInfo = [];
    let initial_time = processes[0].arrival_time;
    const ganntChart_startTime = initial_time;

    pq.push({ priority: processes[0].priority, index: 0, arrival_time: processes[0].arrival_time });

    while (pq.size() > 0) {
        const { index } = pq.pop();
        const currentProcess = processes[index];
        currentProcess.remaining_time--;
        time++;

        ganttChartInfo.push([initial_time, currentProcess.process_id, time]);
        initial_time = time;

        if (currentProcess.remaining_time === 0) {
            currentProcess.setCompletionTime(time);
            currentProcess.setTurnaroundTime(currentProcess.completion_time - currentProcess.arrival_time);
            currentProcess.setWaitingTime(currentProcess.turnaround_time - currentProcess.burst_time);
        } else {
            pq.push({ priority: currentProcess.priority, index, arrival_time: currentProcess.arrival_time });
        }

        while (j < n && processes[j].arrival_time <= time) {
            pq.push({ priority: processes[j].priority, index: j, arrival_time: processes[j].arrival_time });
            j++;
        }

        if (pq.size() === 0 && j < n && processes[j].arrival_time > time) {
            ganttChartInfo.push([initial_time, -1, processes[j].arrival_time]);
            initial_time = processes[j].arrival_time;
            time = processes[j].arrival_time;
            while (j < n && processes[j].arrival_time <= time) {
                pq.push({ priority: processes[j].priority, index: j, arrival_time: processes[j].arrival_time });
                j++;
            }
        }
    }

    // Remove overlapping gantt chart entries
    for (let i = 1; i < ganttChartInfo.length; ++i) {
        if (ganttChartInfo[i][1] === ganttChartInfo[i - 1][1]) {
            ganttChartInfo[i][0] = ganttChartInfo[i - 1][0];
            ganttChartInfo[i - 1][1] = -99;
        }
    }

    const ganntChart_process = ganttChartInfo.filter(info => info[1] !== -99).map(info => ({
        pid: info[1],
        time: info[2]
    }));

    // Computing the average turnaround_time and waiting_time
    let total_turnaround_time = 0;
    let total_waiting_time = 0;
    for (let i = 0; i < n; ++i) {
        total_turnaround_time += processes[i].turnaround_time;
        total_waiting_time += processes[i].waiting_time;
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
