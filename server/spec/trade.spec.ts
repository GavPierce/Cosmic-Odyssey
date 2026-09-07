import TradeService from '../services/trade';
import ValidationError from '../errors/validation';

describe('trade', () => {

    const fromPlayerId: any = 1;
    const toPlayerId: any = 2;

    let service: TradeService;
    let fakePlayerService: any;
    let fakeDiplomacyService: any;
    let fakeGameRepo: any;
    let fakePlayerCreditsService: any;
    let fakeLedgerService: any;
    let fakeGameTypeService: any;
    let fakeReputationService: any;

    const research = (levels: { [key: string]: number }) => {
        const result: any = {};

        Object.keys(levels).forEach(key => {
            result[key] = {
                level: levels[key],
                progress: 0
            };
        });

        return result;
    };

    const createPlayer = (id: any, levels: { [key: string]: number }, credits: number = 1000): any => {
        return {
            _id: id,
            credits,
            research: research(levels)
        };
    };

    const createGame = (fromPlayer: any, toPlayer: any, tradeCost: number = 15) => {
        return {
            _id: 'game-1',
            state: {
                tick: 4
            },
            settings: {
                player: {
                    tradeCost,
                    tradeScanning: 'all'
                },
                diplomacy: {
                    enabled: 'disabled',
                    tradeRestricted: 'disabled'
                }
            },
            galaxy: {
                players: [fromPlayer, toPlayer]
            }
        } as any;
    };

    beforeEach(() => {
        fakePlayerService = {
            getById(game, id) {
                return game.galaxy.players.find(p => p._id === id);
            }
        };

        fakeDiplomacyService = {
            isFormalAlliancesEnabled() { return false; },
            isTradeRestricted() { return false; },
            getDiplomaticStatusToPlayer() {
                return { actualStatus: 'allies' };
            }
        };

        fakeGameRepo = {
            async bulkWrite() { }
        };

        fakePlayerCreditsService = {
            async addCredits() {
                return { updateOne: {} };
            }
        };

        fakeLedgerService = {
            async addDebt() { }
        };

        fakeGameTypeService = {
            isTutorialGame() { return true; }
        };

        fakeReputationService = {
            async tryIncreaseReputationTechnology() {
                return {
                    increased: false,
                    rep: {
                        reputation: { score: 0 }
                    }
                };
            }
        };

        service = new TradeService(
            fakeGameRepo,
            {} as any,
            {} as any,
            fakePlayerService,
            fakeDiplomacyService,
            fakeLedgerService,
            {} as any,
            fakeReputationService,
            fakeGameTypeService,
            {} as any,
            fakePlayerCreditsService,
            {} as any
        );
    });

    describe('listTradeableTechnologies', () => {
        it('should only offer the next unowned level when the sender is several levels ahead', () => {
            const fromPlayer = createPlayer(fromPlayerId, {
                weapons: 5,
                scanning: 3,
                banking: 1
            });
            const toPlayer = createPlayer(toPlayerId, {
                weapons: 1,
                scanning: 2,
                banking: 1
            });
            const game = createGame(fromPlayer, toPlayer, 15);

            const result = service.listTradeableTechnologies(game, fromPlayer, toPlayerId);

            expect(result).toEqual([
                { name: 'weapons', level: 2, cost: 30 },
                { name: 'scanning', level: 3, cost: 45 }
            ]);
        });

        it('should offer the sender\'s current level when they are exactly one level ahead', () => {
            const fromPlayer = createPlayer(fromPlayerId, { weapons: 4 });
            const toPlayer = createPlayer(toPlayerId, { weapons: 3 });
            const game = createGame(fromPlayer, toPlayer, 10);

            const result = service.listTradeableTechnologies(game, fromPlayer, toPlayerId);

            expect(result).toEqual([
                { name: 'weapons', level: 4, cost: 40 }
            ]);
        });

        it('should not offer technology the recipient already owns', () => {
            const fromPlayer = createPlayer(fromPlayerId, { weapons: 3, scanning: 2 });
            const toPlayer = createPlayer(toPlayerId, { weapons: 3, scanning: 2 });
            const game = createGame(fromPlayer, toPlayer, 15);

            const result = service.listTradeableTechnologies(game, fromPlayer, toPlayerId);

            expect(result).toEqual([]);
        });

        it('should return no technologies when trading is disabled', () => {
            const fromPlayer = createPlayer(fromPlayerId, { weapons: 5 });
            const toPlayer = createPlayer(toPlayerId, { weapons: 1 });
            const game = createGame(fromPlayer, toPlayer, 0);

            const result = service.listTradeableTechnologies(game, fromPlayer, toPlayerId);

            expect(result).toEqual([]);
        });
    });

    describe('sendTechnology', () => {
        it('should reject trades that skip unpaid prior levels', async () => {
            const fromPlayer = createPlayer(fromPlayerId, { weapons: 5 }, 1000);
            const toPlayer = createPlayer(toPlayerId, { weapons: 1 });
            const game = createGame(fromPlayer, toPlayer, 15);

            try {
                await service.sendTechnology(game, fromPlayer, toPlayerId, 'weapons', 5);
                fail('expected ValidationError');
            } catch (err: any) {
                expect(err instanceof ValidationError).toBeTrue();
                expect(err.message).toContain('Cannot skip technology levels');
                expect(err.message).toContain('weapons level 2');
            }
        });

        it('should reject skipping even a single unpaid level', async () => {
            const fromPlayer = createPlayer(fromPlayerId, { scanning: 4 }, 1000);
            const toPlayer = createPlayer(toPlayerId, { scanning: 2 });
            const game = createGame(fromPlayer, toPlayer, 15);

            try {
                await service.sendTechnology(game, fromPlayer, toPlayerId, 'scanning', 4);
                fail('expected ValidationError');
            } catch (err: any) {
                expect(err instanceof ValidationError).toBeTrue();
                expect(err.message).toContain('Cannot skip technology levels');
                expect(err.message).toContain('scanning level 3');
            }
        });

        it('should allow trading the next sequential unowned level', async () => {
            const fromPlayer = createPlayer(fromPlayerId, { weapons: 5 }, 1000);
            const toPlayer = createPlayer(toPlayerId, { weapons: 1 });
            const game = createGame(fromPlayer, toPlayer, 15);

            const result = await service.sendTechnology(game, fromPlayer, toPlayerId, 'weapons', 2);

            expect(result.technology).toEqual({
                name: 'weapons',
                level: 2,
                difference: 1
            });
        });

        it('should not trade a technology the sender does not own', async () => {
            const fromPlayer = createPlayer(fromPlayerId, { weapons: 1 }, 1000);
            const toPlayer = createPlayer(toPlayerId, { weapons: 1 });
            const game = createGame(fromPlayer, toPlayer, 15);

            try {
                await service.sendTechnology(game, fromPlayer, toPlayerId, 'weapons', 2);
                fail('expected ValidationError');
            } catch (err: any) {
                expect(err instanceof ValidationError).toBeTrue();
                expect(err.message).toContain('cannot be traded');
            }
        });
    });

});
