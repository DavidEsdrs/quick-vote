import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TimeRemaining } from "../components/TimeRemaining";

export function Home({ socket }) {
    const navigate = useNavigate();
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        fetch("http://localhost:4040/polls")
            .then(res => res.json())
            .then(res => setPolls(res));
    }, [setPolls]);

    return (
        <div className="p-4">
            <h2 className="text-2xl mb-4">
                Current polls
            </h2>
            <ul className="flex flex-col gap-2 p-4 shadow-md rounded-md mb-8">
                {polls?.filter(poll => !poll.isFinished)?.map(poll => (
                    <div key={poll.id} className="relative p-2 border rounded border-gray-200 hover:cursor-pointer hover:bg-gray-100 transition" onClick={() => navigate(`/polls/${poll.id}`)}>
                        <h3 className="text-green-900 font-semibold">
                            {poll.title}
                        </h3>
                        <span>
                            {poll.isFinished ? "Poll closed" : new Date(poll.expiresIn).toLocaleString()}
                        </span>
                        <TimeRemaining absolute poll={poll} />
                    </div>
                ))}
            </ul>
            <h2 className="text-2xl mb-4">
                Finished polls
            </h2>
            <ul className="flex flex-col gap-2 p-4 shadow-md rounded-md">
                {polls?.filter(poll => poll.isFinished)?.map(poll => (
                    <div key={poll.id} className="relative p-2 border rounded border-gray-200 hover:cursor-pointer hover:bg-gray-100 transition" onClick={() => navigate(`/polls/${poll.id}`)}>
                        <h3 className="text-green-900 font-semibold">
                            {poll.title}
                        </h3>
                        <span>
                            {poll.isFinished ? "Poll closed" : new Date(poll.expiresIn).toLocaleString()}
                        </span>
                        <TimeRemaining absolute poll={poll} />
                    </div>
                ))}
            </ul>
        </div>
    )
}