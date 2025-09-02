"use strict";
/// <reference types="cypress" />
describe("Settings → Dashboard Flow", () => {
    beforeEach(() => {
        cy.intercept("PUT", "**/me/settings", {
            statusCode: 200,
            body: { success: true },
        }).as("updateSettings");
        cy.intercept("GET", "**/me/dashboard", {
            statusCode: 200,
            body: {
                user: {
                    id: 1,
                    username: "destiny_user",
                    chosenAlignment: "lab",
                    constituency: "London",
                },
                badges: [],
            },
        }).as("dashboardRequest");
    });
    it("updates alignment in settings and verifies it in dashboard", () => {
        // --- 1. SETTINGS PAGE ---
        cy.visit("/settings", {
            onBeforeLoad(win) {
                win.localStorage.setItem("token", "fake-token");
            },
        });
        // Change alignment dropdown
        cy.contains("Political Alignment")
            .parent()
            .find("select")
            .select("Labour", { force: true });
        // Save settings
        cy.contains("Save Changes").click();
        cy.wait("@updateSettings");
        // --- 2. NAVIGATE TO DASHBOARD ---
        cy.visit("/dashboard", {
            onBeforeLoad(win) {
                win.localStorage.setItem("token", "fake-token");
            },
        });
        cy.wait("@dashboardRequest");
        cy.url().should("include", "/dashboard");
        cy.contains("Your Alignment").should("exist");
        cy.contains("Labour").should("exist");
    });
});
