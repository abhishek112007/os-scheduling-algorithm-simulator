import {round_robin} from './round_robin.js'
import { NextRequest, NextResponse } from 'next/server';

interface Process {
    arrival_time: number;
    burst_time: number;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();                
        const { time_quantum, processes }: { time_quantum:number, processes: Process[] } = body;
        const output = round_robin(processes,time_quantum);        
        return NextResponse.json({ output }, { status: 200 });
    } catch (error) {
        const err = error as Error;
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
