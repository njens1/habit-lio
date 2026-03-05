// automated test suite for habit creation functionality
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import HabitCreate from '../habitCreate.jsx';
import App from '../App.jsx';
import Menu from '../Menu.jsx';

// Mocks logging in of user page.
vi.mock("../auth", () => ({
  useAuth: () => ({ user: { uid: "123", email: "a@b.com" } }),
}));

test("shows home when logged in", () => {
  render(<App />);
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
});

test("show menu buttons when logged in", () => {
    render(<Menu />);
    expect(screen.getByTitle(/Home/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Friends/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Add Habit/i)).toBeInTheDocument();
});

describe('HabitCreate Component', () => {
    // INITAL TESTS
    // We want to perform sanity checks to test that the UI is loading.
    test("renders habit creation form", async () => {
        const user = userEvent.setup();
        render(<HabitCreate />);

        // Go to the custom create screen
        await user.click(screen.getByTitle("Custom"));

        // Now the form exists
        expect(await screen.findByLabelText(/Habit Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Habit Description/i)).toBeInTheDocument();
    });
    test('creates a new habit on form submission', async () => {
        const user = userEvent.setup();
        render(<HabitCreate />);

        // Go to the custom create screen
        await user.click(screen.getByTitle("Custom"));

        const nameInput = screen.getByLabelText(/Habit Name/i);
        const descriptionInput = screen.getByLabelText(/Habit Description/i);
        const submitButton = screen.getByRole('button', { name: /Create Habit/i });
        fireEvent.change(nameInput, { target: { value: 'Exercise' } });
        fireEvent.change(descriptionInput, { target: { value: 'Daily exercise routine' } });
        fireEvent.click(submitButton);
        // Add assertions to check if the habit was created successfully
        // This could involve checking for a success message or verifying that the new habit appears in the habit list
            
    });
});