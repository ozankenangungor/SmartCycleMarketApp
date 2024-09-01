import { RequestHandler } from "express";
import { isValidObjectId, ObjectId, StringExpressionOperatorReturningNumber } from "mongoose";
import ConversationModel from "src/models/conversation";
import UserModel from "src/models/user";
import { sendErrorRes } from "src/utils/helper";


export const getOrCreateConversation: RequestHandler = async (req, res) => {
    const {peerId} = req.params
    if(!isValidObjectId(peerId)) return sendErrorRes(res,"Invalid peer id", 422);

    const user = await UserModel.findById(peerId)
    if(!user) return sendErrorRes(res, "User not found", 404);

    const participants = [req.user.id, peerId] // ["Ozan","Kenan"]
    const participantsId = participants.sort().join("_") // " Ozan_Kenan "

    const conversation = await ConversationModel.findOneAndUpdate({participantsId},{
        // insert only if upsert founds nothing as participants
        $setOnInsert: {
            participantsId,
            participants
        }
    },{upsert: true, new: true})
    
    
    res.json({conversationId: conversation._id})
}
interface Chat {
    text: string;
    time: string;
    id: string;
    user: {
        id: string;
        name: string;
        avatar?: string;
    }
}
interface Conversation {
    id: string;
    chats: Chat[];
    peerProfile: {
        id: string;
        name: string;
        avatar?: string
    }
}
type PopulatedChat = {
    _id: ObjectId,
    content: string,
    timestamp: Date,
    viewed: boolean,
    sentBy: {
        _id: ObjectId,
        name: string,
        avatar: {url: string}
    }
}

type PopulatedParticipant = {
    _id: ObjectId,
    name: string,
    avatar?: {url: string}
}
export const getConversations: RequestHandler = async (req, res) => {
    const {conversationId} = req.params
    if(!isValidObjectId(conversationId)) return sendErrorRes(res, "Invalid chat id", 422);

    const conversation = await ConversationModel.findById(conversationId).populate<{chats: PopulatedChat[]}>({path: 'chats.sentBy', select: 'name avatar.url'})
    .populate<{participants: PopulatedParticipant[]}>({path: 'participants', match: {_id: {$ne: req.user.id}}// Filter out the logged-in user
    , select: "name avatar.url"}).select('sentBy chats._id chats.content chats.timestamp chats.viewed participants')

    if(!conversation) return sendErrorRes(res, "Details not found", 404);

    const peerProfile = conversation.participants[0]

    const finalConversation: Conversation = {
        id: conversation._id+"",
        chats: conversation.chats.map(c => ({
            id: c._id.toString(),
            text: c.content,
            time: c.timestamp.toISOString(),
            viewed: c.viewed,
            user: {
                id: c.sentBy._id.toString(),
                name: c.sentBy.name,
                avatar: c.sentBy.avatar?.url
            }
        })),
        peerProfile: {
            id: peerProfile._id.toString(),
            name: peerProfile.name,
            avatar: peerProfile.avatar?.url
        }
    }

   // console.log(JSON.stringify(conversation, null, 2 ))
    res.json({conversation: finalConversation})
}




export const getLastChats: RequestHandler = async (req, res) => {
    const chats = await ConversationModel.aggregate([
        {$match: {
            participants: req.user.id
        }},
        {$lookup: {
            from: "users",
            localField: 'participants',
            foreignField: '_id',
            as: 'participantsInfo',
        }},
        {$project: {
            _id: 0,
            id: "$_id",
            participants: {
                $filter: {
                    input: "$participantsInfo",
                    as: "participant",
                    cond: {$ne: ["$$participant._id", req.user.id]}
                }
            },
            lastChat: {
                $slice: ["$chats", -1]
            },
            unreadChatCounts: {
                $size: {
                    $filter: {
                        input: "$chats",
                        as: "chat",
                        cond: {
                            $and: [
                                {$eq: ["$$chat.viewed", false]},
                                {$ne: ["$$chat.sentBy", req.user.id]}
                            ]
                        }
                    }
                }
            }
        }},
        {
            $unwind: "$participants",
        },
        {
            $unwind: "$lastChat",
        },
        {
            $project: {
                id: "$id",
                lastMessage: "$lastChat.content",
                timestamp: "$lastChat.timestamp",
                unreadChatCounts: "$unreadChatCounts",
                peerProfile: {
                    id: "$participants._id",
                    name: "$participants.name",
                    avatar: "$participants.avatar.url"
                }
            },
        },
      
    ])


    console.log(JSON.stringify(chats, null, 2))
    
    res.json({chats})
}


export const updateSeenStatus = async (peerId: string, conversationId: string) => {
    await ConversationModel.findByIdAndUpdate(conversationId, {
        $set: {
            "chats.$[elem].viewed": true
        }
    },{
        arrayFilters: [{"elem.sentBy": peerId}]
    })


    }


export const updateChatSeenStatus: RequestHandler = async (req, res) => {
    const {peerId, conversationId} = req.params

    if(!isValidObjectId(peerId) || !isValidObjectId(conversationId)) return sendErrorRes(res, "Invalid id", 422);

    // await ConversationModel.findByIdAndUpdate(conversationId, {
    //     $set: {
    //         "chats.$[elem].viewed": true
    //     },
    //     arrayFilters: [{"elem.sentBy": peerId}]
    // })

    await updateSeenStatus(peerId, conversationId)

    res.json({message: "Chat seen status updated"})

}

