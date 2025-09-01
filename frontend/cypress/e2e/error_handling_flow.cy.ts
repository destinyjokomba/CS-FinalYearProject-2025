/// <reference types="cypress" />

describe("Error Handling Flow", () => {
  it("shows error on login with wrong credentials", () => {
    // Stub backend login fail
    cy.intercept("POST", "**/auth/login", {
      statusCode: 401,
      body: { error: "Invalid username or password" },
    }).as("loginFail");

    cy.visit("/login");

    cy.get('input[name="username"]').type("wronguser");
    cy.get('input[name="password"]').type("wrongpass");
    cy.get("button[type='submit']").click();

    cy.wait("@loginFail");
    cy.contains(/invalid|error/i, { timeout: 10000 }).should("be.visible");
  });

  it("shows error on register with duplicate email", () => {
    // Stub backend register fail
    cy.intercept("POST", "**/auth/register", {
      statusCode: 409,
      body: { error: "Email already in use" },
    }).as("registerFail");

    cy.visit("/register");

    cy.get('input[name="first_name"]').type("Test");
    cy.get('input[name="surname"]').type("User");
    cy.get('input[name="username"]').type("testuser");
    cy.get('input[name="email"]').type("duplicate@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get("#terms").check();
    cy.get("button[type='submit']").click();

    cy.wait("@registerFail");

    cy.contains("❌ Registration failed. Please try again.", {
      timeout: 10000,
    }).should("be.visible");
  });

  it("shows error on failing settings update", () => {
    // Stub backend settings update fail
    cy.intercept("PUT", "**/me/settings", {
      statusCode: 500,
      body: { error: "Internal Server Error" },
    }).as("settingsFail");

    cy.visit("/settings", {
      onBeforeLoad(win) {
        win.localStorage.setItem("token", "fake-token");
      },
    });

    cy.contains(/save changes/i).click();
    cy.wait("@settingsFail");

    cy.contains(/error/i, { timeout: 10000 }).should("be.visible");
  });
});
