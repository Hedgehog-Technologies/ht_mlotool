local drawPortalInfo = false
local drawPortalOutline = false
local drawPortalFill = false
local drawNavigate = nil
local drawEntities = {}

local mloInteriorId = nil
local mloPosition = nil
local mloRotation = nil
local mloPortalCount = nil
local mloPortalCorners = nil
local mloPortalCrossVectors = nil
local mloPortalConnections = nil
local mloPortalNavEnabled = nil

local drawInterval = nil
local mloInterval = nil

-- ##### Optimization ##### --

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

-- ##### Functions ##### --

local function anyDebugEntitiesActive()
    local anyActive = false
    for _,v in pairs(drawEntities) do
        if v.debug then
            anyActive = true
            break
        end
    end
    return anyActive
end

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
        AddTextComponentSubstringPlayerName(text) -- Leave this as player name?
        EndTextCommandDisplayText(screenX, screenY)
    end
end

--- Vector3 Linear Interpolation
---@param a vector3 Starting position
---@param b vector3 Ending position
---@param t number value to interpolate between a and b
local function lerp(a, b, t)
    return a + (b - a) * t
end

--- Quaternion Multiplication
---@param a quat
---@param b vector3
local function qMult(a, b)
    local axx = a.x * 2
    local ayy = a.y * 2
    local azz = a.z * 2
    local awxx = a.w * axx
    local awyy = a.w * ayy
    local awzz = a.w * azz
    local axxx = a.x * axx
    local axyy = a.x * ayy
    local axzz = a.x * azz
    local ayyy = a.y * ayy
    local ayzz = a.z * ayy
    local azzz = a.z * azz

    return vec3(((b.x * ((1.0 - ayyy) - azzz)) + (b.y * (axyy - awzz))) + (b.z * (axzz + awyy)),
        ((b.x * (axyy + awzz)) + (b.y * ((1.0 - axxx) - azzz))) + (b.z * (ayzz - awxx)),
        ((b.x * (axzz - awyy)) + (b.y * (ayzz + awxx))) + (b.z * ((1.0 - axxx) - ayyy)))
end

local function resetMLODebugData()
    mloInteriorId = nil
    mloPosition = nil
    mloRotation = nil
    mloPortalCount = nil
    mloPortalCorners = nil
    mloPortalCrossVectors = nil
    mloPortalConnections = nil

    for _,v in pairs(drawEntities) do
        if v.entity and DoesEntityExist(v.entity) then
            SetEntityDrawOutline(v.entity, false)
            v.entity = nil
        end
    end
end

local function updateDebugMLOInfo()
    local currentInteriorId = GetInteriorFromEntity(cache.ped)

    if currentInteriorId > 0 then
        if currentInteriorId ~= mloInteriorId then
            if mloPortalNavEnabled ~= nil and mloPortalNavEnabled ~= currentInteriorId then
                SendReactMessage('ht_mlotool:cancelNavigation', {})
                mloPortalNavEnabled = nil
                drawNavigate = nil
            end

            if mloInteriorId ~= nil then
                for _,v in pairs(drawEntities) do
                    if v.entity and DoesEntityExist(v.entity) then
                        SetEntityDrawOutline(v.entity, false)
                    end
                end

                table.wipe(drawEntities)
                SendReactMessage('ht_mlotool:cancelEntityDebug', {})
            end

            mloInteriorId = currentInteriorId
            local rotX, rotY, rotZ, rotW = GetInteriorRotation(mloInteriorId)
            mloRotation = quat(rotW, rotX, rotY, rotZ)
            mloPosition = vec3(GetInteriorPosition(mloInteriorId))
            mloPortalCount = GetInteriorPortalCount(mloInteriorId)
            mloPortalCorners = {}
            mloPortalCrossVectors = {}
            mloPortalConnections = {}

            for portalId = 0, mloPortalCount - 1 do
                local pCorners = {}

                for cornerIndex = 0, 3 do
                    local cX, cY, cZ = GetInteriorPortalCornerPosition(mloInteriorId, portalId, cornerIndex)
                    local cPosition = mloPosition + qMult(mloRotation, vec3(cX, cY, cZ))

                    pCorners[cornerIndex] = cPosition
                end

                mloPortalCorners[portalId] = pCorners
                mloPortalCrossVectors[portalId] = lerp(pCorners[0], pCorners[2], 0.5)

                mloPortalConnections[portalId] = { GetInteriorPortalRoomFrom(mloInteriorId, portalId), GetInteriorPortalRoomTo(mloInteriorId, portalId) }
            end
        end

        for _,v in pairs(drawEntities) do
            if v.debug then
                local entity = GetClosestObjectOfType(v.pos.x, v.pos.y, v.pos.z, 1.0, v.arch, false, false, false)

                if entity and entity ~= v.entity and DoesEntityExist(entity) then
                    -- This shouldn't ever happen
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
        resetMLODebugData()
    end
