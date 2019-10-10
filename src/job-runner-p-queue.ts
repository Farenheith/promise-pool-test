import PQueue from 'p-queue';

export class JobRunner<TEntity> {
  private currentIndex = 0;
  private readonly queue: PQueue;

  private constructor(
    private readonly jobs: TEntity[],
    private readonly concurrency: number,
    private readonly getGroupId: (job: TEntity) => any,
    private readonly doWork: (job: TEntity, cache: any) => PromiseLike<any>) {

    this.queue = new PQueue({
      autoStart: true,
      concurrency,
    });
  }

  static create<TEntity>(jobs: TEntity[], concurrency: number,
    getSequenceId: (job: TEntity) => any,
    doWork: (job: TEntity, cache: any) => PromiseLike<any>,
  ) {
    return new JobRunner<TEntity>(jobs, concurrency, getSequenceId, doWork);
  }

  private promiseGenerator() {
    const job = this.jobs[this.currentIndex];
    this.currentIndex++;
    const nextJobs: TEntity[] = [];
    while (this.currentIndex < this.jobs.length
      && this.isFromSameGroup(job, this.jobs[this.currentIndex])
    ) {
      nextJobs.push(this.jobs[this.currentIndex]);
      this.currentIndex++;
    }

    return () => this.doWorkGroup(job, nextJobs);
  }

  private async doWorkGroup(entity: TEntity, nextJobs: TEntity[]) {
    const cache: any = {};
    await this.doWork(entity, cache);

    nextJobs.forEach(entity => this.queue.add(() => this.doWork(entity, cache)));
  }

  private isFromSameGroup(job1: TEntity, job2: TEntity) {
    return this.getGroupId(job1) === this.getGroupId(job2);
  }

  async run() {
    while (this.currentIndex < this.jobs.length) {
      this.queue.add(this.promiseGenerator());
    }

    return this.queue.onIdle();
  }
}
