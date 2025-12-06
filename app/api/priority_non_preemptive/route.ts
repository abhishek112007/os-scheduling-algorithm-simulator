import {priority_non_preemptive} from './priority_non_preemptive.js'
import { NextRequest, NextResponse } from 'next/server';

interface Process {
    arrival_time: number;
    burst_time: number;
    priority : number;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();        
        const { processes }: { n: number, processes: Process[] } = body;
        const output = priority_non_preemptive(processes);
        return NextResponse.json({ output }, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
