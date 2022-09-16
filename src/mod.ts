import { DependencyContainer } from "tsyringe";
import type { SaveServer } from "@spt-aki/servers/SaveServer";
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import type { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";

class GunsmithPresets implements IPostDBLoadMod
{
    private config = require("../config/config.json");
    private gunsmithPresets = require("../src/gunsmithPresets.json");
    private logger: ILogger;

    public postDBLoad(container: DependencyContainer):void
    {
        this.logger = container.resolve<ILogger>("WinstonLogger");

        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        staticRouterModService.registerStaticRouter(
            "GunsmithPresets", [{
                url: "/client/game/start",
                action: (url, info, sessionId, output) =>
                {
                    this.initGunsmithPresets(container, sessionId);
                    return output;
                }
            }], "aki"
        );
    }

    public initGunsmithPresets(container: DependencyContainer, sessionId:any):void
    {
        const saveServer = container.resolve<SaveServer>("SaveServer");
        const profile = saveServer.getProfile(sessionId);
        
        // Check to see if workbench is unlocked in the hideout.
        //  - If not, remove all presets. Return.

        // Check which gunsmith quests are not completed.
        //  - Remove presets for quests that are not completed.
        //  - Add presets for quests that are completed.

        // Check which gunsmith tasks are active.
        //  - Add messages for introduction, all completed quests, and active quest.
        //  - Check to see if all parts in the active quest have been identified.
        //    - If all parts have been identified, add preset for the active quest, send message.

        // Re-run this function when the hideout is updated, when a quest is completed, or when an item is identified.

        for (const [preset, presetData] of Object.entries(this.gunsmithPresets))
        {
            if (Object.prototype.hasOwnProperty.call(profile.weaponbuilds, preset))
            {
                this.logger.debug(`GunsmithPresets: "${preset}" preset found.`);
            }
            profile.weaponbuilds[preset] = presetData;
        }
    }
}

module.exports = {mod: new GunsmithPresets()};
