export default function LoginPage() {
  return (
    <>
      <form action="/api/user" method="POST">
        <input name="email" type="email" className="border-2" />
        <button className="bg-gray-100">Zaloguj/Zarejestruj się</button>
      </form>
    </>
  );
}
