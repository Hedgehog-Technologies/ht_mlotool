---@type ClientUtilsApi
local ClientUtilsApi = require 'shared.utils'

---@param action string The action you wish to target
---@param data any The data you wish to send along with this action
function ClientUtilsApi.sendReactMessage(action, data)
    lib.print.debug(('Sending NUI message: [%s] with %s'):format(action, json.encode(data, { indent = true })))

    SendNUIMessage({
        action = action,
        data = data
    })
end

return ClientUtilsApi
