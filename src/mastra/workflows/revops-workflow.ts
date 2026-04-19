import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { getCustomerMetrics, getChurnRisk, getPipelineStatus } from "../tools/revops-tools";

const getMetricsStep = createStep({
  id: "get-metrics",
  description: "Fetch all customer metrics",
  inputSchema: z.object({}),
  outputSchema: z.object({
    totalMRR: z.number(),
    customerCount: z.number(),
  }),
  execute: async () => {
    if (!getCustomerMetrics.execute) throw new Error("Tool not available");
    const result = await getCustomerMetrics.execute({ customerId: undefined }, {} as any);
    if ("error" in result) throw new Error("Tool returned an error");
    return {
      totalMRR: result.totalMRR,
      customerCount: result.customers.length,
    };
  },
});

const getChurnStep = createStep({
  id: "get-churn",
  description: "Fetch at-risk customers",
  inputSchema: z.object({}),
  outputSchema: z.object({
    atRiskCount: z.number(),
    totalMRRAtRisk: z.number(),
  }),
  execute: async () => {
    if (!getChurnRisk.execute) throw new Error("Tool not available");
    const result = await getChurnRisk.execute({ threshold: 0.3 }, {} as any);
    if ("error" in result) throw new Error("Tool returned an error");
    return {
      atRiskCount: result.atRiskCustomers.length,
      totalMRRAtRisk: result.totalMRRAtRisk,
    };
  },
});

const getPipelineStep = createStep({
  id: "get-pipeline",
  description: "Fetch pipeline status",
  inputSchema: z.object({}),
  outputSchema: z.object({
    totalPipeline: z.number(),
    weightedForecast: z.number(),
    dealCount: z.number(),
  }),
  execute: async () => {
    if (!getPipelineStatus.execute) throw new Error("Tool not available");
    const result = await getPipelineStatus.execute({ owner: undefined }, {} as any);
    if ("error" in result) throw new Error("Tool returned an error");
    return {
      totalPipeline: result.totalPipeline,
      weightedForecast: result.weightedForecast,
      dealCount: result.deals.length,
    };
  },
});