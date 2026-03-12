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

    // QUIT HABIT TESTS

    // Test checks building a basic quit habit.
    test('Successfully created a Quit habit', async () => {
        const user = userEvent.setup();
        const mockAddHabit = vi.fn().mockResolvedValue();

        render(
            <AuthContext.Provider value={{ uid: '123' }}>
            <HabitCreate addHabit={mockAddHabit} />
            </AuthContext.Provider>
        );

        // Open popup first
        await user.click(screen.getByTitle(/Add Habit/i));

        // Go to custom screen
        await user.click(screen.getByTitle(/Custom/i));

        // Find the elements in habitCreate.jsx needed to accomplish habit creation.
        const nameInput = screen.getByLabelText(/Habit Name/i);
        const descriptionInput = screen.getByLabelText(/Habit Description/i);
        const quitButton = screen.getByRole('button', { name: /Quit/i });
        const submitButton = screen.getByRole('button', { name: /Create Habit/i });

        // Performing the action that a user would do via code.
        // Essentially simulating a user creating a quit habit 
        // with the name "Reduce Smoking" and description "Cut down on smoking gradually".
        await user.clear(nameInput);
        await user.type(nameInput, 'Reduce Smoking');
        await user.type(descriptionInput, 'Cut down on smoking gradually');
        await user.click(quitButton);
        await user.click(submitButton);

        expect(mockAddHabit).toHaveBeenCalledTimes(1);
        expect(mockAddHabit).toHaveBeenCalledWith(
            expect.objectContaining({
            name: 'Reduce Smoking',
            description: 'Cut down on smoking gradually',
            type: 'Quit',
            isActive: true,
            })
        );
    });


    // Test checks building a basic quit habit w/ color
    test('Successfully created a Quit habit with color', async () => {
        const user = userEvent.setup();
        const mockAddHabit = vi.fn().mockResolvedValue();

        render(
            <AuthContext.Provider value={{ uid: '123' }}>
            <HabitCreate addHabit={mockAddHabit} />
            </AuthContext.Provider>
        );

        // Open popup first
        await user.click(screen.getByTitle(/Add Habit/i));

        // Go to custom screen
        await user.click(screen.getByTitle(/Custom/i));

        // Find the elements in habitCreate.jsx needed to accomplish habit creation.
        const nameInput = screen.getByLabelText(/Habit Name/i);
        const descriptionInput = screen.getByLabelText(/Habit Description/i);
        const quitButton = screen.getByRole('button', { name: /Quit/i });
        const colorInput = screen.getByLabelText(/Set Color:/i);
        const submitButton = screen.getByRole('button', { name: /Create Habit/i });

        // Performing the action that a user would do via code.
        // Essentially simulating a user creating a quit habit 
        // with the name "Reduce Smoking" and description "Cut down on smoking gradually".
        await user.clear(nameInput);
        await user.type(nameInput, 'Reduce Smoking');
        await user.type(descriptionInput, 'Cut down on smoking gradually');
        await user.selectOptions(colorInput, '#f8aaaa');
        await user.click(quitButton);
        await user.click(submitButton);

        expect(mockAddHabit).toHaveBeenCalledTimes(1);
        expect(mockAddHabit).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Reduce Smoking',
                description: 'Cut down on smoking gradually',
                type: 'Quit',
                color: '#f8aaaa',
                isActive: true
            })
        );
    });

     // Test checks building a basic quit habit w/ color
    test('Successfully created a Quit habit with color and default goal', async () => {
        const user = userEvent.setup();
        const mockAddHabit = vi.fn().mockResolvedValue();

        render(
            <AuthContext.Provider value={{ uid: '123' }}>
            <HabitCreate addHabit={mockAddHabit} />
            </AuthContext.Provider>
        );

        // Open popup first
        await user.click(screen.getByTitle(/Add Habit/i));

        // Go to custom screen
        await user.click(screen.getByTitle(/Custom/i));

        // Find the elements in habitCreate.jsx needed to accomplish habit creation.
        const nameInput = screen.getByLabelText(/Habit Name/i);
        const descriptionInput = screen.getByLabelText(/Habit Description/i);
        const colorInput = screen.getByLabelText(/Set Color:/i);
        const quitButton = screen.getByRole('button', { name: /Quit/i });
        const goalPeriod = screen.getByLabelText(/Goal Period:/i);
        const goalValue = screen.getByLabelText(/Goal Value:/i);
        const submitButton = screen.getByRole('button', { name: /Create Habit/i });

        // Performing the action that a user would do via code.
        // Essentially simulating a user creating a quit habit 
        // with the name "Reduce Smoking" and description "Cut down on smoking gradually".
        await user.clear(nameInput);
        await user.type(nameInput, 'Reduce Smoking');
        await user.type(descriptionInput, 'Cut down on smoking gradually');
        await user.selectOptions(colorInput, '#f8aaaa');
        await user.click(quitButton);
        await user.selectOptions(goalPeriod, 'Day');
        fireEvent.change(goalValue, { target: { value: '1' } });
        await user.click(submitButton);

        expect(mockAddHabit).toHaveBeenCalledTimes(1);
        expect(mockAddHabit).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Reduce Smoking',
                description: 'Cut down on smoking gradually',
                emoji: '📝',
                type: 'Quit',
                color: '#f8aaaa',
                goal:{ 
                    value: "1", 
                    period: 'Day', 
                    unit: 'steps', 
                    taskDays: 'everyday',
                    numOfDays: 0,
                    daysSelected: []
                },
                priority: "none",
                reminder: {
                    activated: false,
                    message: "",
                    time: ""
                },
                startDate: "",
                endDate: "",
                isActive: true
            })
        );
    });

    // Test checks building a basic quit habit w/ color
    test('Successfully created a Quit habit with color and custom goal', async () => {
        const user = userEvent.setup();
        const mockAddHabit = vi.fn().mockResolvedValue();

        render(
            <AuthContext.Provider value={{ uid: '123' }}>
            <HabitCreate addHabit={mockAddHabit} />
            </AuthContext.Provider>
        );

        // Open popup first
        await user.click(screen.getByTitle(/Add Habit/i));

        // Go to custom screen
        await user.click(screen.getByTitle(/Custom/i));

        // Find the elements in habitCreate.jsx needed to accomplish habit creation.
        const nameInput = screen.getByLabelText(/Habit Name/i);
        const descriptionInput = screen.getByLabelText(/Habit Description/i);
        const colorInput = screen.getByLabelText(/Set Color:/i);
        const quitButton = screen.getByRole('button', { name: /Quit/i });

        const goalPeriod = screen.getByLabelText(/Goal Period:/i);
        const goalValue = screen.getByLabelText(/Goal Value:/i);
        const unitSelected = screen.getByRole('combobox', { name: /unit/i });
        const submitButton = screen.getByRole('button', { name: /Create Habit/i });

        // Performing the action that a user would do via code.
        // Essentially simulating a user creating a quit habit 
        // with the name "Reduce Smoking" and description "Cut down on smoking gradually".
        await user.clear(nameInput);
        await user.type(nameInput, 'Reduce Smoking');
        await user.type(descriptionInput, 'Cut down on smoking gradually');
        await user.selectOptions(colorInput, '#f8aaaa');
        await user.click(quitButton);
        await user.selectOptions(goalPeriod, 'Week');
        fireEvent.change(goalValue, { target: { value: '100' } });
        fireEvent.change(unitSelected, { target: { value: 'steps' } });
        await user.click(submitButton);

        expect(mockAddHabit).toHaveBeenCalledTimes(1);
        expect(mockAddHabit).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Reduce Smoking',
                description: 'Cut down on smoking gradually',
                emoji: '📝',
                type: 'Quit',
                color: '#f8aaaa',
                goal:{ 
                    value: "100", 
                    period: 'Week', 
                    unit: 'steps', 
                    taskDays: 'everyday',
                    numOfDays: 0,
                    daysSelected: []
                },
                priority: "none",
                reminder: {
                    activated: false,
                    message: "",
                    time: ""
                },
                startDate: "",
                endDate: "",
                isActive: true
            })
        );
    });

    // Test checks building a basic quit habit w/ color
    test('Successfully created a Quit habit with reminders', async () => {
        const user = userEvent.setup();
        const mockAddHabit = vi.fn().mockResolvedValue();

        render(
            <AuthContext.Provider value={{ uid: '123' }}>
            <HabitCreate addHabit={mockAddHabit} />
            </AuthContext.Provider>
        );

        // Open popup first
        await user.click(screen.getByTitle(/Add Habit/i));

        // Go to custom screen
        await user.click(screen.getByTitle(/Custom/i));

        // Find the elements in habitCreate.jsx needed to accomplish habit creation.
        const nameInput = screen.getByLabelText(/Habit Name/i);
        const descriptionInput = screen.getByLabelText(/Habit Description/i);
        const colorInput = screen.getByLabelText(/Set Color:/i);
        const quitButton = screen.getByRole('button', { name: /Quit/i });

        const goalPeriod = screen.getByLabelText(/Goal Period:/i);
        const goalValue = screen.getByLabelText(/Goal Value:/i);
        const unitSelected = screen.getByRole('combobox', { name: /unit/i });
        const submitButton = screen.getByRole('button', { name: /Create Habit/i });

        const reminderSelected = screen.getByLabelText(/Want to be reminded?/i);

        // Performing the action that a user would do via code.
        // Essentially simulating a user creating a quit habit 
        // with the name "Reduce Smoking" and description "Cut down on smoking gradually".
        await user.clear(nameInput);
        await user.type(nameInput, 'Reduce Smoking');
        await user.type(descriptionInput, 'Cut down on smoking gradually');
        await user.selectOptions(colorInput, '#f8aaaa');
        await user.click(quitButton);
        await user.selectOptions(goalPeriod, 'Week');
        fireEvent.change(goalValue, { target: { value: '100' } });
        fireEvent.change(unitSelected, { target: { value: 'steps' } });

        await user.click(reminderSelected);
        const reminderTime = screen.getByLabelText(/Select Time:/i);
        // now the textbox should appear
        const reminderMessage = await screen.findByRole('textbox', {
        name: /Reminder Message/i
        });
        fireEvent.change(reminderTime, { target: { value: '13:00' } });
        fireEvent.change(reminderMessage, { target: { value: 'Yes' } });

        await user.click(submitButton);

        expect(mockAddHabit).toHaveBeenCalledTimes(1);
        expect(mockAddHabit).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Reduce Smoking',
                description: 'Cut down on smoking gradually',
                emoji: '📝',
                type: 'Quit',
                color: '#f8aaaa',
                goal:{ 
                    value: "100", 
                    period: 'Week', 
                    unit: 'steps', 
                    taskDays: 'everyday',
                    numOfDays: 0,
                    daysSelected: []
                },
                priority: "none",
                reminder: {
                    activated: true,
                    message: "Yes",
                    time: "13:00"
                },
                startDate: "",
                endDate: "",
                isActive: true
            })
        );
    });

        // Test checks building a basic quit habit w/ color
    test('Successfully created a Quit habit with priority set', async () => {
        const user = userEvent.setup();
        const mockAddHabit = vi.fn().mockResolvedValue();

        render(
            <AuthContext.Provider value={{ uid: '123' }}>
            <HabitCreate addHabit={mockAddHabit} />
            </AuthContext.Provider>
        );

        // Open popup first
        await user.click(screen.getByTitle(/Add Habit/i));

        // Go to custom screen
        await user.click(screen.getByTitle(/Custom/i));

        // Find the elements in habitCreate.jsx needed to accomplish habit creation.
        const nameInput = screen.getByLabelText(/Habit Name/i);
        const descriptionInput = screen.getByLabelText(/Habit Description/i);
        const colorInput = screen.getByLabelText(/Set Color:/i);
        const quitButton = screen.getByRole('button', { name: /Quit/i });

        const goalPeriod = screen.getByLabelText(/Goal Period:/i);
        const goalValue = screen.getByLabelText(/Goal Value:/i);
        const unitSelected = screen.getByRole('combobox', { name: /unit/i });
        const submitButton = screen.getByRole('button', { name: /Create Habit/i });

        const reminderSelected = screen.getByLabelText(/Want to be reminded?/i);

        // Performing the action that a user would do via code.
        // Essentially simulating a user creating a quit habit 
        // with the name "Reduce Smoking" and description "Cut down on smoking gradually".
        await user.clear(nameInput);
        await user.type(nameInput, 'Reduce Smoking');
        await user.type(descriptionInput, 'Cut down on smoking gradually');
        await user.selectOptions(colorInput, '#f8aaaa');
        await user.click(quitButton);
        await user.selectOptions(goalPeriod, 'Week');
        fireEvent.change(goalValue, { target: { value: '100' } });
        fireEvent.change(unitSelected, { target: { value: 'steps' } });

        await user.click(reminderSelected);
        const reminderTime = screen.getByLabelText(/Select Time:/i);
                const reminderMessage = await screen.findByRole('textbox', {
        name: /Reminder Message/i
        });
        fireEvent.change(reminderTime, { target: { value: '13:00' } });
        fireEvent.change(reminderMessage, { target: { value: 'Yes' } });
        
        const prioritySelect = screen.getByLabelText(/Set Priority:/i);
        await user.selectOptions(prioritySelect, 'high');

        await user.click(submitButton);

        expect(mockAddHabit).toHaveBeenCalledTimes(1);
        expect(mockAddHabit).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Reduce Smoking',
                description: 'Cut down on smoking gradually',
                emoji: '📝',
                type: 'Quit',
                color: '#f8aaaa',
                goal:{ 
                    value: "100", 
                    period: 'Week', 
                    unit: 'steps', 
                    taskDays: 'everyday',
                    numOfDays: 0,
                    daysSelected: []
                },
                priority: "high",
                reminder: {
                    activated: true,
                    message: "Yes",
                    time: "13:00"
                },
                startDate: "",
                endDate: "",
                isActive: true
            })
        );
    });
});