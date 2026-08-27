/**
 * Exclude soft-deleted products from all public queries.
 *
 * This is an equality match, not `{ $ne: false }`, on purpose. `$ne` compiles
 * to two disjoint index ranges, which stops Mongo from using the
 * { isActive, <sortField> } compound indexes to satisfy the sort — it falls
 * back to a blocking in-memory SORT. An equality match is a single index
 * prefix, so listings are served straight off the index.
 *
 * Legacy documents missing the field are backfilled by `npm run db:indexes`.
 */
export const ACTIVE = { isActive: true } as const
