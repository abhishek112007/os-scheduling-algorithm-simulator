class Process {
    constructor(process_id = -1, arrival_time = 0, burst_time = 0) {
        this.process_id = process_id;
        this.arrival_time = arrival_time;
        this.burst_time = burst_time;
        this.completion_time = 0;
        this.turnaround_time = 0;
        this.waiting_time = 0;
        this.response_time = 0;
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

    setResponseTime(response_time) {
        this.response_time = response_time;
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

    getResponseTime() {
        return this.response_time;
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
        output += `"waiting_time":${processes[i].waiting_time},`;
        output += `"response_time":${processes[i].response_time}`;
        output += "}";

        if (i < n - 1) output += ",";
    }

    output += "]";
    return output;
}

export function fcfs(processes_array) {
    const n = processes_array.length;
    const processes = [];

    for (let i = 0; i < n; ++i) {
        const arrival_time = processes_array[i].arrival_time;
        const burst_time = processes_array[i].burst_time;
        processes.push(new Process(i, arrival_time, burst_time));
    }

    processes.sort(cmp);

    const ganntChart_process = [];
    
    let completion_time = processes[0].arrival_time;
    const ganntChart_startTime = completion_time;

    for (let i = 0; i < n; ++i) {
        let initial_time = completion_time;

        const arrival_time = processes[i].arrival_time;
        const burst_time = processes[i].burst_time;

        if (arrival_time > completion_time) {
            completion_time = arrival_time;
            ganntChart_process.push({ pid : -1, time : completion_time});
            initial_time = completion_time;
        }

        const response_time = initial_time - arrival_time;

        completion_time += burst_time;
        const turnaround_time = completion_time - arrival_time;
        const waiting_time = turnaround_time - burst_time;

        processes[i].setCompletionTime(completion_time);
        processes[i].setTurnaroundTime(turnaround_time);
        processes[i].setWaitingTime(waiting_time);
        processes[i].setResponseTime(response_time);

        ganntChart_process.push({ pid : processes[i].process_id, time : completion_time});
    }

    let total_turnaround_time = 0;
    let total_waiting_time = 0;
    let total_response_time = 0;

    for (let i = 0; i < n; ++i) {
        total_turnaround_time += processes[i].turnaround_time;
        total_waiting_time += processes[i].waiting_time;
        total_response_time += processes[i].response_time;
    }

    const average_turnaround_time = (total_turnaround_time / n).toFixed(2);
    const average_waiting_time = (total_waiting_time / n).toFixed(2);
    const average_response_time = (total_response_time / n).toFixed(2);

    const process_output = outputAsJSON(processes);
    
    return {
        ganntChart_process,
        ganntChart_startTime,
        average_turnaround_time,
        average_waiting_time,
        average_response_time,
        process_output
    }
}
