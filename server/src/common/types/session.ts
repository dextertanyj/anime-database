import "express-session";

import { Role } from "@prisma/client";

declare module "express-session" {
	interface SessionData {
		passport: {
			user: {
				id: string;
				email: string;
				role: Role;
			};
		};
	}
}
