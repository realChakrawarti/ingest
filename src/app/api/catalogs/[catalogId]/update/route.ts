import type { NextRequest } from "next/server";
import { z } from "zod";

import { updateCatalogMeta, type CatalogUpdateResult } from "~/entities/catalogs";
import { NxResponse } from "~/shared/lib/next/nx-response";

type ContextParams = {
  params: {
    catalogId: string;
  };
};

// Define a strict schema for allowed catalog update fields
const CatalogUpdateSchema = z.strictObject({
  title: z.string()
    .min(4, "Title must be at least 4 characters long.")
    .max(24, "Title must be at most 24 characters long.")
    .trim()
    .optional(),
  description: z.string()
    .min(8, "Description must be at least 8 characters long.")
    .max(64, "Description must be at most 64 characters long.")
    .trim()
    .optional(),
  isPublic: z.boolean().optional(),
}); // z.strictObject ensures no unknown keys are allowed

export async function PATCH(request: NextRequest, ctx: ContextParams) {
  const { catalogId } = ctx.params;

  // Validate catalog ID parameter
  if (!catalogId || catalogId.trim() === '') {
    return NxResponse.fail(
      "Missing or invalid catalog ID in request path.",
      { code: "INVALID_PARAM", details: "catalogId parameter is required." },
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
  const parseResult = CatalogUpdateSchema.safeParse(rawPayload);
  
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
    
    // Always return immediately on validation failure to prevent execution falling through
    const errorMessage = hasUnknownFields 
      ? "Unknown fields detected in payload. Only title, description, and isPublic are allowed." 
      : "Invalid payload format or values.";
      
    return NxResponse.fail(
      errorMessage,
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
  let result: CatalogUpdateResult;
  try {
    result = await updateCatalogMeta(catalogId, validatedPayload);
  } catch (_error) {
    return NxResponse.fail(
      "An unexpected error occurred while updating the catalog.",
      { code: "UPDATE_FAILED", details: null },
      500
    );
  }

  if (!result.success) {
    const statusCode = result.statusCode || 500;
    const errorCode =
      statusCode === 429 ? "RATE_LIMIT_EXCEEDED" :
      statusCode === 404 ? "NOT_FOUND" :
      statusCode === 400 ? "INVALID_PAYLOAD" : "UPDATE_FAILED";
    
    return NxResponse.fail(
      result.message,
      { code: errorCode, details: null },
      statusCode
    );
  }

  return NxResponse.success(result.message, {}, result.statusCode ?? 200);
}
