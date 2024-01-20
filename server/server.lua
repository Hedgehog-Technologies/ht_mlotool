local systemIsWindows <const> = os.getenv('OS'):match('[Ww]indows')
local resourcePath <const> = GetResourcePath(cache.resource):gsub('//', '/')
local savedMLODir <const> = 'saved_mlos'
local savedMloDirectoryPath <const> = ('%s/%s'):format(resourcePath, savedMLODir)
local generatedFilesDirectoryPath <const> = resourcePath .. '/generated_files'

local filenames = {}
local mloFilenameLookup = {}

-- ##### HELPER FUNCTIONS ##### --

local function canUseMloTool(playerId)
    return IsPlayerAceAllowed(playerId, 'command.openmlo')
end

local function canUseSaveMlo(playerId)
    return IsPlayerAceAllowed(playerId, 'command.savemlo')
end

local function getFilesInDirectory(path, pattern)
    local files = {}
    local fileCount = 0
    local command = systemIsWindows and 'dir "' or 'ls "'
    local suffix = command == 'dir "' and '/" /b' or '/"'
    local dir = io.popen(command .. resourcePath .. '/' .. path .. suffix)

    if dir then
        for line in dir:lines() do
            if line:match(pattern) then
                fileCount += 1
                files[fileCount] = line:gsub(pattern, '')
            end
        end

        dir:close()
    end

    return files, fileCount
end

local function readFile(source, filepath, filename, filetype)
    local fullPath = ('%s/%s.%s'):format(filepath, filename, filetype)
    local file, err = io.open(fullPath, 'r')
    local data = nil

    if not file then
        print('^1' .. err)

        if source ~= nil then
            lib.notify(source, {
                type = 'error',
                title = locale('open_file_fail'),
                description = locale('check_server_logs')
            })
        end

        return nil
    end

    data = file:read('a')
    file:close()

    return data
end

local function writeFile(source, filepath, filename, filetype, dataString)
    local fullPath = ('%s/%s.%s'):format(filepath, filename, filetype)
    local file, openError = io.open(fullPath, 'w+')

    if file == nil then
        print('^1' .. openError)
        lib.notify(source, {
            type = 'error',
            title = locale('open_output_file_fail'),
            description = locale('check_server_logs')
        })
        return false
    end

    local _, writeError = file:write(dataString)

    if writeError ~= nil then
        print('^1' .. writeError)
        lib.notify(source, {
            type = 'error',
            title = locale('write_output_fail'),
            description = locale('check_server_logs')
        })
    end

    file:close()

    return writeError == nil
end

local function loadMLOData(source, filename, nameHashString, openUI)
    local data = nil

    if filename ~= nil and nameHashString ~= nil then
        data = readFile(source, savedMloDirectoryPath, filename, 'json')

        if data then data = json.decode(data) end
    end

    if data ~= nil and tostring(data.nameHash) == nameHashString then
        TriggerLatentClientEvent('ht_mlotool:loadMLOData', source, 100000, data, openUI)
    end
end

local function pathExists(path)
    local ok, err, code = os.rename(path, path)
    if not ok then
        -- Permission denied, but path exists
        if code == 13 then
            return true
        end
    end

    return ok, err
end

local function verifyOrCreateOutputDirectory(dirName)
    local dirPath = ('%s/%s'):format(generatedFilesDirectoryPath, dirName)

    if systemIsWindows then
        dirPath = dirPath:gsub('/', '\\')
    end

    if not pathExists(dirPath) then
        local ok, err, code = os.execute(('mkdir %s'):format(dirPath))

        if not ok then
            print(locale('create_output_dir_fail', dirPath, err, code))
            return generatedFilesDirectoryPath
        end
    end

    return dirPath
end

-- ##### EVENTS & CALLBACKS ##### --

RegisterNetEvent('ht_mlotool:outputResultFile', function(saveFileName, filename, filetype, ymtData, debug)
    local source = source
    if not canUseMloTool(source) then
        return print(locale('warning_server') .. locale('incorrect_perms', source, GetPlayerName(source)))
    end

    local mloDirName = type(saveFileName) ~= 'table' and saveFileName or mloFilenameLookup[tostring(saveFileName.nameHash)] or saveFileName.name:gsub('hash_', '')
    local outputDirPath = verifyOrCreateOutputDirectory(mloDirName)
    local success = writeFile(source, outputDirPath, filename, filetype, ToXml(ymtData, debug))

    local type = success and 'success' or 'error'
    local color = success and '^7' or '^1'
    local title = success and locale('file_save_success') or locale('file_save_fail')
    print(color .. title .. (': %s.%s'):format(filename, filetype))
    lib.notify(source, { type = type, title = title, description = ('%s.%s'):format(filename, filetype) })
end)

RegisterNetEvent('ht_mlotool:saveMLOData', function(mloInfo)
    local source = source
    if not canUseMloTool(source) and not canUseSaveMlo(source) then
        return print(locale('incorrect_perms', source, GetPlayerName(source)))
    end

    local filename = mloInfo.saveName ~= '' and mloInfo.saveName or mloFilenameLookup[tostring(mloInfo.nameHash)] or mloInfo.name:gsub('hash_', '')
    mloFilenameLookup[tostring(mloInfo.nameHash)] = filename

    local writeSuccess = writeFile(source, savedMloDirectoryPath, filename, 'json', json.encode(mloInfo, { indent = true }))

    if writeSuccess then
        print(locale('save_mlo_success') .. (': %s/%s.json'):format(savedMLODir, filename))
        lib.notify(source, {
            type = 'success',
            title = locale('save_mlo_success'),
            description = ('%s/%s.json'):format(savedMLODir, filename)
        })
    else
        print('^1' .. locale('save_mlo_fail') .. (': %s/%s.json'):format(savedMLODir, filename))
        lib.notify(source, {
            type = 'error',
            title = locale('save_mlo_fail'),
            description = ('%s/%s.json'):format(savedMLODir, filename)
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
        if args.force == 1 then
            local nameHash = lib.callback.await('ht_mlotool:getMLONameHash', source)

            if nameHash ~= nil then
                local filename = mloFilenameLookup[tostring(nameHash)]

                if filename then
                    data = readFile(source, savedMloDirectoryPath, filename, 'json')

                    if data then data = json.decode(data) end
                else
                    print(locale('warning_server') .. locale('no_filename_name_hash', nameHash))
                    lib.notify(source, {
                        type = 'warning',
                        title = locale('warning'),
                        description = locale('no_filename_name_hash', nameHash)
                    })
                end
            else
                print(locale('warning_server') .. locale('user_not_in_mlo'))
                return lib.notify(source, {
                    type = 'warning',
                    title = locale('warning'),
                    description = locale('user_not_in_mlo')
                })
            end
        elseif args.force == 2 then
            data = false
        end
    end

    TriggerLatentClientEvent('ht_mlotool:openMLO', source, 100000, data)
end)

-- ##### INITIALIZATION THREAD ##### --

CreateThread(function()
    lib.versionCheck('Hedgehog-Technologies/ht_mlotool')

    local files, fileCount = getFilesInDirectory(savedMLODir, '%.json')

    if fileCount > 0 then
        print(locale('found_mlo_json_files', fileCount))
    end

    for i = 1, fileCount do
        local filename = files[i]
        local mloDataString = readFile(nil, savedMloDirectoryPath, filename, 'json')

        if mloDataString ~= nil then
            local mloData = json.decode(mloDataString)

            if mloData and mloData.nameHash then
                mloFilenameLookup[tostring(mloData.nameHash)] = filename
                filenames[#filenames + 1] = filename
            end
        end
    end
end)