end

local function drawDebug()
    local pedCoords = GetEntityCoords(cache.ped)

    -- Give time for any updates and then end interval iteration to try again
    if not mloInteriorId or not mloPosition or not mloRotation or not mloPortalCount
        or not mloPortalCorners or not mloPortalCrossVectors or not mloPortalConnections
    then
        Wait(500)
        return
    end

    for portalId = 0, mloPortalCount - 1 do
        local corners = mloPortalCorners[portalId]
        local crossVector = mloPortalCrossVectors[portalId]

        if #(pedCoords - crossVector) <= 8.0 then
            if drawPortalInfo then
                local roomFrom, roomTo = table.unpack(mloPortalConnections[portalId])

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
            if not mloPortalNavEnabled then
                mloPortalNavEnabled = mloInteriorId
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
                false, false, 0, false, nil, nil, false)
        end
    end
end

function UpdateDebugDraw(enablePortalInfo, enablePortalOutline, enablePortalFill, navigatedPortal)
    drawPortalInfo = enablePortalInfo
    drawPortalOutline = enablePortalOutline
    drawPortalFill = enablePortalFill
    drawNavigate = navigatedPortal

    if not drawInterval and (drawPortalInfo or drawPortalOutline or drawPortalFill or drawNavigate) then
        if not mloInterval then
            updateDebugMLOInfo()
            mloInterval = SetInterval(updateDebugMLOInfo, 1000)
        end

        drawInterval = SetInterval(drawDebug, 0)
    elseif not drawPortalInfo and not drawPortalOutline and not drawPortalFill and not drawNavigate then
        if drawInterval then
            ClearInterval(drawInterval)
            drawInterval = nil
        end

        if mloInterval and not anyDebugEntitiesActive() then
            ClearInterval(mloInterval)
            mloInterval = nil
            resetMLODebugData()
        end

    end
end

function UpdateDebugEntities(portalIndex, entityIndex, debug)
    local interiorId = mloInteriorId or GetInteriorFromEntity(cache.ped)

    if interiorId > 0 then
        local key = ('%s:%s'):format(portalIndex, entityIndex)

        if drawEntities[key] then
            drawEntities[key].debug = debug
        else
            local x,y,z = GetInteriorPortalEntityPosition(interiorId, portalIndex, entityIndex)
            local pos = GetOffsetFromInteriorInWorldCoords(interiorId, x, y, z)
            local arch = GetInteriorPortalEntityArchetype(interiorId, portalIndex, entityIndex)
            drawEntities[key] = { portalIndex = portalIndex, entityIndex = entityIndex, debug = debug, pos = pos, arch = arch }
        end

        if debug and not mloInterval then
            mloInterval = SetInterval(updateDebugMLOInfo, 1000)
        elseif not debug and mloInterval and not anyDebugEntitiesActive() then
            ClearInterval(mloInterval)
            mloInterval = nil
        end
    end
end

CreateThread(function()
    SetEntityDrawOutlineColor(255, 137, 0, 200) -- Orange
    SetEntityDrawOutlineShader(1)
end)
