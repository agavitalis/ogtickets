import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as  dotenv from 'dotenv';
dotenv.config();

export function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any> {
  
  if (securityName === "jwt") {

    const token = request.body.token || request.query.token || request.headers["x-access-token"] || request.query.access_token;

    return new Promise((resolve, reject) => {

      if (!token) {
        reject(new Error("No token provided"));
      }

      jwt.verify(token, process.env.SECRET, function (err: any, decoded: any) {
        if (err) {
          reject(err);
        } else {
          // Check if JWT contains all required scopes
          for (let scope of scopes) {
            if (!decoded.scopes.includes(scope)) {
              reject(new Error("JWT does not contain required scope."));
            }
          }
          resolve(decoded);
        }
      });

    });
  }
}