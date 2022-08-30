import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import CreateUser from '../CreateUser';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
})

const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

const mockedAlert = jest.fn()
global.alert = mockedAlert;

describe('CreateUser', () => {
    let firstName: HTMLInputElement;
    let lastName: HTMLInputElement;
    let email: HTMLInputElement;
    let submitButton: HTMLButtonElement;

    it('renders', () => {
        render(<CreateUser />, { wrapper });
        expect(screen.getByTestId('create-user-form')).toBeInTheDocument();
    });

    it('renders all of the fields', () => {
        render(<CreateUser />, { wrapper });
        firstName = screen.getByLabelText('First Name:');
        lastName = screen.getByText('Last Name:');
        email = screen.getByLabelText('Email:');

        expect(firstName).toBeInTheDocument();
        expect(lastName).toBeInTheDocument();
        expect(email).toBeInTheDocument();
    });

    it('handles validation and submits the form successfully', async () => {
        const user = userEvent.setup();

        render(<CreateUser />, { wrapper });
        firstName = screen.getByLabelText('First Name:');
        lastName = screen.getByText('Last Name:');
        email = screen.getByLabelText('Email:');
        submitButton = screen.getByText('Submit');

        // Click the submit button wihtout filling the form
        await user.click(submitButton);

        // First name input is empty
        expect(screen.getByText('Please enter a valid first name')).toBeInTheDocument();

        // Fill first name input by any value
        await user.type(firstName, 'JS');
        await user.click(submitButton);

        // Last name input is empty
        expect(screen.getByText('Please enter a valid last name')).toBeInTheDocument();

        // Fill last name input by any value
        await user.type(lastName, 'User');
        await user.click(submitButton);

        // Email input is empty
        expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();

        // Fill email input by any value
        await user.type(email, 'User@js-howto.com');

        // Mocking the backend request
        nock('https://dummyapi.io', {
            reqheaders: {
                'app-id': () => true
            }
        })
            .post(`/data/v1/user/create`)
            // Mocking the response with status code = 200
            .reply(200, {});

        await user.click(submitButton);
        await waitFor(() => {
            expect(mockedAlert).toHaveBeenCalledWith('User added successfully')
        });
    });

    it('submits the form with errors', async () => {
        const user = userEvent.setup();

        render(<CreateUser />, { wrapper });
        firstName = screen.getByLabelText('First Name:');
        lastName = screen.getByText('Last Name:');
        email = screen.getByLabelText('Email:');
        submitButton = screen.getByText('Submit');

        // Fill form values
        await user.type(firstName, 'JS');
        await user.type(lastName, 'User');
        await user.type(email, 'User@js-howto.com');

        // Mocking the backend request
        nock('https://dummyapi.io', {
            reqheaders: {
                'app-id': () => true
            }
        })
            .post(`/data/v1/user/create`)
            // Mocking the response with status code = 500
            .reply(500, {});

        await user.click(submitButton);
        await waitFor(() => {
            expect(mockedAlert).toHaveBeenCalledWith('Failed to create user')
        });
    });
});
