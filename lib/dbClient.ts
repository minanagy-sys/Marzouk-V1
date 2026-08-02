import { randomUUID } from "crypto";
import type { Pool, RowDataPacket } from "mysql2/promise";
import { getPool } from "./db";

/**
 * A tiny Supabase-compatible query builder over MySQL.
 *
 * It implements just the subset of the supabase-js API this app uses, so the
 * whole `lib/data/*` layer and the admin/booking API routes keep working with
 * NO changes:
 *
 *   from(t).select("*").eq("is_published", true).order("sort_order",{ascending:true})
 *   from(t).insert(body).select().single()
 *   from(t).update(rest).eq("id", id).select().single()
 *   from(t).delete().eq("id", id)
 *   from(t).upsert(rows, { onConflict: "key" })
 *
 * Every builder is a thenable that resolves to `{ data, error }` — same shape
 * supabase-js returns — so existing `await`/`.then()` call sites are unchanged.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// `data` is intentionally `any` to match the supabase-js ergonomics the call
// sites were written against (they do `data.map(...)`, `data.length`, etc.).
type Result = { data: any; error: { message: string } | null; count?: number | null };
type Row = Record<string, unknown>;

const id = (name: string) => "`" + String(name).replace(/`/g, "") + "`";

/** JS value -> MySQL param (objects/arrays become JSON text). */
function toParam(v: unknown): unknown {
  if (v === undefined) return null;
  if (v !== null && typeof v === "object") return JSON.stringify(v);
  return v;
}

class QueryBuilder implements PromiseLike<Result> {
  private pool: Pool;
  private table: string;
  private op: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private columns = "*";
  private payload: Row | Row[] = {};
  private wheresEq: Array<[string, unknown]> = [];
  private wheresIn: Array<[string, unknown[]]> = [];
  private orderCol: string | null = null;
  private orderAsc = true;
  private conflictKey: string | null = null;
  private wantRow = false;
  private wantSingle = false;
  private countMode = false;
  private headMode = false;

  constructor(pool: Pool, table: string) {
    this.pool = pool;
    this.table = table;
  }

  select(cols = "*", opts?: { count?: string; head?: boolean }) {
    if (this.op === "select") {
      this.columns = cols || "*";
      if (opts?.count) this.countMode = true;
      if (opts?.head) this.headMode = true;
    } else {
      this.wantRow = true; // .insert(...).select() / .update(...).select()
    }
    return this;
  }
  insert(body: Row | Row[]) {
    this.op = "insert";
    this.payload = body;
    return this;
  }
  update(body: Row) {
    this.op = "update";
    this.payload = body;
    return this;
  }
  delete() {
    this.op = "delete";
    return this;
  }
  upsert(rows: Row | Row[], opts?: { onConflict?: string }) {
    this.op = "upsert";
    this.payload = rows;
    this.conflictKey = opts?.onConflict ?? null;
    return this;
  }
  eq(col: string, val: unknown) {
    this.wheresEq.push([col, val]);
    return this;
  }
  in(col: string, vals: unknown[]) {
    this.wheresIn.push([col, vals]);
    return this;
  }
  match(obj: Row) {
    for (const k of Object.keys(obj)) this.wheresEq.push([k, obj[k]]);
    return this;
  }
  order(col: string, opts?: { ascending?: boolean }) {
    this.orderCol = col;
    this.orderAsc = opts?.ascending !== false;
    return this;
  }
  single() {
    this.wantSingle = true;
    this.wantRow = true;
    return this;
  }

  private whereClause(): { sql: string; params: unknown[] } {
    const parts: string[] = [];
    const params: unknown[] = [];
    for (const [c, v] of this.wheresEq) {
      parts.push(`${id(c)} = ?`);
      params.push(toParam(v));
    }
    for (const [c, vals] of this.wheresIn) {
      parts.push(`${id(c)} IN (?)`);
      params.push(vals);
    }
    return { sql: parts.length ? " WHERE " + parts.join(" AND ") : "", params };
  }

  private async run(): Promise<Result> {
    try {
      if (this.op === "select") return await this.runSelect();
      if (this.op === "insert") return await this.runInsert();
      if (this.op === "update") return await this.runUpdate();
      if (this.op === "delete") return await this.runDelete();
      return await this.runUpsert();
    } catch (e) {
      return { data: null, error: { message: e instanceof Error ? e.message : String(e) } };
    }
  }

