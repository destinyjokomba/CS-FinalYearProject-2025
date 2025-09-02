"use strict";
/// <reference types="cypress" />
describe("Logout Flow", () => {
    beforeEach(() => {
        // Pretend user is logged in before visiting dashboard
        cy.visit("/dashboard", {
            onBeforeLoad(win) {
                win.localStorage.setItem("token", "fake-token");
            },
        });
    });
    it("logs user out and redirects to login", () => {
        // Confirm user is on dashboard
        cy.url().should("include", "/dashboard");
        cy.contains(/dashboard/i, { timeout: 10000 }).should("be.visible");
        // Click Logout in navbar 
        cy.contains(/logout/i).click();
        // After logout, token should be cleared
        cy.window().then((win) => {
            expect(win.localStorage.getItem("token")).to.equal(null);
        });
        // Check by URL and login form field instead of plain text
        cy.url().should("include", "/login");
        cy.get("form").within(() => {
            cy.get("input").should("exist"); // at least one input field
            cy.get("button[type='submit']").should("exist"); // login button
        });
    });
});
