import { StreamChat } from 'stream-chat';
import { stream_api } from "../../modules/backend/constants";


export const stream_client = new StreamChat(stream_api);
