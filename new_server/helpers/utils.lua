---@type ServerUtilsApi
local utils = require 'shared.utils'

function utils.canUseOpenMloCmd(playerId)
    return IsPlayerAceAllowed(playerId, 'command.openmlo')
end

function utils.canUseSaveMloCmd(playerId)
    return IsPlayerAceAllowed(playerId, 'command.savemlo')
end

return utils
