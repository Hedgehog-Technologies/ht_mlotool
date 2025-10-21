---@type ServerConstants
local Constants = require 'new_server.constants'

--- Gets a command string for use with io.popen to list files in a directory.
---@param path string The relative path to the directory to list files in.
---@return string command The command string to use with io.popen.
local function getPOpenCommandString(path)
    local command = 'ls "'
    local dirPath = path
    local suffix = '/"'

    if Constants.systemIsWindows then
        command = 'dir "'
        dirPath = dirPath:gsub('/', '\\')
        suffix = '\\"'
    end

    return command .. dirPath .. suffix
end

-- ##### API ##### --

local HTFileApi = {}

--- Creates a directory at the specified path.
---@param path string The path where the directory should be created.
---@return boolean success True if the directory was created successfully or already exists, false otherwise.
function HTFileApi.createDirectory(path)
    local dirExists <const> = 'Directory already exists'

    if Constants.systemIsWindows then
        path = path:gsub('/', '\\')
    end

    local success, err, code = pcall(os.createdir, path)

    if not success and not err:match(dirExists) then
        lib.print.error(locale('fail_create_directory', code, err))
    end

    return success or (err:match(dirExists) and code == 1)
end

--- Gets a list of files in a directory that match a pattern
---@param path string Relative path to the directory
---@param pattern string Pattern to match files against
---@return string[]|nil files String array of the file names; nil if directory doesn't exist
---@return number fileCount The number of files found; -1 if directory doesn't exist
function HTFileApi.getFilesInDirectory(path, pattern)
    local files = nil
    local fileCount = -1
    local command = getPOpenCommandString(path)
    local dir = io.popen(command)

    if dir then
        files = {}
        fileCount = 0

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

--- Reads a file from the resource directory
---@param source number? The source id of the requestor, used for client error printing
---@param filepath string The relative path to the directory the file is in
---@param filename string The name of the file to read
---@param filetype string The type of the file to read
---@return string | nil data The contents of the file as a string; nil if the file doesn't exist
function HTFileApi.readFile(source, filepath, filename, filetype)
    local fullPath = ('%s/%s.%s'):format(filepath, filename, filetype)

    if Constants.systemIsWindows then
        fullPath = fullPath:gsub('/', '\\')
    end

    local file, err = io.open(fullPath, 'r')
    local data = nil

    if not file then
        lib.print.error(err)

        if source ~= nil then
            TriggerClientEvent('ox_lib:notify', source, {
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

--- Writes a file to the resource directory
---@param source number? The source id of the requestor, used for client error printing
---@param filepath string The relative path to the directory the file is in
---@param filename string The name of the file to write
---@param filetype string The type of the file to write
---@param data string The data to write to the file
---@return boolean success Whether or not the data was written to the file successfully
function HTFileApi.writeFile(source, filepath, filename, filetype, data)
    local fullPath = ('%s/%s.%s'):format(filepath, filename, filetype)

    if Constants.systemIsWindows then
        fullPath = fullPath:gsub('/', '\\')
    end

    local file, openError = io.open(fullPath, 'w+')

    if not file then
        lib.print.error(openError)

        if source ~= nil then
            TriggerClientEvent('ox_lib:notify', source, {
                type = 'error',
                title = locale('open_output_file_fail'),
                description = locale('check_server_logs')
            })
        end

        return false
    end

    local _, writeError = file:write(data)

    if writeError ~= nil then
        lib.print.error(writeError)

        if source ~= nil then
            TriggerClientEvent('ox_lib:notify', source, {
                type = 'error',
                title = locale('write_output_fail'),
                description = locale('check_server_logs')
            })
        end
    end

    file:close()

    return writeError == nil
end

return HTFileApi --[[@as HTFileApi]]
