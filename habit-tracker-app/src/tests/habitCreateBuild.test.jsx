// automated test suite for habit creation functionality
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import HabitCreate from '../habitCreate.jsx';
import App from '../App.jsx';
import Menu from '../Menu.jsx';
import { AuthContext } from '../AuthContext.jsx';

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

    // Basic test to check that the form submission creates a new habit. 
    // This is a critical test to ensure that the core functionality of habit creation 
    // works as expected.
   test('Successfully created a new Build habit on form submission', async () => {
        // Creates a user interaction controller and a mock function to simulate adding a habit.
        const user = userEvent.setup();
        const mockAddHabit = vi.fn().mockResolvedValue();

        // Render the component
        render(
            <AuthContext.Provider value={{ uid: '123' }}>
            <HabitCreate addHabit={mockAddHabit} />
            </AuthContext.Provider>
        );

        // Open popup first
        await user.click(screen.getByTitle(/Add Habit/i));

        // Go to custom screen
        await user.click(screen.getByTitle(/Custom/i));

        const nameInput = screen.getByLabelText(/Habit Name/i);
        const descriptionInput = screen.getByLabelText(/Habit Description/i);
        const submitButton = screen.getByRole('button', { name: /Create Habit/i });

        await user.clear(nameInput);
        await user.type(nameInput, 'Exercise');
        await user.type(descriptionInput, 'Daily exercise routine');
        await user.click(submitButton);

        expect(mockAddHabit).toHaveBeenCalledTimes(1);
        expect(mockAddHabit).toHaveBeenCalledWith(
            expect.objectContaining({
            name: 'Exercise',
            description: 'Daily exercise routine',
            type: 'Build',
            isActive: true,
            })
        );
    });
});