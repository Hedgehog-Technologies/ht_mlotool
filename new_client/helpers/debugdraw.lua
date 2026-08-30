---@type UtilsApi
local Utils = require 'new_client.helpers.utils'

-- ##### Local Variables ##### --

local drawPortalInfo = false
local drawPortalOutline = false
local drawPortalFill = false
---@type number?
local drawNavigate = nil
---@type DDrawEntityTracking
local drawEntities = {}

local interiorId = nil
local interiorPosition = nil
local interiorRotation = nil
local interiorPortalCount = nil
---@type TPortalCorners
local interiorPortalCorners = {}
---@type TPortalCrossVectors
local interiorPortalCrossVectors = {}
---@type TPortalConnections
local interiorPortalConnections = {}
local interiorPortalNavEnabled = nil

---@type number?
local drawIntervalId = nil
---@type number?
local interiorIntervalId = nil

-- ##### MICRO Optimization ##### --

local AddTextComponentSubstringPlayerName = AddTextComponentSubstringPlayerName
local BeginTextCommandDisplayText = BeginTextCommandDisplayText
local DoesEntityExist = DoesEntityExist
local DrawLine = DrawLine
local DrawMarker = DrawMarker
local DrawPoly = DrawPoly
local EndTextCommandDisplayText = EndTextCommandDisplayText
local GetClosestObjectOfType = GetClosestObjectOfType
local GetEntityCoords = GetEntityCoords
local GetFinalRenderedCamCoord = GetFinalRenderedCamCoord
local GetGameplayCamFov = GetGameplayCamFov
local GetInteriorFromEntity = GetInteriorFromEntity
local GetInteriorPortalCornerPosition = GetInteriorPortalCornerPosition
local GetInteriorPortalCount = GetInteriorPortalCount
local GetInteriorPortalRoomFrom = GetInteriorPortalRoomFrom
local GetInteriorPortalRoomTo = GetInteriorPortalRoomTo
local GetInteriorPosition = GetInteriorPosition
local GetInteriorRotation = GetInteriorRotation
local GetScreenCoordFromWorldCoord = GetScreenCoordFromWorldCoord
local SetEntityDrawOutline = SetEntityDrawOutline
local SetTextCentre = SetTextCentre
local SetTextDropShadow = SetTextDropShadow
local SetTextOutline = SetTextOutline
local SetTextScale = SetTextScale

-- ##### Local Functions ##### --

---@return boolean
local function anyDebugEntitiesActive()
    local anyActive = false

    for _, v in pairs(drawEntities) do
        if v.debug then
            anyActive = true
            break
        end
    end

    lib.print.debug(('Any debug entities active: %s'):format(anyActive))

    return anyActive
end

---@param coords vector3
---@param text string
local function draw3dText(coords, text)
    local onScreen, screenX, screenY = GetScreenCoordFromWorldCoord(coords.x, coords.y, coords.z)

    if onScreen then
        local camPosition = GetFinalRenderedCamCoord()
        local dist = #(camPosition - coords)
        local fov = (1 / GetGameplayCamFov()) * 100
        local scale = (1 / dist) * fov

        SetTextScale(0.0 * scale, 1.1 * scale)
        SetTextDropShadow()
        SetTextOutline()
        SetTextCentre(true)

        BeginTextCommandDisplayText('STRING')
        AddTextComponentSubstringPlayerName(text)
        EndTextCommandDisplayText(screenX, screenY)
    end
end

local function resetInteriorDebugData()
    lib.print.verbose('Resetting interior debug data...')

    interiorId = nil
    interiorPosition = nil
    interiorRotation = nil
    interiorPortalCount = nil

    table.wipe(interiorPortalCorners)
    table.wipe(interiorPortalCrossVectors)
    table.wipe(interiorPortalConnections)

    for _, v in pairs(drawEntities) do
        if v.entity and DoesEntityExist(v.entity) then
            SetEntityDrawOutline(v.entity, false)
            table.wipe(v)
        end
    end

    table.wipe(drawEntities)
end

