import delay from 'delay';
import * as moment from 'moment';
import { JobRunner } from './job-runner-p-queue';

interface ParallelJob {
    jobType: number;
    timeToSpent: number;
    jobIndex?: number;
    finished?: boolean;
}

const jobs: ParallelJob[] = [
    {
        jobType: 1,
        timeToSpent: 2000,
    },
    {
        jobType: 1,
        timeToSpent: 3000,
    },
    {
        jobType: 1,
        timeToSpent: 2000,
    },
    {
        jobType: 1,
        timeToSpent: 1500,
    },
    {
        jobType: 2,
        timeToSpent: 300,
    },
    {
        jobType: 2,
        timeToSpent: 900,
    },
    {
        jobType: 2,
        timeToSpent: 1500,
    },
    {
        jobType: 4,
        timeToSpent: 1500,
    },
    {
        jobType: 5,
        timeToSpent: 1800,
    },
    {
        jobType: 5,
        timeToSpent: 2300,
    },
    {
        jobType: 6,
        timeToSpent: 300,
    },
    {
        jobType: 6,
        timeToSpent: 500,
    },
    {
        jobType: 6,
        timeToSpent: 700,
    },
    {
        jobType: 7,
        timeToSpent: 2000,
    },
    {
        jobType: 7,
        timeToSpent: 3000,
    },
    {
        jobType: 7,
        timeToSpent: 2000,
    },
    {
        jobType: 7,
        timeToSpent: 1500,
    },
    {
        jobType: 8,
        timeToSpent: 300,
    },
    {
        jobType: 8,
        timeToSpent: 900,
    },
    {
        jobType: 8,
        timeToSpent: 1500,
    },
    {
        jobType: 9,
        timeToSpent: 1500,
    },
    {
        jobType: 10,
        timeToSpent: 1800,
    },
    {
        jobType: 10,
        timeToSpent: 2300,
    },
    {
        jobType: 11,
        timeToSpent: 300,
    },
    {
        jobType: 11,
        timeToSpent: 500,
    },
    {
        jobType: 11,
        timeToSpent: 700,
    },
    {
        jobType: 12,
        timeToSpent: 1700,
    },
    {
        jobType: 13,
        timeToSpent: 1800,
    },
    {
        jobType: 14,
        timeToSpent: 1900,
    },
    {
        jobType: 15,
        timeToSpent: 1200,
    },
    {
        jobType: 16,
        timeToSpent: 1300,
    },
    {
        jobType: 17,
        timeToSpent: 1400,
    },
    {
        jobType: 18,
        timeToSpent: 1500,
    },
    {
        jobType: 19,
        timeToSpent: 1550,
    }
]
jobs.forEach((x, i) => x.jobIndex = i);

let running = 0;
let maxParallel = 0;
const provider = JobRunner.create<ParallelJob>(jobs, 10,
    x => x.jobType,
    async job => {
        running++;
        if (running > maxParallel) {
            maxParallel = running;
        }
        const date = moment();
        log(`Jobs rodando: ${running}, job ${job.jobIndex!.toString().padStart(2, '0')}: tipo ${job.jobType}, previsto ${job.timeToSpent.toString().padStart(4, '0')} ms, status: iniciado`);
        await delay(job.timeToSpent);
        const diff = moment().diff(date, 'milliseconds').toString().padStart(4, '0');
        running--;
        log(`Jobs rodando: ${running}, job ${job.jobIndex!.toString().padStart(2, '0')}: tipo ${job.jobType}, previsto ${job.timeToSpent.toString().padStart(4, '0')} ms, status: finalizado  após ${diff} ms`);
        job.finished = true;
        return true;
    });

(async () => {
    const initIn = moment().utc();
    log('iniciando...');
    await provider.run();
    log(`Processo finalizado em ${moment().utc().diff(initIn, 'milliseconds')} ms! Número máximo de tasks atingido: ${maxParallel}`);
    jobs.forEach(x => {
        if (!x.finished) {
            log(`Job ${x.jobIndex} não foi finalizado!`);
        }
    });

})();

function log(message: string) {
    console.log(`[${moment().toISOString()}] ${message}`);
}