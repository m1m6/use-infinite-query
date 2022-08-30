import React, { FormEvent, useState } from 'react';
import { useCreateUserMutation } from './useCreateUserMutation';

export default function CreateUser() {
  const [error, setError] = useState('');
  const { mutate, isLoading } = useCreateUserMutation();

  const onSubmitHandler = async (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const formTarget = (form.target as HTMLFormElement);
    const formData = new FormData(formTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;

    if (!firstName) {
      setError('Please enter a valid first name');
      document.getElementById('firstNameInput')?.focus();
      return;
    }

    if (!lastName) {
      setError('Please enter a valid last name');
      document.getElementById('lastNameInput')?.focus();
      return;
    }

    if (!email) {
      setError('Please enter a valid email');
      document.getElementById('email')?.focus();
      return;
    }

    mutate({
      firstName,
      lastName,
      email
    }, {
      onSuccess: () => {
        alert('User added successfully');
      },
      onError: (response) => {
        alert('Failed to create user');
        console.log(response);
      }
    })
  }

  return (
    <div style={{ margin: '20px' }} className='create-user-form' data-testid="create-user-form">
      <h1>Create User:</h1>
      <form onSubmit={onSubmitHandler}>
        <div className='form-input'>
          <label htmlFor='firstNameInput'>First Name: </label>
          <input type="text" name="firstName" id="firstNameInput" />
        </div>

        <div className='form-input'>
          <label htmlFor='lastNameInput'>Last Name: </label>
          <input type="text" name="lastName" id="lastNameInput" />
        </div>

        <div className='form-input'>
          <label htmlFor='emailInput'>Email: </label>
          <input type="email" name="email" id="emailInput" />
        </div>
        {
          error && <div style={{ color: 'red', fontSize: '18px' }}>{error}</div>
        }
        <br />
        <button type='submit' className="submit-button">Submit</button>
      </form>
      <hr />
    </div>
  );
}