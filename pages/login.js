export default function CartPage() {
  return (
    <>
      <form action="/api/user" method="POST">
        <input name="email" type="email" class="border-2" />
        <button className="bg-gray-100">Zaloguj/Zarejestruj się</button>
      </form>
    </>
  );
}
