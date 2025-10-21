local utils = {}

local INT32MIN <const> = -2147483648
local INT32MAX <const> = 2147483647
local UINT32MAX <const> = 4294967295

-- ##### SHARED ##### --

---@param value number
---@return number
function utils.toUInt32(value)
    if value >= 0 and value <= UINT32MAX then
        return value
    else
        return value & 0xffffffff
    end
end

---@param value number
---@return number
function utils.toInt32(value)
    if value > INT32MAX then
        repeat
            value = value - UINT32MAX - 1
        until value <= INT32MAX
    elseif value < INT32MIN then
        repeat
            value = value + UINT32MAX + 1
        until value >= INT32MIN
    end

    return value
end

---@param xmlTbl string[]
---@param valueTbl any
---@param level number
---@param debug boolean
local function toXmlInternal(xmlTbl, valueTbl, level, debug)
    local spaces = level > 0 and string.rep(' ', 2 * level) or ''
    for _, value in ipairs(valueTbl) do
        local tag = ''
        if debug and value.comment then tag = spaces .. '<!-- ' .. value.comment .. ' -->\n' end
        tag = tag .. spaces .. '<' .. value.tagName
        if value.attr then
            for attrName, attrValue in pairs(value.attr) do
                tag = ('%s %s="%s"'):format(tag, attrName, attrValue)
            end
        end

        if value.value then
            tag = tag .. '>' .. value.value .. '</' .. value.tagName .. '>'
            table.insert(xmlTbl, tag)
        elseif value.content and #value.content > 0 then
            tag = tag .. '>'
            table.insert(xmlTbl, tag)
            toXmlInternal(xmlTbl, value.content, level + 1, debug)
            tag = spaces .. '</' .. value.tagName .. '>'
            table.insert(xmlTbl, tag)
        else
            tag = tag .. ' />'
            table.insert(xmlTbl, tag)
        end
    end
end

---@param tbl any
---@param debug boolean
---@return string[]
function utils.toXml(tbl, debug)
    local xml = { '<?xml version="1.0" encoding="UTF-8"?>' }
    toXmlInternal(xml, tbl, 0, debug)
    return table.concat(xml, '\n')
end

-- ##### CLIENT ONLY ##### --

if not IsDuplicityVersion() then

    --- `client`
    ---@param action string The action you wish to target
    ---@param data any The data you wish to send along with this action
    function utils.sendReactMessage(action, data)
        lib.print.debug(('Sending NUI message: [%s] with %s'):format(action, json.encode(data, { indent = true })))

        SendNUIMessage({
            action = action,
            data = data
        })
    end

end

return utils --[[@as UtilsApi]]
