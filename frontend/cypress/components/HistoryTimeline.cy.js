import { jsx as _jsx } from "react/jsx-runtime";
import { mount } from "cypress/react";
import { MemoryRouter } from "react-router-dom";
import HistoryTimeline from "@/components/dashboard/HistoryTimeline";
describe("HistoryTimeline Component", () => {
    it("shows empty state when no predictions exist", () => {
        mount(_jsx(MemoryRouter, { children: _jsx(HistoryTimeline, { predictions: [] }) }));
        cy.contains("No prediction history yet.").should("exist");
        cy.contains("Take your first survey →").should("exist");
    });
    it("renders prediction items with party + confidence + timestamp", () => {
        const mockPredictions = [
            {
                party: "lab",
                confidence: 72,
                timestamp: new Date("2025-08-20T12:00:00Z").toISOString(),
            },
            {
                party: "con",
                confidence: 65,
                timestamp: new Date("2025-08-21T12:00:00Z").toISOString(),
            },
        ];
        mount(_jsx(MemoryRouter, { children: _jsx(HistoryTimeline, { predictions: mockPredictions }) }));
        // Party names
        cy.contains("Labour").should("exist");
        cy.contains("Conservative").should("exist");
        // Confidence values (match decimal formatting)
        cy.contains("72.0%").should("exist");
        cy.contains("65.0%").should("exist");
        // Timestamp spans 
        cy.get("span.text-sm.text-gray-500").should("have.length", 2);
    });
});
