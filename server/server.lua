local constants = require 'server.constants'
local htio = require 'server.fileio'

local filenames = {}
local mloFilenameLookup = {}

-- ##### HELPER FUNCTIONS ##### --

--- Checks if a player is allowed to open the MLO tool UI.
--- @param playerId number | string The id of the player to check.
--- @return boolean canUse True if the player is allowed to open the MLO tool, false otherwise.
local function canUseMloTool(playerId)
    return IsPlayerAceAllowed(playerId, 'command.openmlo')
end

--- Checks if a player is allowed to save the MLO data.
--- @param playerId number | string The id of the player to check.
--- @return boolean canSave True if the player is allowed to save the MLO data, false otherwise.
local function canUseSaveMlo(playerId)
    return IsPlayerAceAllowed(playerId, 'command.savemlo')
end

--- Loads MLO data from a saved file.
--- @param source number The source of the request.
--- @param filename string The name of the file to load.
--- @param nameHashString string The name hash in string format.
--- @param openUI boolean Whether to open the UI after loading.
local function loadMLOData(source, filename, nameHashString, openUI)
    local data = nil

    if filename ~= nil and nameHashString ~= nil then
        data = htio.readFile(source, constants.savedMloDirPath, filename, 'json')

        if data then data = json.decode(data) end
    end

    if data ~= nil and tostring(data.nameHash) == nameHashString then
        -- This value changes across sessions, we'll need to regrab it
        data.interiorId = nil
        -- Force regenerate of global portals when reloading from save file
        data.globalPortalCount = nil

        TriggerLatentClientEvent('ht_mlotool:loadMLOData', source, 100000, data, openUI)
    end
end

-- ##### EVENTS & CALLBACKS ##### --

RegisterNetEvent('ht_mlotool:outputResultFile', function(saveFileName, filename, filetype, ymtData, debug)
    local source = source
    if not canUseMloTool(source) then
        return print(locale('warning_server') .. locale('incorrect_perms', source, GetPlayerName(source)) .. '^7')
    end

    local mloDirName = type(saveFileName) ~= 'table' and saveFileName or mloFilenameLookup[tostring(saveFileName.nameHash)] or saveFileName.name:gsub('hash_', '')
    local outputDirPath = ('%s/%s'):format(constants.generatedFilesDirPath, mloDirName)
    local success = htio.createDirectory(outputDirPath)
    success = success and htio.writeFile(source, outputDirPath, filename, filetype, ToXml(ymtData, debug))

    local type = success and 'success' or 'error'
    local color = success and '^7' or '^1'
    local title = success and locale('file_save_success') or locale('file_save_fail')
    print(color .. title .. (': %s.%s'):format(filename, filetype) .. '^7')
    TriggerClientEvent('ox_lib:notify', source, {
        type = type,
        title = title,
        description = ('%s.%s'):format(filename, filetype)
    })
end)

RegisterNetEvent('ht_mlotool:saveMLOData', function(mloInfo)
    local source = source
    if not canUseMloTool(source) and not canUseSaveMlo(source) then
        return print(locale('incorrect_perms', source, GetPlayerName(source)))
    end

    -- This value changes across sessions, we'll need to regrab it
    mloInfo.interiorId = nil

    local filename = mloInfo.saveName ~= '' and mloInfo.saveName or mloFilenameLookup[tostring(mloInfo.nameHash)] or mloInfo.name:gsub('hash_', '')
    mloFilenameLookup[tostring(mloInfo.nameHash)] = filename

    local outputPath = constants.savedMLODirPath
    local success = htio.createDirectory(outputPath)
    success = success and htio.writeFile(source, outputPath, filename, 'json', json.encode(mloInfo, { indent = true }))

    if success then
        print('^7' .. locale('save_mlo_success') .. (': %s/%s.json'):format(constants.savedMLODir, filename) .. '^7')
        TriggerClientEvent('ox_lib:notify', source, {
            type = 'success',
            title = locale('save_mlo_success'),
            description = ('%s/%s.json'):format(constants.savedMLODir, filename)
        })
    else
        print('^1' .. locale('save_mlo_fail') .. (': %s/%s.json'):format(constants.savedMLODir, filename) .. '^7')
        TriggerClientEvent('ox_lib:notify', source, {
            type = 'error',
            title = locale('save_mlo_fail'),
            description = ('%s/%s.json'):format(constants.savedMLODir, filename)
        })
    end
end)

lib.callback.register('ht_mlotool:requestMLOSaveData', function(source, nameHashString)
    local filename = mloFilenameLookup[nameHashString]

    -- No known save file
    if not filename then return false end

    loadMLOData(source, filename, nameHashString, true)
    return true
end)

-- ##### COMMANDS ##### --

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
    TriggerClientEvent('ht_mlotool:saveCurrentMLO', source, name)
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
    local nameHash = lib.callback.await('ht_mlotool:getMLONameHash', source)

    if nameHash ~= nil then
        local nameHashString = tostring(nameHash)
        local name = args and args.name
        local filename = name and name:gsub('.json', '') or mloFilenameLookup[nameHashString] or nameHashString

        loadMLOData(source, filename, nameHashString, false)
    end
end)

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
            local nameHash = lib.callback.await('ht_mlotool:getMLONameHash', source)

            if nameHash ~= nil then
                local filename = mloFilenameLookup[tostring(nameHash)]

                if filename then
                    data = htio.readFile(source, constants.savedMloDirPath, filename, 'json')

                    if data then
                        data = json.decode(data)
                        -- This value changes across sessions, we'll need to regrab it
                        data.interiorId = nil
                        -- Force regenerate of global portals when reloading from save file
                        data.globalPortalCount = nil
                    end
                else
                    print(locale('warning_server') .. locale('no_filename_name_hash', nameHash) .. '^7')
                    TriggerClientEvent('ox_lib:notify', source, {
                        type = 'warning',
                        title = locale('warning'),
                        description = locale('no_filename_name_hash', nameHash)
                    })
                end
            else
                print(locale('warning_server') .. locale('user_not_in_mlo') .. '^7')
                TriggerClientEvent('ox_lib:notify', source, {
                    type = 'warning',
                    title = locale('warning'),
                    description = locale('user_not_in_mlo')
                })
                return
            end
        -- Force rebuild from scratch
        elseif args.force == 2 then
            data = false
        end
    end

    TriggerLatentClientEvent('ht_mlotool:openMLO', source, 100000, data)
end)

-- ##### INITIALIZATION THREAD ##### --

CreateThread(function()
    lib.versionCheck('Hedgehog-Technologies/ht_mlotool')

    local files, fileCount = htio.getFilesInDirectory(constants.savedMLODirPath, '%.json')

    if fileCount > 0 then
        print(locale('found_mlo_json_files', fileCount))
    end

    for i = 1, fileCount do
        local filename = files[i]
        local mloDataString = htio.readFile(nil, constants.savedMloDirPath, filename, 'json')

        if mloDataString ~= nil then
            local mloData = json.decode(mloDataString)

            if mloData and mloData.nameHash then
                mloFilenameLookup[tostring(mloData.nameHash)] = filename
                filenames[#filenames + 1] = filename
            end
        end
    end
end)