local function updateDebugInteriorInfo()
    local currentInteriorId = GetInteriorFromEntity(cache.ped)

    if currentInteriorId > 0 then
        if currentInteriorId ~= interiorId then
            if interiorPortalNavEnabled ~= nil and interiorPortalNavEnabled ~= currentInteriorId then
                Utils.sendReactMessage('ht_mlotool:nui:cancelNavigation', {})
                interiorPortalNavEnabled = nil
                drawNavigate = nil
            end

            if interiorId ~= nil then
                for _, v in pairs(drawEntities) do
                    if v.entity and DoesEntityExist(v.entity) then
                        SetEntityDrawOutline(v.entity, false)
                        table.wipe(v)
                    end
                end

                table.wipe(drawEntities)
                Utils.sendReactMessage('ht_mlotool:nui:cancelEntityDebug', {})
            end

            interiorId = currentInteriorId
            local rotX, rotY, rotZ, rotW = GetInteriorRotation(interiorId)
            interiorRotation = quat(rotW, rotX, rotY, rotZ)
            interiorPosition = vec3(GetInteriorPosition(interiorId))
            interiorPortalCount = GetInteriorPortalCount(interiorId)
            table.wipe(interiorPortalCorners)
            table.wipe(interiorPortalCrossVectors)
            table.wipe(interiorPortalConnections)

            for portalId = 0, interiorPortalCount - 1 do
                ---@type TPortalCornerCoordinates
                local pCorners = {}

                for cornerIndex = 0, 3 do
                    local cX, cY, cZ = GetInteriorPortalCornerPosition(interiorId, portalId, cornerIndex)
                    local cPosition = interiorPosition + Utils.quatMult(interiorRotation, vec3(cX, cY, cZ))

                    pCorners[cornerIndex] = cPosition
                end

                interiorPortalCorners[portalId] = pCorners
                interiorPortalCrossVectors[portalId] = lib.math.interp(pCorners[0], pCorners[2], 0.5)
                interiorPortalConnections[portalId] = { GetInteriorPortalRoomFrom(interiorId, portalId), GetInteriorPortalRoomTo(interiorId, portalId) }
            end
        end

        for _, v in pairs(drawEntities) do
            if v.debug then
                local entity = GetClosestObjectOfType(v.position.x, v.position.y, v.position.z, 1.0, v.archetype, false, false, false)

                if entity and entity ~= v.entity and DoesEntityExist(entity) then
                    -- This should never happen
                    if DoesEntityExist(v.entity) then
                        SetEntityDrawOutline(v.entity, false)
                    end

                    v.entity = entity
                    SetEntityDrawOutline(entity, true)
                end
            elseif v.entity then
                if DoesEntityExist(v.entity) then
                    SetEntityDrawOutline(v.entity, false)
                end

                v.entity = nil
            end
        end
    elseif currentInteriorId <= 0 then
        resetInteriorDebugData()
    end
end

