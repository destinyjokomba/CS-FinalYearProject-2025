"use strict";
/// <reference types="cypress" />
describe("Login Flow", () => {
    it("should log in and reach dashboard", () => {
        // create a mock of the backend API call to /auth/login
        // This avoids hitting the real backend and ensures predictable results
        cy.intercept("POST", "/auth/login", {
            statusCode: 200,
            body: {
                token: "fake-token", // Simulate receiving a valid token
                user: {
                    id: 1,
                    username: "test@example.com",
                    profileCompletion: 1, // Pretend user has a completed profile
                },
            },
        }).as("loginRequest");
        // Visit the login page in the app
        cy.visit("/login");
        // Fill in the username input with a test email
        cy.get('input[name="username"]').type("test@example.com");
        // Fill in the password input with a fake password
        cy.get('input[name="password"]').type("password123");
        // Click the login button to submit the form
        cy.get('button[type="submit"]').click();
        // Wait until the intercepted login request resolves
        cy.wait("@loginRequest");
        // Redirect to dashboard page 
        cy.url({ timeout: 10000 }).should("include", "/dashboard");
    });
});
