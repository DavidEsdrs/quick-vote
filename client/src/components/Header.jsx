import { Link } from "react-router-dom";

export function Header() {
    return (
        <header className="bg-green-200 p-4 flex gap-4">
            <h1>
                <Link to={"/"}>
                    POLL.IT
                </Link>
            </h1>
            <nav className="flex-1 flex justify-center font-semibold">
                <ul className="flex gap-20">
                    <li>
                        <Link to={"/"}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to={"/polls/create"}>
                            Create poll
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    )
}