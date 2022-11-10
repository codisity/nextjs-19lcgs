import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="my-4 grid grid-cols-2 sm:flex justify-between items-center text-gray-800 bg-gray-100 rounded-md max-w-screen-xl mx-auto">
      <span className="justify-self-start">
        <Link href="/">
          <a className="hover:bg-gray-200 rounded-md inline-flex items-center py-3 px-4">
            Sklep Next.js
          </a>
        </Link>
      </span>

      <input
        type="checkbox"
        className="hover:bg-gray-200 rounded-md inline-flex items-center sm:hidden peer appearance-none w-12 h-full justify-center justify-self-end text-3xl cursor-pointer after:content-['≡'] checked:after:content-['×']"
        aria-controls="navigation-menu"
        aria-label="Toggle navigation menu"
      />

      <ul
        className="hidden peer-checked:flex flex-col sm:flex sm:flex-row sm:items-center col-start-1 col-end-3"
        id="navigation-menu"
      >
        <li>
          <Link href="/logowanie">
            <a className="hover:bg-gray-200 rounded-md inline-flex py-3 px-4">
              Logowanie/Rejestracja
            </a>
          </Link>
        </li>
        <li>
          <Link href="/koszyk">
            <a className="hover:bg-gray-200 rounded-md inline-flex py-3 px-4">
              Koszyk
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
