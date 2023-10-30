local resourcePath = GetResourcePath(cache.resource):gsub('//', '/')
local savedMLODir = 'saved_mlos'
local contentsFileName = 'contents'
local savedMloDirectoryPath = ('%s/%s'):format(resourcePath, savedMLODir)

local filenames = {}
local mloFilenameLookup = {}

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

RegisterNetEvent('ht_mloaudio:outputResultFile', function(filename, ymtData, debug)
    local source = source
    local success = SaveResourceFile(cache.resource, filename, ToXml(ymtData, debug), -1)

    local type = success and 'success' or 'error'
    local title = success and 'File finished saving: %s' or 'Failed to save file: %s'
    lib.notify(source, { type = type, title = title:format(filename) })
end)

RegisterNetEvent('ht_mloaudio:saveMLOData', function(mloInfo)
    local filename = mloInfo.saveName ~= '' and mloInfo.saveName or mloFilenameLookup[tostring(mloInfo.nameHash)] or mloInfo.name:gsub('hash_', '')
    mloFilenameLookup[tostring(mloInfo.nameHash)] = filename

    local writeSuccess = writeFile(source, savedMloDirectoryPath, filename, 'json', json.encode(mloInfo, { indent = true }))

    if writeSuccess then
        lib.notify(source, {
            type = 'success',
            title = 'Successfully saved MLO Info',
            description = ('./%s/%s.json'):format(savedMLODir, filename)
        })

        local contentsString = ''
        for _, fName in pairs(mloFilenameLookup) do
            contentsString = ('%s%s\n'):format(contentsString, fName)
        end

        writeFile(source, savedMloDirectoryPath, contentsFileName, 'txt', contentsString)
    end
end)

lib.addCommand('savemlo', {
    help = '[Admin] Save current MLO audio object to file',
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
    TriggerClientEvent('ht_mloaudio:saveCurrentMLO', source, args.name)
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
    local data = nil
    local nameHash = lib.callback.await('ht_mloaudio:getMLONameHash', source)

    if nameHash ~= nil then
        local filename = args.name:gsub('.json', '') or mloFilenameLookup[tostring(nameHash)] or tostring(nameHash)

        if filename then
            data = readFile(source, savedMloDirectoryPath, filename, 'json')

            if data then data = json.decode(data) end
        end
    end

    if data ~= nil and data.nameHash == nameHash then
        TriggerLatentClientEvent('ht_mloaudio:loadMLOData', source, 100000, data)
    end
end)

lib.addCommand('openmlo', {
    help = '[Admin] Open audio occlusion interface for current MLO',
    restricted = 'group.admin',
    params = {
        {
            name = 'force',
            help = '[Optional] 1) Reload from file, 2) Rebuild from scratch, or <leave blank> Use cached value',
            type = 'number',
            optional = true
        }
    }
}, function(source, args, raw)
    local data = nil

    if args.force then
        if args.force == 1 then
            local nameHash = lib.callback.await('ht_mloaudio:getMLONameHash', source)

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
            data = true
        end
    end

    TriggerLatentClientEvent('ht_mloaudio:openMLO', source, 100000, data)
end)

CreateThread(function()
    local contentsData = readFile(nil, savedMloDirectoryPath, contentsFileName, 'txt')

    if contentsData then
        local contentsLines = table.pack(string.strsplit('\n', contentsData))

        for i = 1, #contentsLines do
            local line = contentsLines[i]

            if line ~= '' then
                local mloData = readFile(nil, savedMloDirectoryPath, line, 'json')

                if mloData ~= nil then
                    mloData = json.decode(mloData)

                    if mloData and mloData.nameHash then
                        mloFilenameLookup[tostring(mloData.nameHash)] = line
                        table.insert(filenames, line)
                    end
                end
            end
        end
    end
end)
