class Process {
    constructor(process_id = -1, arrival_time = 0, burst_time = 0) {
        this.process_id = process_id;
        this.arrival_time = arrival_time;
        this.burst_time = burst_time;
        this.remaining_time = burst_time;
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

export function sjf_preemptive(processes_array) {
    const n = processes_array.length;
    const processes = [];

    for (let i = 0; i < n; ++i) {
        const arrival_time = processes_array[i].arrival_time;
        const burst_time = processes_array[i].burst_time;
        processes.push(new Process(i, arrival_time, burst_time));
    }

    // Sort the processes on the basis of arrival time 
    processes.sort(cmp);

    // Array for storing the processes in Gantt Chart
    const ganntChart_process = [];

    // Remaining processes whose burst_time not equal to zero
    let remaining_process = n;
    let completion_time = processes[0].arrival_time;
    let index = 0; // Starting with the first process
    
    // Initial time for printing the Gantt Chart
    let initial_time = completion_time;
    const ganntChart_startTime = completion_time;

    while (remaining_process) {
        let flag = false;

        completion_time += 1;
        processes[index].remaining_time--;

        // Decrease the remaining processes if burst_time is zero
        if (processes[index].remaining_time === 0) {
            processes[index].setCompletionTime(completion_time);
            processes[index].setTurnaroundTime(processes[index].completion_time - processes[index].arrival_time);
            processes[index].setWaitingTime(processes[index].turnaround_time - processes[index].burst_time);
            remaining_process--;

            // Printing the Gantt Chart
            ganntChart_process.push({ pid : processes[index].process_id, time : completion_time});

            // Updating the initial time
            initial_time = completion_time;
            flag = true;
        }

        if (flag) {
            let min_remain = Infinity;
            let min_index = -1;

            for (let i = 0; i < n; ++i) {
                if (processes[i].remaining_time && processes[i].arrival_time <= completion_time && processes[i].remaining_time < min_remain) {
                    min_remain = processes[i].remaining_time;
                    min_index = i;
                }
            }

            // If min_index is equal to -1 it means CPU is in idle state and select the new process
            if (min_index === -1) {
                while (index < n && processes[index].remaining_time === 0) {
                    index++;
                }

                if (index < n) {
                    // Printing the Gantt Chart because CPU is idle
                    ganntChart_process.push({ pid : -1, time : processes[index].arrival_time});

                    // Updating the completion time
                    completion_time = processes[index].arrival_time;

                    // Updating the initial time
                    initial_time = completion_time;
                }

            } else {
                // Context switched and updating the initial_time
                initial_time = completion_time;
                index = min_index;
            }
        } else {
            let context_switch = false;
            let prev_index = index;

            for (let i = 0; i < n; ++i) {
                if (processes[i].remaining_time && processes[i].arrival_time <= completion_time && processes[i].remaining_time < processes[index].remaining_time) {
                    index = i;
                    context_switch = true;
                }
            }

            // If context switch then printing the Gantt Chart
            if (context_switch) {
                ganntChart_process.push({ pid : processes[prev_index].process_id, time : completion_time});

                // Updating the initial time
                initial_time = completion_time;
            }
        }
    }

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
    }

}
