local Config = require 'shared.config'

---@type InteriorFileCacheApi
local FileCache = require 'new_server.helpers.interiorfilecache'

lib.addCommand('openmlo', {
    help = locale('cmd_openmlo_help'),
    restricted = 'group.admin',
    params = {
        {
            name = 'force',
            help = locale('cmd_openmlo_force_help'),
            type = 'number',
            optional = true
        }
    }
}, function(source, args, raw)
    local data = nil

    if args.force then
        -- Force reload from file, if it exists
        if args.force == 1 then
            local nameHash = lib.callback.await('ht_mlotool:getInteriorNameHash', source)
    
            if nameHash ~= nil then
                data = FileCache.getDataForInterior(source, nameHash, true)
            else
                local msg = locale('user_not_in_mlo')

                lib.print.warn(msg)
                TriggerClientEvent('ox_lib:notify', source, {
                    type = 'warning',
                    title = locale('warning'),
                    description = msg
                })

                return
            end
        elseif args.force == 2 then
            data = false
        end
    end

    TriggerLatentClientEvent('ht_mlotool:openInterior', source, Config.serverToClientBPS, data)
end)