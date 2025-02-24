local constants = require 'server.constants'
local htio = {}

--- Gets a command string for use with io.popen to list files in a directory.
--- @param path string The relative path to the directory to list files in.
--- @return string command The command string to use with io.popen.
local function getPOpenCommandString(path)
    local command = 'ls "'
    local suffix = '/"'
    local dirPath = path

    if constants.systemIsWindows then
        command = 'dir "'
        dirPath = dirPath:gsub('/', '\\')
        suffix = '\\"'
    end

    return command .. dirPath .. suffix
end

--- Creates a directory at the specified path.
--- @param path string The path where the directory should be created.
--- @return boolean success True if the directory was created successfully or already exists, false otherwise.
function htio.createDirectory(path)
    local dirExists <const> = 'Directory already exists'

    if constants.systemIsWindows then
        path = path:gsub('/', '\\')
    end

    local success, err, code = pcall(os.createdir, path)

    if not success and not err:match(dirExists) then
        print(lib.locale('fail_create_directory', code, err))
    end

    return success or (err:match(dirExists) and code == 1)
end

--- Gets a list of files in a directory that match a pattern
--- @param path string relative path to the directory
--- @param pattern string pattern to match files against
--- @return table files table of strings of the file names; nil if directory doesn't exist
--- @return number fileCount the number of files found; -1 if directory doesn't exist
function htio.getFilesInDirectory(path, pattern)
    local files = {}
    local fileCount = 0
    local command = getPOpenCommandString(path)
    local dir = io.popen(command)

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

--- Reads a file from the resource directory
--- @param source number the source id of the requestor, used for error printing
--- @param filepath string the relative path to the directory the file is in
--- @param filename string the name of the file to read
--- @param filetype string the type of the file to read
--- @return string | nil data the contents of the file as a string; nil if the file doesn't exist
function htio.readFile(source, filepath, filename, filetype)
    local fullPath = ('%s/%s.%s'):format(filepath, filename, filetype)

    if constants.systemIsWindows then
        fullPath = fullPath:gsub('/', '\\')
    end

    local file, err = io.open(fullPath, 'r')
    local data = nil

    if not file then
        print('^1' .. err .. '^7')

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
--- @param source number the source id of the requestor, used for error printing
--- @param filepath string the relative path to the directory the file is in
--- @param filename string the name of the file to write
--- @param filetype string the type of the file to write
--- @param datastring string the data to write to the file
--- @return boolean success whether or not the data was written to the file successfully
function htio.writeFile(source, filepath, filename, filetype, datastring)
    local fullPath = ('%s/%s.%s'):format(filepath, filename, filetype)

    if constants.systemIsWindows then
        fullPath = fullPath:gsub('/', '\\')
    end

    local file, openError = io.open(fullPath, 'w+')

    if not file then
        print('^1' .. openError .. '^7')

        TriggerClientEvent('ox_lib:notify', source, {
            type = 'error',
            title = locale('open_output_file_fail'),
            description = locale('check_server_logs')
        })

        return false
    end

    local _, writeError = file:write(datastring)

    if writeError ~= nil then
        print('^1' .. writeError .. '^7')

        TriggerClientEvent('ox_lib:notify', source, {
            type = 'error',
            title = locale('write_output_fail'),
            description = locale('check_server_logs')
        })
    end

    file:close()

    return writeError == nil
end

return htio
