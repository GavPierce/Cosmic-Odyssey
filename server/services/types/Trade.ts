import { DBObjectId } from "./DBObjectId";
import { ResearchTypeNotRandom } from "./Player";

export interface TradeTechnology {
    name: ResearchTypeNotRandom;
    level: number;
    cost: number;
};

export interface TradeEvent {
    playerId: DBObjectId;
    type: string;
    data;
    sentDate: Date;
    sentTick: number;
};

export interface TradeEventTechnology {
    name: string;
    level: number;
    difference: number;
};
