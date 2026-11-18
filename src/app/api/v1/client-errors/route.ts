import { clientErrorResponse } from "@/server/logging/client-errors";
import { logger } from "@/server/logging/logger";
import { createRateLimiter } from "@/server/logging/rate-limit";
import { withRequestId } from "@/server/logging/with-request-id";

// 20 erreurs par minute et par client.
const limiter = createRateLimiter(20, 60_000);

export const POST = withRequestId((request) => clientErrorResponse(request, { limiter, logger }));
