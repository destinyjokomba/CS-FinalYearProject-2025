"use strict";
/// <reference types="cypress" />
describe("Security Page Flow", () => {
    beforeEach(() => {
        // Pretend the user is logged in
        cy.visit("/settings", {
            onBeforeLoad(win) {
                win.localStorage.setItem("token", "fake-token");
            },
        });
    });
    it("navigates from Settings to SecurityPage", () => {
        // Uses `data-testid` for stable selection
        cy.get('[data-testid="privacy-security-link"]').click();
        // Verify SecurityPage loaded
        cy.url().should("include", "/security");
        cy.contains("Security, GDPR & Terms").should("exist");
    });
    it("navigates back from SecurityPage to Settings", () => {
        cy.get('[data-testid="privacy-security-link"]').click();
        cy.url().should("include", "/security");
        // Added a data-testid for extra stability
        cy.contains("Back to Settings").click();
        // Verify back on Settings
        cy.url().should("include", "/settings");
        cy.contains("Save Changes").should("exist");
    });
});
