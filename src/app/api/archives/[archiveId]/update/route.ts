import type { NextRequest } from "next/server";
import { z } from "zod";

import { updateArchiveMeta, type ArchiveUpdateResult } from "~/entities/archives";

import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    archiveId: string;
  };
};

// Define a strict schema for allowed archive update fields
const ArchiveUpdateSchema = z.object({
  title: z.string()
    .min(4, "Title must be at least 4 characters long.")
    .max(24, "Title must be at most 24 characters long.")
    .trim(),
  description: z.string()
    .min(8, "Description must be at least 8 characters long.")
    .max(64, "Description must be at most 64 characters long.")
    .trim(),
  isPublic: z.boolean().optional(),
}).strict(); // .strict() ensures no unknown keys are allowed

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { archiveId } = ctx.params;

  // Validate archive ID parameter
  if (!archiveId || archiveId.trim() === '') {
    return NxResponse.fail(
      "Missing or invalid archive ID in request path.",
      { code: "INVALID_PARAM", details: "archiveId parameter is required." },
      400
    );
  }

  // Parse JSON payload with error handling
  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch (_error) {
    return NxResponse.fail(
      "Failed to parse request body.",
      { code: "INVALID_JSON", details: null },
      400
    );
  }

  // Validate and sanitize payload against our strict schema
  const parseResult = ArchiveUpdateSchema.safeParse(rawPayload);
  
  if (!parseResult.success) {
    // Format validation errors for better error reporting
    const errorDetails = parseResult.error.issues.map(issue => ({
      path: issue.path.join('.'),
      message: issue.message
    }));
    
    // Check if there are unknown fields (strict validation failed)
    const hasUnknownFields = parseResult.error.issues.some(
      issue => issue.code === 'unrecognized_keys'
    );
    
    return NxResponse.fail(
      hasUnknownFields 
        ? "Unknown fields detected in payload. Only title, description, and isPublic are allowed." 
        : "Invalid payload format or values.",
      { 
        code: "INVALID_PAYLOAD", 
        details: JSON.stringify(errorDetails) 
      },
      400
    );
  }

  // Extract only the validated and sanitized fields
  const validatedPayload = parseResult.data;

  // Execute update with proper error handling
  let result: ArchiveUpdateResult;
  try {
    result = await updateArchiveMeta(archiveId, validatedPayload);
  } catch (_error) {
    return NxResponse.fail(
      "An unexpected error occurred while updating the archive.",
      { code: "UPDATE_FAILED", details: null },
      500
    );
  }

  if (!result.success) {
    const statusCode = result.statusCode || 500;
    const errorCode = statusCode === 429 ? "RATE_LIMIT_EXCEEDED" : 
                     statusCode === 404 ? "NOT_FOUND" : "UPDATE_FAILED";
    
    return NxResponse.fail(
      result.message,
      { code: errorCode, details: null },
      statusCode
    );
  }

  return NxResponse.success(result.message, {}, result.statusCode ?? 200);
}
