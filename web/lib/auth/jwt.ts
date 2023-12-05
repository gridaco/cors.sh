import jwt from "jsonwebtoken";

const _SECRET = process.env.SERVICE_JWT_SECRET as string;

export interface ServiceUserSignature {
  type: "customer";
  service: "cors.sh";
  id: string;
}

export function decode_jwt(token: string): ServiceUserSignature {
  return jwt.verify(token, _SECRET) as ServiceUserSignature;
}

export function encode_jwt(service_user_id: string): string {
  const payload: ServiceUserSignature = {
    type: "customer",
    service: "cors.sh",
    id: service_user_id,
  };
  return jwt.sign(payload, _SECRET);
}

export function verify(token: string) {
  const pl = jwt.verify(token, _SECRET) as ServiceUserSignature;
  if (pl.service == "cors.sh" && pl.type == "customer") {
    return pl.id;
  } else {
    throw new Error("invalid token");
  }
}
