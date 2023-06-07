import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TimeRemaining } from "../components/TimeRemaining";
import { styled } from "styled-components";

const Option = styled.div`
    :before {
        content: '';
        height: 100%;
        width: ${({ $votes = 1, $totalVotes = 1 }) => `${($votes * 100) / $totalVotes}%`};
        position: absolute;
        left: 0;
        top: 0;
        background-color: cyan;
        z-index: -1;
        border-radius: .25rem 0 0 .25rem;
    }
`;

export function Poll({ socket }) {
    const params = useParams();
    const [poll, setPoll] = useState(null);
    const [voted, setVoted] = useState(false);

    useEffect(() => {
        const getPoll = async () => {
            const pollRes = await fetch(`http://localhost:4040/polls/${params.id}`);
            const poll = await pollRes.json();
            if(poll.error) {
                return;
            }
            if(!poll.isFinished) {
                socket.emit("join poll", params.id);
            }
            setPoll(poll);
        }
        getPoll();
        socket.on("votes", () => getPoll());
    }, [socket, params, setPoll]);

    if(!poll) {
        return;
    }

    const vote = async (e, opt) => {
        e.preventDefault();
        await fetch(`http://localhost:4040/polls/${params.id}/options/${opt.id}/vote`, {
            method: "POST"
        });
        setVoted(true);
    }

    const mostVotedOpt = poll.options.reduce((p, c) => c._count.votes > p._count.votes ? c : p);

    return (
        <div className="container p-4">
            <div className="flex flex-col gap-1 mb-4 justify-between md:flex-row md:items-center">
                <h2 className="text-2xl">
                    {poll.title}
                </h2>
                <h3 className="text-xl bottom-2 bg-gradient-to-br from-green-500 to-blue-300 w-fit px-2 rounded-md md:ml-auto">
                    {poll.totalVotes} votes
                </h3>
                <div>
                    <TimeRemaining poll={poll} />
                </div>
            </div>
            <ul className="flex flex-col gap-2">
                {poll.options.map((opt, i) => (
                    <Option key={opt.id} className="relative flex items-center gap-2 p-2 border rounded font-semibold" $votes={opt._count.votes} $totalVotes={mostVotedOpt._count.votes}>
                        <h2>{opt.name}</h2>
                        {(poll.isFinished || voted) && <p className="ml-auto">{opt._count.votes}</p>}
                        {(!poll.isFinished) && (
                            <svg onClick={e => vote(e, opt)} className={`pointer-events-auto w-5 h-5 mb-[-3px] ${!voted && "ml-auto"} path-circle hover:cursor-pointer hover:bg-gray-200 transition}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
                            </svg>
                        )}
                    </Option>
                ))}
            </ul>
        </div>
    )
}