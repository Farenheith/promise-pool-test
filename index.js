"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var delay_1 = require("delay");
var PromisePool = require("es6-promise-pool");
var PromisesProvider = /** @class */ (function () {
    function PromisesProvider(jobs) {
        this.jobs = jobs;
        this.currentIndex = 0;
        this.running = 0;
        this.retry = {};
    }
    PromisesProvider.prototype.promiseGenerator = function () {
        if (this.currentIndex < this.jobs.length) {
            var job = this.jobs[this.currentIndex];
            this.currentIndex++;
            var currentPromise = this.doDelay(job);
            while (this.currentIndex < this.jobs.length && job.jobType === this.jobs[this.currentIndex].jobType) {
                currentPromise = this.chainDelay(currentPromise, job);
                this.currentIndex++;
            }
            return currentPromise;
        }
        else {
            var keys = Object.getOwnPropertyNames(this.retry);
            if (keys.length > 0) {
                var jobs_1 = this.retry[Number(keys[0])];
                var currentPromise = this.doDelay(jobs_1[0]);
                for (var i = 1; i < jobs_1.length; i++) {
                    currentPromise = this.chainDelay(currentPromise, jobs_1[i]);
                }
                delete this.retry[Number(keys[0])];
                return currentPromise;
            }
            return null;
        }
    };
    PromisesProvider.prototype.hasRetries = function () {
        return Object.getOwnPropertyNames(this.retry).length > 0;
    };
    PromisesProvider.prototype.addRetry = function (job) {
        var retryJobs = this.retry[job.jobType];
        if (!retryJobs) {
            this.retry[job.jobType] = retryJobs = [];
        }
        retryJobs.push(job);
    };
    PromisesProvider.prototype.doDelay = function (job) {
        return __awaiter(this, void 0, void 0, function () {
            var i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        i = this.currentIndex;
                        this.running++;
                        console.log("Inicou job " + i + ". Jobs rodando: " + this.running);
                        return [4 /*yield*/, delay_1["default"](job.timeToSpent)];
                    case 1:
                        _a.sent();
                        if (job.breakingProcess) {
                            job.breakingProcess = false;
                            this.jobs.push(job);
                        }
                        this.running--;
                        console.log("Terminou job " + i + ". Jobs rodando: " + this.running);
                        return [2 /*return*/, job.breakingProcess];
                }
            });
        });
    };
    PromisesProvider.prototype.chainDelay = function (currentPromise, job) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, currentPromise];
                    case 1:
                        if (!(_a.sent())) {
                            this.jobs.push(job);
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.doDelay(job)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return PromisesProvider;
}());
var jobs = [
    {
        breakingProcess: false,
        jobType: 1,
        timeToSpent: 2000
    },
    {
        breakingProcess: false,
        jobType: 1,
        timeToSpent: 3000
    },
    {
        breakingProcess: false,
        jobType: 1,
        timeToSpent: 2000
    },
    {
        breakingProcess: false,
        jobType: 1,
        timeToSpent: 1500
    },
    {
        breakingProcess: false,
        jobType: 2,
        timeToSpent: 300
    },
    {
        breakingProcess: false,
        jobType: 2,
        timeToSpent: 900
    },
    {
        breakingProcess: false,
        jobType: 2,
        timeToSpent: 1500
    },
    {
        breakingProcess: false,
        jobType: 4,
        timeToSpent: 1500
    },
    {
        breakingProcess: false,
        jobType: 5,
        timeToSpent: 1800
    },
    {
        breakingProcess: false,
        jobType: 5,
        timeToSpent: 2300
    },
    {
        breakingProcess: false,
        jobType: 6,
        timeToSpent: 300
    },
    {
        breakingProcess: false,
        jobType: 6,
        timeToSpent: 500
    },
    {
        breakingProcess: false,
        jobType: 6,
        timeToSpent: 700
    }
];
var provider = new PromisesProvider(jobs);
var pool = new PromisePool(provider, 3);
console.log('teste');
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, pool.start()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                if (!provider.hasRetries()) return [3 /*break*/, 4];
                return [4 /*yield*/, pool.start()];
            case 3:
                _a.sent();
                return [3 /*break*/, 2];
            case 4: return [2 /*return*/];
        }
    });
}); });
