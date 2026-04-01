// automated test suite for onboarding functionality
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import Onboarding from '../onboarding/Onboarding.jsx';
// import Onboarding from '../onboarding/Onboarding.jsx';
import OnboardingPopup from '../onboarding/OnboardingPopup.jsx';
import { AuthContext } from '../AuthContext.jsx';

// Mocks signing up on user page.
vi.mock("../auth", () => ({
  useAuth: () => ({ user: { uid: "123", email: "test@example.com" } })
}));

// Show onboarding page when user signed up for the first time.
test("shows onboarding page when user signed up for the first time", () => {
  const hidden = false;
  // render(<Onboarding hidden={false} />);
  render(<OnboardingPopup props = {hidden} />);
  expect(screen.getByText(/HEY! I HAVEN'T SEEN YOU BEFORE!/i)).toBeInTheDocument();
});

// Show the first page in onboarding
describe('First Onboarding Page', () => {
  // INITAL TESTS
  // We want to perform sanity checks to test that the UI is loading.
  test("renders onboarding popup", async () => {
    const user = userEvent.setup();
    const hidden = false; 
    render(<OnboardingPopup props = {hidden} />);
    // The exact onboarding popup text should be present in the document.
    expect(await screen.findByText(/You must be new here./i)).toBeInTheDocument();
  })

});

// SECOND PAGE TESTS

// Show the second page in onboarding
describe('Second Onboarding Page', () => {
  test("renders onboarding popup", async () => {
    const user = userEvent.setup();
    const hidden = false; 
    render(<OnboardingPopup props = {hidden} />);
    const continueButton = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    // The exact onboarding popup text should be present in the document.
    expect(await screen.findByText(/Who are you?/i)).toBeInTheDocument();

    // Make sure the first name and last name is being requested.
    const firstName = await screen.findByLabelText(/First Name/i);
    const lastName = await screen.findByLabelText(/Last Name/i);
    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();

    //Make sure the username is being requested
    const username = await screen.findByLabelText(/Create a Username/i);
    expect(username).toBeInTheDocument();

    // Make sure the username by greeting
    const usernameGreeting = await screen.findByLabelText("Greeting by Username?");
    expect(usernameGreeting).toBeInTheDocument();

  })

});

// THIRD PAGE TESTS

// Show the third page in onboarding
describe('Third Onboarding Page', () => {
  test("renders onboarding popup", async () => {
    const user = userEvent.setup();
    const hidden = false; 
    render(<OnboardingPopup props = {hidden} />);
    const continueButton = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    const continueButton2 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton2);

    // The exact onboarding popup text should be present in the document.
    expect(await screen.findByText(/Add a Profile Picture/i)).toBeInTheDocument();

    const profilePictureInput = await screen.findByLabelText(/Profile Picture/i);
    expect(profilePictureInput).toBeInTheDocument();
  })

});



// FOURTH PAGE TESTS

// Show the Fourth page in onboarding
describe('Fourth Onboarding Page', () => {
  test("renders fourth page of onboarding popup", async () => {
    const user = userEvent.setup();
    const hidden = false; 
    render(<OnboardingPopup props = {hidden} />);
    const continueButton = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    const continueButton2 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton2);

    const continueButton3 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton3);

    // The exact onboarding popup text should be present in the document.
    expect(await screen.
      findByText(/What are you looking to do with your habits?/i)).toBeInTheDocument();
    
    const buildButton = await screen.findByRole("button", { name: /Build/i });
    expect(buildButton).toBeInTheDocument();

  })

});

// FIFTH PAGE TESTS

// Show the FIFTH page in onboarding
describe('Fifth Onboarding Page', () => {
  test("renders fifth page of onboarding popup", async () => {
    const user = userEvent.setup();
    const hidden = false; 
    render(<OnboardingPopup props = {hidden} />);
    const continueButton = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    const continueButton2 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton2);

    const continueButton3 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton3);

    const continueButton4 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton4);

    // The exact onboarding popup text should be present in the document.
    expect(await screen.
      findByText(/List some Affirmations!/i)).toBeInTheDocument();
    
    const addButton = await screen.findByRole("button", { name: /Add Another/i });
    expect(addButton).toBeInTheDocument();

  })

  test("renders correct affirmation text based on habit goal", async () => {
    const user = userEvent.setup();
    const hidden = false; 
    render(<OnboardingPopup props = {hidden} />);

    const continueButton = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    const continueButton2 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton2);

    const continueButton3 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton3);

    const continueButton4 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton4);

    const positiveAffirmationInput = await screen.findByLabelText(/Positive Affirmation 1/i);
    expect(positiveAffirmationInput).toBeInTheDocument();
  })

});


// SIXTH PAGE TESTS

// Show the Sixth page in onboarding
describe('Sixth Onboarding Page', () => {
  test("renders sixth page of onboarding popup", async () => {
    const user = userEvent.setup();
    const hidden = false; 
    render(<OnboardingPopup props = {hidden} />);
    const continueButton = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    const continueButton2 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton2);

    const continueButton3 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton3);

    const continueButton4 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton4);

    const continueButton5 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton5);

    // The exact onboarding popup text should be present in the document.
    expect(await screen.
      findByText(/YOU ARE ALL SET!/i)).toBeInTheDocument();


  })

  test("clicking let's go button should close onboarding popup", async () => {
    const user = userEvent.setup();
    const hidden = false; 
    render(<OnboardingPopup props = {hidden} />);

    const continueButton = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton);

    const continueButton2 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton2);

    const continueButton3 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton3);

    const continueButton4 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton4);

    const continueButton5 = await screen.findByRole("button", { name: /Continue/i });
    await user.click(continueButton5);

    const letsGoButton = await screen.findByRole("button", { name: /Let's Go!/i });
    await user.click(letsGoButton);

    expect(screen.queryByText(/YOU ARE ALL SET!/i)).not.toBeInTheDocument();
  })

});