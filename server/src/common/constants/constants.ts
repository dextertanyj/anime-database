const Prisma = {
	UNIQUE_CONSTRAINT_ERROR: "P2002",
	FOREIGN_KEY_ERROR: "P2003",
	ENTITY_NOT_FOUND: "P2025",
} as const;

export const Constants = {
	Prisma,
} as const;
