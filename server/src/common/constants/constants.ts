import { Role } from "@prisma/client";

const Prisma = {
	UNIQUE_CONSTRAINT_ERROR: "P2002",
	FOREIGN_KEY_ERROR: "P2003",
	ENTITY_NOT_FOUND: "P2025",
} as const;

const AdminRoles: Role[] = [Role.ADMIN, Role.OWNER];
const MemberRoles: Role[] = [...AdminRoles, Role.MEMBER];

export const Constants = {
	AdminRoles,
	MemberRoles,
	Prisma,
} as const;
