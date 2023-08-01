import { DependencyContainer } from "../services/types/DependencyContainer";

export default (container: DependencyContainer) => {

    return {

        async handler(job, done) {
            let games = await container.gameListService.listCompletedTutorials();

            for (let i = 0; i < games.length; i++) {
                let game = games[i];

                try {
                    await container.gameService.delete(game);
                } catch (e) {
                    console.error(e);
                }
            }

            done();
        }

    };
    
};
