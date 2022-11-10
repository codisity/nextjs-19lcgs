import axios from "axios";
import { useState } from "react";
import { langPl, responseStatus } from "../lang";

export default function LoginPage() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value;

    try {
      const response = await axios.post(form.action, { email });

      switch (response?.data?.success) {
        case responseStatus.userCreated:
        case responseStatus.userLoggingInit:
          setSuccess(langPl.checkEmail);
          break;
      }
    } catch (error) {
      if (error?.response?.data?.error === responseStatus.invalidEmail) {
        return setError(langPl.invalidEmail);
      }

      console.error(error);
    }
  }

  if (success) {
    return <>{success}</>;
  }

  if (!success) {
    return (
      <>
        <form
          className="flex flex-col gap-4"
          action="/api/user"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="email-input" className="block">
              Email
            </label>
            <input
              name="email"
              type="email"
              id="email-input"
              className="border-2 border-gray-200 rounded-md flex items-center px-3 h-12"
              placeholder="twojemail@gmail.com"
            />
            {error && <div className="text-red-500">{error}</div>}
          </div>
          <div>
            <button className="bg-gray-100 hover:bg-gray-200 rounded-md flex items-center justify-center px-6 h-12">
              Zaloguj/Zarejestruj się
            </button>
          </div>
        </form>
      </>
    );
  }
}
