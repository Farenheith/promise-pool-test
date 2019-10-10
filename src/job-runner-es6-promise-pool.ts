import * as PromisePool from 'es6-promise-pool';

interface Chain<TEntity> {
  entity: TEntity;
  cache: any;
}

export class JobRunner<TEntity> {
  private currentIndex = 0;
  private chaineds: Chain<TEntity>[] = [];
  private chainedIndex = 0;

  private constructor(
    private readonly jobs: TEntity[],
    private readonly concurrentJobs: number,
    private readonly getGroupId: (job: TEntity) => any,
    private readonly doJob: (job: TEntity, cache: any) => PromiseLike<any>) {

  }

  static create<TEntity>(jobs: TEntity[], concurrentJobs: number,
    getSequenceId: (job: TEntity) => any,
    doJob: (job: TEntity, cache: any) => PromiseLike<any>,
  ) {
    return new JobRunner<TEntity>(jobs, concurrentJobs, getSequenceId, doJob);
  }

  private promiseGenerator() {
    const result = this.chainedPromiseGenerator();
    if (result) {
      return result;
    }

    if (this.currentIndex < this.jobs.length) {
      const job = this.jobs[this.currentIndex];
      this.currentIndex++;
      const nextJobs: TEntity[] = [];
      while (this.currentIndex < this.jobs.length
        && this.isFromSameGroup(job, this.jobs[this.currentIndex])
      ) {
        nextJobs.push(this.jobs[this.currentIndex]);
        this.currentIndex++;
      }

      return this.doWork(job, nextJobs);
    }

    return null;
  }

  private chainedPromiseGenerator() {
    if (this.chaineds.length > this.chainedIndex) {
      const chain = this.chaineds[this.chainedIndex];
      const result = this.doJob(chain.entity, chain.cache);
      this.chainedIndex++;
      if (this.chaineds.length <= this.chainedIndex) {
        this.chaineds.length = this.chainedIndex = 0;
      }

      return result;
    }
    return null;
  }

  private async doWork(job: TEntity, nextJobs: TEntity[]) {
    const cache: any = {};
    await this.doJob(job, cache);

    nextJobs.forEach(entity => this.chaineds.push({ entity, cache }));
  }

  private isFromSameGroup(job1: TEntity, job2: TEntity) {
    return this.getGroupId(job1) === this.getGroupId(job2);
  }

  async run() {
    let pool = new (PromisePool as any)(
      this.promiseGenerator.bind(this), this.concurrentJobs) as PromisePool.default<any>;
    await pool.start();

    if (this.chaineds.length > 0) {
      pool = new (PromisePool as any)(
        this.chainedPromiseGenerator.bind(this), this.concurrentJobs) as PromisePool.default<any>;
      await pool.start();
    }
  }
}
