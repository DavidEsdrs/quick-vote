import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export function CreatePoll() {
    const navigate = useNavigate();
    const [useExpiresIn, setUseExpiresIn] = useState(false);
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [expiresIn, setExpiresIn] = useState({ date: null, hours: 0 });
    const [options, setOptions] = useState([ { name: "" } ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {
            title,
            options,
            duration: !useExpiresIn ? fixDuration(duration) : undefined,
            expiresIn: useExpiresIn ? expiresIn : undefined
        };
        const headers = {"Content-type": "application/json; charset=UTF-8"}
        await fetch("http://localhost:4040/polls", {
            method: "POST",
            body: JSON.stringify(body),
            headers
        });
        setTitle("");
        setDuration({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setExpiresIn({ date: null, hours: 0 });
        setOptions([ { name: "" } ]);
        navigate("/polls", { replace: true });
    }

    const fixDuration = (drt) => {
        let res = "";
        if(duration.days) {
            res += `${duration.days}d `
        }

        if(duration.hours) {
            res += `${duration.hours}h `
        }

        if(duration.minutes) {
            res += `${duration.minutes}m `
        }

        if(duration.seconds) {
            res += `${duration.seconds}s `
        }
        return res;
    }

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            <h1 className="text-2xl mb-4">
                Create poll
            </h1>
            <div className="w-full flex flex-col items-center">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <label className="flex flex-col w-3/6">
                        <span className="text-xl">
                            Text
                        </span>
                        <input className="border w-96 px-4 py-2 rounded-xl" placeholder="Title" type="text" onChange={e => setTitle(e.target.value)} value={title} />
                    </label>
                    {useExpiresIn ? (
                        <div className="flex flex-col">
                            <label className="flex flex-col w-3/6">
                                <span className="text-xl">
                                    Expires in
                                </span>
                                <input 
                                    className="border w-96 px-4 py-2 rounded-xl" 
                                    placeholder="Expires in" 
                                    type="date"
                                    onChange={e => {
                                        // TODO: is this really necessary? new Date(e.target.value) does the thing?
                                        const fixedDate = new Date(e.target.value).toLocaleDateString(undefined, { day: "numeric", month: "numeric", year: "numeric" });
                                        setExpiresIn(prev => ({ ...prev, date: fixedDate }))
                                    }} 
                                />
                            </label>
                            <label className="flex flex-col w-3/6">
                                <span className="text-xl">
                                    Hour
                                </span>
                                <input 
                                    className="border w-96 px-4 py-2 rounded-xl" 
                                    placeholder="Expires in" 
                                    type="time" 
                                    onChange={e => setExpiresIn(prev => ({ ...prev, hours: e.target.value }))}
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <label className="flex flex-col w-3/6">
                                <span className="text-xl">
                                    Days
                                </span>
                                <input 
                                    className="border w-96 px-4 py-2 rounded-xl" 
                                    placeholder="days" 
                                    type="number" 
                                    min={0} 
                                    max={365}
                                    onChange={e => setDuration(prev => ({ ...prev, days: Number(e.target.value) }))} 
                                />
                            </label>
                            <label className="flex flex-col w-3/6">
                                <span className="text-xl">
                                    Hours
                                </span>
                                <input 
                                    className="border w-96 px-4 py-2 rounded-xl" 
                                    placeholder="hours" 
                                    type="number" 
                                    min={0} 
                                    onChange={e => setDuration(prev => ({ ...prev, hours: Number(e.target.value) }))} 
                                />
                            </label>
                            <label className="flex flex-col w-3/6">
                                <span className="text-xl">
                                    Minutes
                                </span>
                                <input 
                                    className="border w-96 px-4 py-2 rounded-xl" 
                                    placeholder="minutes" 
                                    type="number" 
                                    min={0} 
                                    max={59} 
                                    onChange={e => setDuration(prev => ({ ...prev, minutes: Number(e.target.value) }))}
                                />
                            </label>
                            <label className="flex flex-col w-3/6">
                                <span className="text-xl">
                                    Seconds
                                </span>
                                <input 
                                    className="border w-96 px-4 py-2 rounded-xl" 
                                    placeholder="seconds" 
                                    type="number" 
                                    min={0} 
                                    max={59} 
                                    onChange={e => setDuration(prev => ({ ...prev, seconds: Number(e.target.value) }))} 
                                />
                            </label>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <label>
                            <input className="mr-2" type="radio" onClick={e => setUseExpiresIn(!useExpiresIn)} name="duration__expiration" checked={!useExpiresIn} />
                            <span>
                                Set duration
                            </span>
                        </label>
                        <label>
                            <input className="mr-2" type="radio" onClick={e => setUseExpiresIn(!useExpiresIn)} name="duration__expiration" checked={useExpiresIn} />
                            <span>
                                Set expiration date
                            </span>
                        </label>
                    </div>
                    <h2 className="text-xl">
                        Options
                    </h2>
                    {options.map((opt, i) => (
                        <label key={i} className="border w-96 rounded-xl flex items-center pr-2">
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 rounded-l-xl mr-2" 
                                placeholder="option" 
                                onChange={(e) => {
                                    const newArr = [...options];
                                    newArr[i].name = e.target.value;
                                    setOptions(newArr);
                                }}
                                value={options[i].name}
                            />
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="w-6 h-6 cursor-pointer text-gray-400 hover:text-red-600 transition"
                                onClick={() => setOptions(options.filter((_, j) => i !== j))}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </label>
                    ))}
                    <button type="button" className="bg-gray-200 w-fit px-2 py-1 font-semibold rounded-md" onClick={() => setOptions(prev => [...prev, { name: "" }])}>
                        + add option
                    </button>
                    <button type="submit" className="mt-2 w-fit bg-green-200 font-semibold text-xl px-4 py-2 rounded-xl transition hover:bg-green-100 active:bg-green-400">
                        CREATE
                    </button>
                </form>
            </div>
        </div>
    )
}