import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { customers, deals } from "../data/revops-data";

export const getCustomerMetrics = createTool({
  id: "get-customer-metrics",
  description:
    "Get MRR, NRR, churn risk and status for all customers or a specific one",
  inputSchema: z.object({
    customerId: z.string().optional().describe("Customer ID, optional"),
  }),
  outputSchema: z.object({
    customers: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        mrr: z.number(),
        nrr: z.number(),
        churnRisk: z.number(),
        stage: z.string(),
      })
    ),
    totalMRR: z.number(),
  }),
  execute: async ({ customerId }) => {
    const filtered = customerId
      ? customers.filter((c) => c.id === customerId)
      : customers;

    return {
      customers: filtered.map((c) => ({
        id: c.id,
        name: c.name,
        mrr: c.mrr,
        nrr: c.nrr,
        churnRisk: c.churnRisk,
        stage: c.stage,
      })),
      totalMRR: filtered.reduce((sum, c) => sum + c.mrr, 0),
    };
  },
});

export const getChurnRisk = createTool({
  id: "get-churn-risk",
  description: "Get customers at risk of churning, sorted by risk level",
  inputSchema: z.object({
    threshold: z
      .number()
      .optional()
      .describe("Churn risk threshold, default 0.3"),
  }),
  outputSchema: z.object({
    atRiskCustomers: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        churnRisk: z.number(),
        mrr: z.number(),
        stage: z.string(),
      })
    ),
    totalMRRAtRisk: z.number(),
  }),
  execute: async ({ threshold }) => {
    const riskThreshold = threshold ?? 0.3;
    const atRisk = customers
      .filter((c) => c.churnRisk >= riskThreshold)
      .sort((a, b) => b.churnRisk - a.churnRisk);

    return {
      atRiskCustomers: atRisk.map((c) => ({
        id: c.id,
        name: c.name,
        churnRisk: c.churnRisk,
        mrr: c.mrr,
        stage: c.stage,
      })),
      totalMRRAtRisk: atRisk.reduce((sum, c) => sum + c.mrr, 0),
    };
  },
});

export const getPipelineStatus = createTool({
  id: "get-pipeline-status",
  description: "Get current sales pipeline status, deals and weighted forecast",
  inputSchema: z.object({
    owner: z.string().optional().describe("Filter by sales rep name"),
  }),
  outputSchema: z.object({
    deals: z.array(
      z.object({
        id: z.string(),
        company: z.string(),
        value: z.number(),
        stage: z.string(),
        probability: z.number(),
        closeDate: z.string(),
        owner: z.string(),
      })
    ),
    totalPipeline: z.number(),
    weightedForecast: z.number(),
  }),
  execute: async ({ owner }) => {
    const filtered = owner
      ? deals.filter((d) => d.owner === owner)
      : deals;

    return {
      deals: filtered,
      totalPipeline: filtered.reduce((sum, d) => sum + d.value, 0),
      weightedForecast: filtered.reduce(
        (sum, d) => sum + d.value * d.probability,
        0
      ),
    };
  },
});