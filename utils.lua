local INT32MIN <const> = -2147483648
local INT32MAX <const> = 2147483647
local UINT32MAX <const> = 4294967295

function ToUInt32(value)
    if value >= 0 and value <= UINT32MAX then
        return value
    else
        return value & 0xffffffff
    end
end

function ToInt32(value)
    if value >= INT32MIN and value <= INT32MAX then
        return value
    elseif value > INT32MAX then
        repeat
            value -= UINT32MAX - 1
        until value <= INT32MAX
        return value
    elseif value < INT32MIN then
        repeat
            value += UINT32MAX + 1
        until value >= INT32MIN
        return value
    end
end

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

function ToXml(tbl, debug)
    local xml = { '<?xml version="1.0" encoding="UTF-8"?>' }
    toXmlInternal(xml, tbl, 0, debug)
    return table.concat(xml, '\n')
end
