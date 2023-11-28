local resourcePath = GetResourcePath(cache.resource):gsub('//', '/')
local savedMLODir = 'saved_mlos'
local savedMloDirectoryPath = ('%s/%s'):format(resourcePath, savedMLODir)
local generatedFilesDir = 'generated_files'
local generatedFilesDirectoryPath = ('%s/%s'):format(resourcePath, generatedFilesDir)

local filenames = {}
local mloFilenameLookup = {}

-- ##### HELPER FUNCTIONS ##### --

local function getFilesInDirectory(path, pattern)
    local files = {}
    local fileCount = 0
    local system = os.getenv('OS')
    local command = system and system:match('Windows') and 'dir "' or 'ls "'
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
        print(err)

        if source ~= nil then
            lib.notify(source, {
                type = 'error',
                title = 'Failed to open file',
                description = 'Check server logs for more info'
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
        print(openError)
        lib.notify(source, {
            type = 'error',
            title = 'Failed to open output file',
            description = 'Check server logs for more info'
        })
        return false
    end

    local _, writeError = file:write(dataString)

    if writeError ~= nil then
        print(writeError)
        lib.notify(source, {
            type = 'error',
            title = 'Failed to write to output file',
            description = 'Check server logs for more info'
        })
    end

    file:close()

    return writeError == nil
end

local function LoadMLOData(source, filename, nameHashString, openUI)
    local data = nil

    if filename ~= nil and nameHashString ~= nil then
        data = readFile(source, savedMloDirectoryPath, filename, 'json')

        if data then data = json.decode(data) end
    end

    if data ~= nil and tostring(data.nameHash) == nameHashString then
        TriggerLatentClientEvent('ht_mlotool:loadMLOData', source, 100000, data, openUI)
    end
end

-- ##### EVENTS & CALLBACKS ##### --

RegisterNetEvent('ht_mlotool:outputResultFile', function(filename, filetype, ymtData, debug)
    local source = source
    local success = writeFile(source, generatedFilesDirectoryPath, filename, filetype, ToXml(ymtData, debug)) --SaveResourceFile(cache.resource, filename, ToXml(ymtData, debug), -1)

    local type = success and 'success' or 'error'
    local title = success and 'File finished saving: %s' or 'Failed to save file: %s'
    lib.notify(source, { type = type, title = title:format(filename) })
end)

RegisterNetEvent('ht_mlotool:saveMLOData', function(mloInfo)
    local source = source
    local filename = mloInfo.saveName ~= '' and mloInfo.saveName or mloFilenameLookup[tostring(mloInfo.nameHash)] or mloInfo.name:gsub('hash_', '')
    mloFilenameLookup[tostring(mloInfo.nameHash)] = filename

    local writeSuccess = writeFile(source, savedMloDirectoryPath, filename, 'json', json.encode(mloInfo, { indent = true }))

    if writeSuccess then
        lib.notify(source, {
            type = 'success',
            title = 'Successfully saved MLO Info',
            description = ('./%s/%s.json'):format(savedMLODir, filename)
        })
    end
end)

lib.callback.register('ht_mlotool:requestMLOSaveData', function(source, nameHashString)
    local filename = mloFilenameLookup[nameHashString]

    -- No known save file
    if not filename then return false end

    LoadMLOData(source, filename, nameHashString, true)
end)

-- ##### COMMANDS ##### --

lib.addCommand('savemlo', {
    help = '[Admin] Save current MLO object to file',
    restricted = 'group.admin',
    params = {
        {
            name = 'name',
            help = '[Optional] If specified, will be used as the filename',
            type = 'string',
            optional = true
        }
    }
}, function(source, args, raw)
    local name = args and args.name
    TriggerClientEvent('ht_mlotool:saveCurrentMLO', source, name)
end)

lib.addCommand('loadmlo', {
    help = '[Admin] Load current MLO data from saved file if exists',
    restricted = 'group.admin',
    params = {
        {
            name = 'name',
            help = '[Optional] Name of the saved file',
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

        LoadMLOData(source, filename, nameHashString, false)
    end
end)

lib.addCommand('openmlo', {
    help = '[Admin] Open audio occlusion interface for current MLO',
    restricted = 'group.admin',
    params = {
        {
            name = 'force',
            help = '[Optional] (1) Reload from file, (2) Rebuild from scratch, or <leave blank> Use cached value if available',
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
                    print('No filename associated with name hash ' .. tostring(nameHash))
                end
            else
                print('User is not currently standing in an MLO')
            end
        elseif args.force == 2 then
            data = false
        end
    end

    TriggerLatentClientEvent('ht_mlotool:openMLO', source, 100000, data)
end)

-- ##### INITIALIZATION THREAD ##### --

CreateThread(function()
    local files, fileCount = getFilesInDirectory(savedMLODir, '%.json')

    if fileCount > 0 then
        print(('Found %d saved MLO json files.'):format(fileCount))
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
