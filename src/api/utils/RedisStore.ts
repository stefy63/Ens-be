import * as Redis from "ioredis";
import { env } from "../../core/env";
import { Service } from 'typedi';
@Service()
export class RedisStore {
    private client;

    constructor() {
        this.client = new Redis(env.redis.port, env.redis.host);
    }

    public save(key: string, value: any): Promise<void> {
        return this.client.set(key, JSON.stringify(value));
    }

    public async get<T>(key: string): Promise<T> {
        return (JSON.parse(await this.client.get(key))) as T;
    }

    public async keys(pattern: string): Promise<string[]> {
        return this.client.keys(pattern);
    }

    public async del(...keys: string[]): Promise<void> {
        return this.client.del(keys);
    }

    public async expire(key: string, seconds: number): Promise<boolean> {
        return this.client.expire(key, seconds);
    }
}
