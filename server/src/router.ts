import { Router } from "express";
import { connection } from "./prisma";
import millit from "millit";
import { io } from "./server";

const router = Router();

router.get("/polls", async (req, res) => {
    try {
        const polls = await connection.poll.findMany({
            include: {
                options: true
            }
        });
        const fullPollsPromise = polls.map(async (poll) => {
            const v = await connection.vote.count({
                where: {
                    option: {
                        pollId: {
                            equals: poll.id
                        }
                    }
                }
            });
            const isFinished = new Date() >= poll.expiresIn;
            return { ...poll, totalVotes: v, isFinished };
        });
        const fullPolls = await Promise.all(fullPollsPromise);
        return res.json(fullPolls);
    } catch {
        return res.sendStatus(400);
    }
});

router.get("/polls/:id", async (req, res) => {
    const poll_id = Number(req.params.id);
    
    try {
        const poll = await connection.poll.findUnique({
            where: { 
                id: poll_id,
            },
            include: {
                options: {
                    include: {
                        _count: true
                    }
                }
            }
        });

        if(!poll) {
            return res.status(400).json({ error: "There is no poll with id " + poll_id });
        }

        const totalVotes = await connection.vote.count({
            where: {
                option: {
                    pollId: {
                        equals: poll.id
                    }
                }
            }
        });

        const isFinished = new Date() >= poll.expiresIn;

        return res.json({
            ...poll,
            isFinished,
            totalVotes
        });

    } catch {

    }
});

interface Option {
    name: string;
}

router.post("/polls", async (req, res) => {
    const { title, options, duration } = req.body;
    try {
        const durationMs = millit(duration) as number;
        if(isNaN(durationMs)) {
            return res.status(400).json({ error: "Couldn't parse the given duration" });
        }
        const expiresIn = new Date(Date.now() + durationMs);
        const poll = await connection.poll.create({ 
            data: { 
                title,
                durationMs: durationMs,
                expiresIn
            } 
        });
        const optionsPromise = options.map(async (option: Option) => {
            await connection.option.create({ 
                data: { 
                    name: option.name,
                    pollId: poll.id
                } 
            });
        });
        await Promise.all(optionsPromise);
        return res.json(poll);
    } catch {
        return res.sendStatus(400);
    }
});

router.post("/polls/:poll_id/options/:option_id/vote", async (req, res) => {
    const { poll_id, option_id } = req.params;
    try {
        const poll = await connection.poll.findUnique({
            where: {
                id: Number(poll_id)
            }
        });
        const now = new Date();
        const isPollOpen = poll && now <= poll.expiresIn;
        if(!isPollOpen) {
            return res.status(400).json({ error: "This poll was already closed!" });
        }
        const vote = await connection.vote.create({
            data: {
                optionId: Number(option_id)
            }
        });
        const options = await connection.option.findMany({
            where: {
                pollId: poll.id
            },
            include: {
                _count: true,
                votes: true
            }
        });
        io.to(`poll-${poll_id}`).emit("votes", options);
        return res.json(vote);
    } catch {
        return res.sendStatus(400);
    }
});

export { router }