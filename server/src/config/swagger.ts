import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ClearView AI API",
      version: "1.0.0",
      description:
        "AI-powered website analysis: structure hierarchy, summaries, readability scores, clutter detection, and UX recommendations.",
    },
    servers: [{ url: "http://localhost:4000/api", description: "Local dev" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "object",
              properties: {
                user: { $ref: "#/components/schemas/User" },
                token: { type: "string" },
              },
            },
          },
        },
        AnalyzeRequest: {
          type: "object",
          required: ["url"],
          properties: {
            url: { type: "string", example: "https://acme.io" },
          },
        },
        HierarchyNode: {
          type: "object",
          properties: {
            id: { type: "string" },
            label: { type: "string" },
            children: {
              type: "array",
              items: { $ref: "#/components/schemas/HierarchyNode" },
            },
          },
        },
        CognitiveLoad: {
          type: "object",
          properties: {
            score: { type: "number", example: 62 },
            level: { type: "string", enum: ["low", "medium", "high"], example: "medium" },
          },
        },
        Analysis: {
          type: "object",
          properties: {
            _id: { type: "string" },
            url: { type: "string" },
            title: { type: "string" },
            screenshot: { type: "string", description: "base64 data URI" },
            summary: { type: "object" },
            readabilityScore: { type: "number" },
            readabilityGrade: { type: "string" },
            clutterScore: { type: "number" },
            clutterIssues: { type: "array", items: { type: "string" } },
            hierarchy: { $ref: "#/components/schemas/HierarchyNode" },
            cognitiveLoad: { $ref: "#/components/schemas/CognitiveLoad" },
            recommendations: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        AnalysisResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: { $ref: "#/components/schemas/Analysis" },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
            errors: { type: "array", items: { type: "object" } },
          },
        },
      },
      responses: {
        Error: {
          description: "Error response",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Error" },
            },
          },
        },
        AuthSuccess: {
          description: "Authentication successful",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
        AnalysisSuccess: {
          description: "Analysis created or fetched",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AnalysisResponse" },
            },
          },
        },
      },
    },
  },
  apis: ["./src/controllers/*.ts", "./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerDefinition);
