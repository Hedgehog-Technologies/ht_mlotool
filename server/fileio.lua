local constants = require 'server.constants'
local htio = {}

function htio.createDirectory(path)
    local success, err, code = pcall(os.createdir, path)

    if not success then
        print(lib.locale('fail_create_directory', code, err))
    end

    return success
end

return htio
