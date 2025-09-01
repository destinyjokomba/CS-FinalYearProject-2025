/// <reference types="cypress" />

describe("New User Journey: Register → Login → Survey", () => {
  beforeEach(() => {
    // Fake register API
    cy.intercept("POST", "/auth/register", {
      statusCode: 201,
      body: { success: true },
    }).as("registerRequest");
  });

  it("registers, logs in, and reaches the survey", () => {
    // --- 1. REGISTER ---
    cy.visit("/register");

    cy.get('input[name="first_name"]').type("Destiny");
    cy.get('input[name="surname"]').type("Jokomba");
    cy.get('input[name="username"]').type("destiny_user");
    cy.get('input[name="email"]').type("destiny@example.com");
    cy.get('input[name="password"]').type("StrongPass123");
    cy.get("#terms").check();
    cy.get("button[type='submit']").click();

    cy.wait("@registerRequest");
    cy.url().should("include", "/login");

    // --- 2. LOGIN ---
    cy.intercept("POST", "/auth/login", {
      statusCode: 200,
      body: {
        token: "fake-token",
        user: {
          id: 1,
          username: "destiny_user",
          profileCompletion: 0, // brand new user goes to survey
        },
      },
    }).as("loginRequest");

    cy.get('input[name="username"]').type("destiny_user");
    cy.get('input[name="password"]').type("StrongPass123");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");

    // --- 3. SURVEY ---
    cy.url().should("include", "/survey");
    cy.contains("Political Alignment Survey").should("exist");

    // Answer first 3 questions generically
    for (let i = 0; i < 3; i++) {
      cy.get("select").first().should("exist").select(1, { force: true });
      cy.contains(/Next|Submit/).click();
    }

    // Confirm progress updated
    cy.contains("% complete");
  });

  it("if user has profile completed, goes to dashboard instead", () => {
    cy.visit("/login");

    cy.intercept("POST", "/auth/login", {
      statusCode: 200,
      body: {
        token: "fake-token",
        user: {
          id: 2,
          username: "existing_user",
          profileCompletion: 1, // existing user skips survey
        },
      },
    }).as("loginDashboard");

    cy.get('input[name="username"]').type("existing_user");
    cy.get('input[name="password"]').type("Password123");
    cy.get('button[type="submit"]').click();

    cy.wait("@loginDashboard");
    cy.url().should("include", "/dashboard");
  });
});
