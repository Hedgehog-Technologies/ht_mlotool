---@type Config
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

lib.addCommand('loadmlo', {
    help = locale('cmd_loadmlo_help'),
    restricted = 'group.admin',
    params = {
        {
            name = 'name',
            help = locale('cmd_loadmlo_name_help'),
            type = 'string',
            optional = true
        }
    }
}, function(source, args, raw)
    local filename = args and args.name

    if not filename then
        lib.print.info(locale('cmd_loadmlo_no_filename'))

        local nameHash = lib.callback.await('ht_mlotool:getInteriorNameHash', source)

        if nameHash ~= nil then
            filename = FileCache.getFilenameForInterior(nameHash)
        else
            local msg = locale('cmd_loadmlo_not_in_mlo')

            lib.print.warn(msg)
            TriggerClientEvent('ox_lib:notify', source, {
                type = 'error',
                title = locale('error'),
                description = msg
            })
        end
    end

    if filename then
        local data = FileCache.loadDataFromFile(source, filename)

        if data then
            TriggerLatentClientEvent('ht_mlotool:loadInteriorData', source, Config.serverToClientBPS, data, false)
        else
            local msg = locale('cmd_loadmlo_cannot_load_data')

            lib.print.error(msg)
            TriggerClientEvent('ox_lib:notify', source, {
                type = 'error',
                title = msg,
                description = locale('check_server_logs')
            })
        end
    end
end)

lib.addCommand('savemlo', {
    help = locale('cmd_savemlo_help'),
    restricted = 'group.admin',
    params = {
        {
            name = 'name',
            help = locale('cmd_savemlo_name_help'),
            type = 'string',
            optional = true
        }
    }
}, function(source, args, raw)
    local name = args and args.name
    TriggerClientEvent('ht_mlotool:saveCurrentInterior', source, name)
end)
