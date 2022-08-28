import React, { FormEvent } from 'react';

export default function CreateUser() {

  const onSubmitHandler = async (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault();
    const formTarget = (form.target as HTMLFormElement);
    const formData = new FormData(formTarget);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');

    console.log(firstName, lastName, email);
  }

  return (
    <div style={{ margin: '20px' }} className='create-user-form'>
      <h1>Create User:</h1>
      <form onSubmit={onSubmitHandler}>
        <div className='form-input'>
          <label htmlFor='firstNameInput'>First Name: </label>
          <input type="text" name="firstName" required id="firstNameInput" />
        </div>

        <div className='form-input'>
          <label htmlFor='lastNameInput'>Last Name: </label>
          <input type="text" name="lastName" required id="lastNameInput" />
        </div>

        <div className='form-input'>
          <label htmlFor='emailInput'>Email: </label>
          <input type="email" name="email" required id="emailInput" />
        </div>
        <br />
        <button type='submit' className="submit-button">Submit</button>
      </form>
      <hr />
    </div>
  );
}