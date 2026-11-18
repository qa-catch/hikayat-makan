import { prisma } from "@/server/db/client";
import { healthResponse } from "@/server/health";
import { withRequestId } from "@/server/logging/with-request-id";

export const GET = withRequestId(() => healthResponse(prisma));
