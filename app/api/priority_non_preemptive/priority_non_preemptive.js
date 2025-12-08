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
        this.response_time = 0;
    }

    set_completion_time(completion_time) {
        this.completion_time = completion_time;
    }

    set_turnaround_time(turnaround_time) {
        this.turnaround_time = turnaround_time;
    }

    set_waiting_time(waiting_time) {
        this.waiting_time = waiting_time;
    }

    set_response_time(response_time) {
        this.response_time = response_time;
    }

    get_completion_time() {
        return this.completion_time;
    }

    get_turnaround_time() {
        return this.turnaround_time;
    }

    get_waiting_time() {
        return this.waiting_time;
    }

    get_response_time() {
        return this.response_time;
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
        output += `"waiting_time":${processes[i].waiting_time},`;
        output += `"response_time":${processes[i].response_time}`;
        output += "}";

        if (i < n - 1) output += ",";
    }

    output += "]";
    return output;
}

export function priority_non_preemptive(processes_array) {
    const n = processes_array.length;
    const processes = [];

    for (let i = 0; i < n; ++i) {
        const arrival_time = processes_array[i].arrival_time;
        const burst_time = processes_array[i].burst_time;
        const priority = processes_array[i].priority;
        processes.push(new Process(i, arrival_time, burst_time, priority));
    }

    // Sort the processes on the basis of arrival time 
    processes.sort(cmp);
    const ganntChart_process = [];

    // Computing the completion_time, turnaround_time and waiting_time of each process on the basis of priority
    let completion_time = processes[0].arrival_time;
    const ganntChart_startTime = completion_time;
    let index = 0;
    let remaining = n;

    while (remaining) {
        // Maintaining initial_time for printing the Gantt Chart
        let initial_time = completion_time;

        let arrival_time = processes[index].arrival_time;
        let burst_time = processes[index].burst_time;
        let priority = processes[index].priority;

        completion_time += burst_time;
        let turnaround_time = completion_time - arrival_time;
        let waiting_time = turnaround_time - burst_time;
        let response_time = waiting_time; // For non-preemptive, response time equals waiting time
        processes[index].set_completion_time(completion_time);
        processes[index].set_turnaround_time(turnaround_time);
        processes[index].set_waiting_time(waiting_time);
        processes[index].set_response_time(response_time);
        processes[index].remaining_time = 0;
        remaining--;

        // Printing the Gantt Chart
        ganntChart_process.push({ pid : processes[index].process_id, time : completion_time});

        // If no process is remaining, then break
        if (!remaining) break;

        // Finding the next process with the least priority and remaining_time != 0
        let min_priority = Number.MAX_VALUE;
        let min_index = -1;
        for (let i = 0; i < n; ++i) {
            if (processes[i].remaining_time !== 0 && processes[i].arrival_time <= completion_time && processes[i].priority < min_priority) {
                min_priority = processes[i].priority;
                min_index = i;
            }
        }

        if (min_index === -1 && remaining) {
            // Find the first process where remaining_time != 0 and there is CPU idle state
            for (let i = 0; i < n; ++i) {
                if (processes[i].remaining_time !== 0) {
                    min_index = i;

                    // Printing the Gantt Chart
                    ganntChart_process.push({ pid : -1, time : processes[i].arrival_time});

                    // Update the completion time
                    completion_time = processes[i].arrival_time;
                    break;
                }
            }
        }

        // Updating the index
        index = min_index;
    }

    // Computing the average turnaround_time, waiting_time, and response_time
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

