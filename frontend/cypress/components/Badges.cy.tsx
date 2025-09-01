import { mount } from "@cypress/react18";
import Badges from "@/components/dashboard/Badges";

describe("Badges Component", () => {
  it("renders empty state when no badges", () => {
    mount(<Badges unlockedBadges={[]} />);
    cy.contains("No badges unlocked yet").should("exist");
  });

  it("renders list of badges", () => {
    const mockBadges = [
      { name: "Starter", unlocked: true, progress_current: 1, progress_target: 1 },
      { name: "Pro Voter", unlocked: true, progress_current: 10, progress_target: 10 },
    ];

    mount(<Badges unlockedBadges={mockBadges} />);

    cy.contains("Starter").should("exist");
    cy.contains("Pro Voter").should("exist");
    cy.contains("Unlocked 🎉").should("exist"); // confirm unlocked state is shown
  });
});
