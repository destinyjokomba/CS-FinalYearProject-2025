import { jsx as _jsx } from "react/jsx-runtime";
import { mount } from "cypress/react";
import PartyCard from "../../src/components/dashboard/PartyCard";
describe("PartyCard Component", () => {
    it("renders predicted party with confidence", () => {
        mount(_jsx(PartyCard, { prediction: { party: "lab", confidence: 72 } }));
        cy.contains("Labour").should("exist");
        cy.contains("72.0%").should("exist"); // confidence is formatted with toFixed
    });
    it("renders alignment card correctly (Labour)", () => {
        mount(_jsx(PartyCard, { partyCode: "lab" }));
        cy.contains("Labour").should("exist");
        cy.contains(/Why this alignment/i).should("exist");
    });
    it("renders a different party (Conservative)", () => {
        mount(_jsx(PartyCard, { prediction: { party: "con", confidence: 45 } }));
        cy.contains("Conservative").should("exist");
        cy.contains("45.0%").should("exist");
        cy.contains(/Low confidence/i).should("exist"); // below 50% adds warning box
    });
});