local function drawDebug()
    local pedCoords = GetEntityCoords(cache.ped)

    -- Give time for any updates and then end interval iteration to try again
    if not interiorId or not interiorPosition or not interiorRotation or not interiorPortalCount then
        Wait(500)
        return
    end

    for portalId = 0, interiorPortalCount -1 do
        local corners = interiorPortalCorners[portalId]
        local crossVector = interiorPortalCrossVectors[portalId]

        if #(pedCoords - crossVector) <= 8.0 then
            if drawPortalInfo then
                local roomFrom, roomTo = table.unpack(interiorPortalConnections[portalId])

                draw3dText(vec3(crossVector.x, crossVector.y, crossVector.z + 0.15), locale('debug_text_portal_id', portalId))
                draw3dText(vec3(crossVector.x, crossVector.y, crossVector.z), locale('debug_text_conn_rooms', roomFrom, roomTo))
            end

            if drawPortalOutline then
                -- Borders outline
                DrawLine(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z, 0, 255, 0, 255)
                DrawLine(corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z, 0, 255, 0, 255)
                DrawLine(corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z, 0, 255, 0, 255)
                DrawLine(corners[3].x, corners[3].y, corners[3].z, corners[0].x, corners[0].y, corners[0].z, 0, 255, 0, 255)

                -- Middle cross lines
                DrawLine(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z, 0, 255, 0, 255)
                DrawLine(corners[1].x, corners[1].y, corners[1].z, corners[3].x, corners[3].y, corners[3].z, 0, 255, 0, 255)
            end

            if drawPortalFill then
                -- Both sets are needed so the fill can be seen from both sides of the portal
                DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z, 100, 65, 217, 150)
                DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z, 100, 65, 217, 150)
                DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[2].x, corners[2].y, corners[2].z, corners[1].x, corners[1].y, corners[1].z, 100, 65, 217, 150)
                DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[1].x, corners[1].y, corners[1].z, corners[0].x, corners[0].y, corners[0].z, 100, 65, 217, 150)
            end
        end

        if drawNavigate == portalId then
            if not interiorPortalNavEnabled then
                interiorPortalNavEnabled = interiorId
            end

            local dirX = pedCoords.x - crossVector.x
            local dirY = pedCoords.y - crossVector.y
            local dirZ = pedCoords.z - crossVector.z + 0.75

            DrawMarker(
                26, -- MarkerTypeHorizontalCircleSkinny_Arrow
                pedCoords.x, pedCoords.y, pedCoords.z + 0.75,
                dirX, dirY, dirZ,
                0.0, 0.0, 0.0,
                1.0, 1.0, 1.0,
                100, 65, 217, 200,
                false, false, 0, false, nil, nil, false
            )
        end
    end
end

CreateThread(function()
    SetEntityDrawOutlineColor(255, 137, 0, 200) -- Orange
    SetEntityDrawOutlineShader(1)
end)

-- ##### API ##### --

local DebugDrawApi = {}

---@param enablePortalInfo boolean
---@param enablePortalOutline boolean
---@param enablePortalFill boolean
---@param navigatedPortal number
function DebugDrawApi.updateDebugDraw(enablePortalInfo, enablePortalOutline, enablePortalFill, navigatedPortal)
    drawPortalInfo = enablePortalInfo
    drawPortalOutline = enablePortalOutline
    drawPortalFill = enablePortalFill
    drawNavigate = navigatedPortal

    if not drawIntervalId
        and (drawPortalInfo or drawPortalOutline or drawPortalFill or drawNavigate)
    then
        if not interiorIntervalId then
            updateDebugInteriorInfo()
            interiorIntervalId = SetInterval(updateDebugInteriorInfo, 1000)
        end

        drawIntervalId = SetInterval(drawDebug, 0)
    elseif not drawPortalInfo and not drawPortalOutline and not drawPortalFill and not drawNavigate then
        if drawIntervalId then
            ClearInterval(drawIntervalId)
            drawIntervalId = nil
        end

        if interiorIntervalId and not anyDebugEntitiesActive() then
            ClearInterval(interiorIntervalId)
            interiorIntervalId = nil
            resetInteriorDebugData()
        end
    end
end

---@param portalIndex number
---@param entityIndex number
---@param debug boolean
function DebugDrawApi.updateDebugEntities(portalIndex, entityIndex, debug)
    interiorId = interiorId or GetInteriorFromEntity(cache.ped)

    if interiorId > 0 then
        local key = ('%s:%s'):format(portalIndex, entityIndex)

        if drawEntities[key] then
            drawEntities[key].debug = debug
        else
            local x, y, z = GetInteriorPortalEntityPosition(interiorId, portalIndex, entityIndex)
            local pos = GetOffsetFromInteriorInWorldCoords(interiorId, x, y, z)
            local arch = GetInteriorPortalEntityArchetype(interiorId, portalIndex, entityIndex)

            ---@type TDrawEntityData
            local entityData = { portalIndex = portalIndex, entityIndex = entityIndex, debug = debug, position = pos, archetype = arch}
            drawEntities[key] = entityData
        end

        if debug and not interiorIntervalId then
            interiorIntervalId = SetInterval(updateDebugInteriorInfo, 1000)
        elseif not debug and interiorIntervalId and not anyDebugEntitiesActive() then
            ClearInterval(interiorIntervalId)
            interiorIntervalId = nil
        end
    end
end

return DebugDrawApi --[[@as DebugDrawApi]]
