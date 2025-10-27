---@type Config
local Config = require 'shared.config'

---@type CAudioOcclusion
local CAudioOcclusion = require 'new_client.classes.CAudioOcclusion'

---@type EncodersApi
local Encoders = require 'new_client.helpers.encoders'

---@type { [number]: CInterior }
local _interiorCache = {}

-- ##### API ##### --

local InteriorCacheApi = {}

---@param interiorData table
---@param generateAO boolean
---@param generateDat151 boolean
---@param debug boolean
function InteriorCacheApi.generateInteriorFiles(interiorData, generateAO, generateDat151, debug)
    local interior = InteriorCacheApi.updateInteriorData(interiorData)

    if interior then
        local saveDirName = interior.saveName ~= '' and interior.saveName or interior.nameHash

        if generateAO then
            local aoFileName = tostring(interior.uintProxyHash)
            local aoFileType = 'ymt.pso.xml'
            local aoObj = CAudioOcclusion:new(interior)
            local ymtData = Encoders.encodeAudioOcclusion(interior, aoObj)
            TriggerLatentServerEvent('ht_mlotool:outputResultFile', Config.clientToServerBPS, saveDirName, aoFileName, aoFileType, ymtData, debug)
        end

        if generateDat151 then
            local interiorName = interior.name

            if not interiorName then
                return lib.notify({
                    type = 'error',
                    title = locale('missing_mlo_archetype_name')
                })
            elseif interiorName:sub(1, 5) == 'hash_' then
                interiorName = interiorName:gsub('hash_', '', 1)
            end

            local datFileName = ('%s_game'):format(interiorName)
            local datFileType = 'dat151.rel.xml'
            local dat151Data = Encoders.encodeDat151(interior)
            TriggerLatentServerEvent('ht_mlotool:outputResultFile', Config.clientToServerBPS, saveDirName, datFileName, datFileType, dat151Data, debug)
        end

        TriggerLatentServerEvent('ht_mlotool:saveInteriorData', Config.clientToServerBPS, interior:getSaveData())
    end
end

---@param interior CInterior
function InteriorCacheApi.addInterior(interior)
    _interiorCache[interior.interiorId] = interior
end

---@param interiorId number
---@return CInterior?
function InteriorCacheApi.getInterior(interiorId)
    return _interiorCache[interiorId]
end

---@param interiorData TInteriorData
---@return CInterior?
function InteriorCacheApi.updateInteriorData(interiorData)
    local interior = _interiorCache[interiorData.interiorId]

    if interior then interior:update(interiorData) end

    return interior
end

return InteriorCacheApi --[[@as InteriorCacheApi]]