  private async runSelect(): Promise<Result> {
    const w = this.whereClause();
    if (this.countMode) {
      const [rows] = await this.pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS c FROM ${id(this.table)}${w.sql}`,
        w.params,
      );
      const count = Number((rows as Row[])[0]?.c ?? 0);
      return { data: this.headMode ? null : [], error: null, count };
    }
    const cols =
      this.columns === "*"
        ? "*"
        : this.columns
            .split(",")
            .map((c) => id(c.trim()))
            .join(", ");
    const order = this.orderCol ? ` ORDER BY ${id(this.orderCol)} ${this.orderAsc ? "ASC" : "DESC"}` : "";
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `SELECT ${cols} FROM ${id(this.table)}${w.sql}${order}`,
      w.params,
    );
    if (this.wantSingle) {
      const row = (rows as Row[])[0] ?? null;
      return { data: row, error: row ? null : { message: "No rows found" } };
    }
    return { data: rows as Row[], error: null };
  }

  private async insertOne(row: Row): Promise<string> {
    const data: Row = { ...row };
    if (data.id === undefined || data.id === null || data.id === "") data.id = randomUUID();
    const keys = Object.keys(data);
    const sql = `INSERT INTO ${id(this.table)} (${keys.map(id).join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;
    await this.pool.query(sql, keys.map((k) => toParam(data[k])));
    return String(data.id);
  }

  private async fetchById(rowId: string): Promise<Row | null> {
    const [rows] = await this.pool.query<RowDataPacket[]>(`SELECT * FROM ${id(this.table)} WHERE \`id\` = ?`, [rowId]);
    return (rows as Row[])[0] ?? null;
  }

  private async runInsert(): Promise<Result> {
    const list = Array.isArray(this.payload) ? this.payload : [this.payload];
    const ids: string[] = [];
    for (const r of list) ids.push(await this.insertOne(r));
    if (!this.wantRow) return { data: null, error: null };
    const rows = (await Promise.all(ids.map((i) => this.fetchById(i)))).filter(Boolean) as Row[];
    return { data: this.wantSingle ? rows[0] ?? null : rows, error: null };
  }

  private async runUpdate(): Promise<Result> {
    const body = this.payload as Row;
    const keys = Object.keys(body);
    const w = this.whereClause();
    if (keys.length) {
      const set = keys.map((k) => `${id(k)} = ?`).join(", ");
      await this.pool.query(
        `UPDATE ${id(this.table)} SET ${set}${w.sql}`,
        [...keys.map((k) => toParam(body[k])), ...w.params],
      );
    }
    if (!this.wantRow) return { data: null, error: null };
    const [rows] = await this.pool.query<RowDataPacket[]>(`SELECT * FROM ${id(this.table)}${w.sql}`, w.params);
    const list = rows as Row[];
    return { data: this.wantSingle ? list[0] ?? null : list, error: null };
  }

  private async runDelete(): Promise<Result> {
    const w = this.whereClause();
    await this.pool.query(`DELETE FROM ${id(this.table)}${w.sql}`, w.params);
    return { data: null, error: null };
  }

  private async runUpsert(): Promise<Result> {
    const list = Array.isArray(this.payload) ? this.payload : [this.payload];
    if (!list.length) return { data: [], error: null };
    const conflict = this.conflictKey;
    for (const r of list) {
      const data: Row = { ...r };
      if (data.id === undefined || data.id === null || data.id === "") data.id = randomUUID();
      const keys = Object.keys(data);
      const updatable = keys.filter((k) => k !== "id" && k !== conflict);
      const dup = updatable.length
        ? " ON DUPLICATE KEY UPDATE " + updatable.map((k) => `${id(k)} = VALUES(${id(k)})`).join(", ")
        : " ON DUPLICATE KEY UPDATE `id` = `id`";
      const sql = `INSERT INTO ${id(this.table)} (${keys.map(id).join(", ")}) VALUES (${keys
        .map(() => "?")
        .join(", ")})${dup}`;
      await this.pool.query(sql, keys.map((k) => toParam(data[k])));
    }
    return { data: null, error: null };
  }

  // Thenable: `await from(t).select()...` resolves to { data, error }.
  then<TResult1 = Result, TResult2 = never>(
    onfulfilled?: ((value: Result) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return this.run().then(onfulfilled, onrejected);
  }
}

export type DbClient = { from: (table: string) => QueryBuilder };

/** Returns a MySQL-backed client, or null when the DB isn't configured. */
export function getDbClient(): DbClient | null {
  const pool = getPool();
  if (!pool) return null;
  return { from: (table: string) => new QueryBuilder(pool, table) };
}
