import { chatClient, streamClient } from "../lib/stream.js"
import Session from "../models/Session.js"


export async function createSession(req, res) {
    try {
        const { problem, difficulty } = req.body
        const userId = req.user._id //_id doubt
        const clerkId = req.user.clerkId

        if (!problem || !difficulty) return res.status(400).json({ message: "Problem and difficultly is required" })

        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`

        //create session in db
        //doubt
        const session = await Session.create({ problem, difficulty, host: userId, callId })

        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: { problem, difficulty, sessionId: session._id.toString() }
            }
        })


        const channel = chatClient.channel("messaging", callId, {
            name: `${problem} Session`,
            created_by_id: clerkId,
            memebers: [clerkId]
        })

        await channel.create()

        res.status(201).json({ session })
    }
    catch (error) {
        console.log("Error in createSession controller", error.message);
        res.status(500).json({ message: "Internal server Error" })
    }
}

export async function getActiveSessions(_, res) {
    try {
        const session = await Session.find({ status: "active" })
            .populate("host", "name profileImage email clerkId")
            .sort({ createdAt: -1 })
            .limit(20)

        res.status(200).json({ session })
    } catch (error) {
        console.log("Error in getActiveSessions controller :", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }

}

export async function getMyRecentSessions(req, res) {
    try {
        const userId = req.user._id
        const session = await Session.find({
            status: "completed",
            $or: [{ host: userId }, { participant: userId }]
        }).sort({ createdAt: -1 })
            .limit(20)
    } catch (error) {
        console.log("Error in getMyRecentSessions controller :", error.message);
        res.status(500).json({ message: "Internal Server Error" })
    }

}

export async function getSessionById(req, res) {
    try {
        const id = req.params

        const session = await Session.findById(id)
            .populate("host", "name profileImage email clerkId")
            .populate("participant", "name profileImage email clerkId")

        if (!session) return res.status(404).json({ message: "Session not found" })

        res.status(200).json({ session })
    } catch (error) {
        console.log("Error in getSessionById controller", error.message);
        res.status(500).json({ message: "Internal Server Error" })

    }
}


export async function joinSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id
        const clerkId = req.user.clerkId

        const session = await Session.findById(id)
        //dount in taking instance and its sacving
        if (!session) return res.status(404).json({ message: "Session not found" })

        if (session.participant) return res.status(404).json({ message: "Session is full" })

        session.participant = userId

        await session.save() //issue there to  fix 

        //doubt
        // create stream chat channel
        const channel = chatClient.channel("messaging", session.callId)
        await channel.addMembers([clerkId])
        res.status(200).json({ session })
    } catch (error) {
        console.log("Error in joinSession controller", error.message);
        res.status(500).json({ message: "Internal Server ErroR" })
    }
}

export async function endSession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user._id
        const clerkId = req.user.clerkId

        const session = await Session.findById(id)
        //Doubt in taking instance
        if (!session) return res.status(404).json({ message: "Session not found" })

        // check if user is the host
        if (session.host.toString() !== userId.toString()) {
            return res.status(404).json({ message: "Only the host can end the session" })
        }
        // check if session is already completed
        if (session.status === "completed") {
            return res.status(404).json({ message: "Session already completed" })
        }

        session.status === "completed"
        await session.save()

        //doubt
        // delete stream video call
        const call = streamClient.video.call("default",session.callId);
        await call.delete({hard:true})

        //doubt
        // delete stream chat channel
        const channel = chatClient.channel("messaging",session.callId)
        await channel.delete()

        res.status(200).json({ session, message: "Session ended successfully" })

    } catch (error) {
        console.log("Error in endSession controller", error.message);
        res.status(500).json({ message: "Internal Server ErroR" })

    }
}