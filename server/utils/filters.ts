/** Exclude soft-deleted products from all public queries */
export const ACTIVE = { isActive: { $ne: false } } as const
