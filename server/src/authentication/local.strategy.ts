import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-local";

import { AuthenticationService } from "./authentication.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authenticationService: AuthenticationService) {
		// We remap the username field to email
		// for consistency with our database schema
		super({ usernameField: "email", passReqToCallback: true });
	}

	async validate(req: Request, email: string, password: string): Promise<Express.User> {
		const clientIP = req.header("x-forwarded-for")?.split(",")?.[0] || req.socket.remoteAddress;
		const user = await this.authenticationService.validateUser({
			email,
			password,
			ipAddress: clientIP || "",
		});
		if (!user) {
			throw new UnauthorizedException("Incorrect email or password.");
		}
		return { ...user };
	}
}
