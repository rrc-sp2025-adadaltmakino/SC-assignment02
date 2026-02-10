// This file is the main application file for the Express server

// import the express application and type definition
import express, { Express } from "express";

// import function and interface
import { calculatePortfolioPerformance, CalculatePortfolio } from "./portfolio/portfolioPerformance";

// initialize the express application
const app: Express = express();

// Interface for health check response
interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}

// respond to GET request at endpoint "/" with message
app.get("/", (req, res) => {
    res.send("Hello, world!");
});

/**
 * Health check endpoint that returns server status information
 * @returns JSON response with server health metrics
 */
app.get("/api/v1/health", (req, res) => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };

    res.json(healthData);
});

/**
 * Portfolio Performance endpoint 
 * @returns JSON response with CalculatePortfolio infromation
 */
app.get("/api/v1/portfolio/performance", (req, res) => {
    const initialInvestment = Number(req.query.initialInvestment)
    const currentValue = Number(req.query.currentValue)

    const portfolioPerformance: CalculatePortfolio = calculatePortfolioPerformance(
        initialInvestment, 
        currentValue
    )

    res.json(portfolioPerformance)
});


// export app and server for testing
export default app;
