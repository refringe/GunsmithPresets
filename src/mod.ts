import { DependencyContainer } from "tsyringe";
import type { SaveServer } from "@spt-aki/servers/SaveServer";
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import type { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";

class GunsmithPresets implements IPostDBLoadMod
{
    private config = require("../config/config.json");
    private gunsmithPresets = require("../config/gunsmithPresets.json");
    private logger: ILogger;

    public postDBLoad(container: DependencyContainer):void
    {
        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");

        staticRouterModService.registerStaticRouter(
            "GunsmithPresets", [{
                url: "/client/game/start",
                action: (url, info, sessionId, output) =>
                {
                    this.updateProfilePresets(container, sessionId);
                    return output;
                }
            }], "aki"
        );
    }

    public updateProfilePresets(container: DependencyContainer, sessionId:any):void
    {
        const saveServer = container.resolve<SaveServer>("SaveServer");
        const profile = saveServer.getProfile(sessionId);
        
    }
}

module.exports = {mod: new GunsmithPresets()};
