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

export function round_robin(processes_array,time_quantum) {

    const n = processes_array.length;
    const processes = [];    

    for (let i = 0; i < n; ++i) {
        const arrival_time = processes_array[i].arrival_time;
        const burst_time = processes_array[i].burst_time;
        processes.push(new Process(i, arrival_time, burst_time));
    }   

    // Sort the processes based on arrival time
    processes.sort(cmp);

    const ganntChart_process = [];
    let time = processes[0].arrival_time;
    let j = 1;
    const q = [];
    q.push(0);
    let initial_time = time;
    const ganntChart_startTime = initial_time;

    while (q.length > 0) {
        const idx = q.shift();
        const curr = processes[idx];

        if (curr.remaining_time > time_quantum) {
            time += time_quantum;
            curr.remaining_time -= time_quantum;
        } else {
            time += curr.remaining_time;
            curr.remaining_time = 0;
        }

        // Printing the Gantt Chart
        ganntChart_process.push({ pid : processes[idx].process_id, time : time});
        initial_time = time;

        let ideal = true;
        for (; j < processes.length && processes[j].arrival_time <= time; ++j) {
            q.push(j);
            ideal = false;
        }

        let new_time = time;
        if (ideal && j < processes.length) {
            ganntChart_process.push({ pid : -1, time : processes[j].arrival_time});
            new_time = processes[j].arrival_time;
            initial_time = new_time;
            q.push(j);
            j++;
        }

        if (curr.remaining_time === 0) {
            curr.setCompletionTime(time);
            curr.setTurnaroundTime(curr.completion_time - curr.arrival_time);
            curr.setWaitingTime(curr.turnaround_time - curr.burst_time);
        } else {
            q.push(idx);
        }

        time = new_time;
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
    }
}
