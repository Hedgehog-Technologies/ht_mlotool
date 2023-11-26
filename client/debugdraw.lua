local drawPortalInfo = false
local drawPortalOutline = false
local drawPortalFill = false
local drawNavigate = nil

local mloInteriorId = nil
local mloPosition = nil
local mloRotation = nil
local mloPortalCount = nil
local mloPortalCorners = nil
local mloPortalCrossVectors = nil
local mloPortalConnections = nil

local drawInterval = nil
local mloInterval = nil

local function draw3dText(coords, text)
    local onScreen, screenX, screenY = GetScreenCoordFromWorldCoord(coords.x, coords.y, coords.z)

    if onScreen then
        local camPosition = GetFinalRenderedCamCoord()
        local dist = #(camPosition - coords)
        local fov = (1 / GetGameplayCamFov()) * 100
        local scale = (1 / dist) * fov

        SetTextScale(0.0 * scale, 1.1 * scale)
        -- SetTextFont(0)
        -- SetTextProportional(true)
        -- SetTextDropshadow(0, 0, 0, 0, 255) -- maybe no-op?
        SetTextDropShadow() -- maybe no-op? maybe override previous line?
        -- SetTextEdge(2, 0, 0, 0, 150)
        SetTextOutline()
        SetTextCentre(true)

        BeginTextCommandDisplayText('STRING')
        AddTextComponentSubstringPlayerName(text) -- Leave this as player name?
        EndTextCommandDisplayText(screenX, screenY)
    end
end

local function lerp(a, b, t)
    return a + (b - a) * t
end

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
end

local function updateDebugMLOInfo()
    local currentInteriorId = GetInteriorFromEntity(cache.ped)

    if currentInteriorId > 0 and currentInteriorId ~= mloInteriorId then
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
    elseif currentInteriorId <= 0 then
        resetMLODebugData()
    end
end

function UpdateDebugDraw(enablePortalInfo, enablePortalOutline, enablePortalFill, navigatedPortal)
    drawPortalInfo = enablePortalInfo
    drawPortalOutline = enablePortalOutline
    drawPortalFill = enablePortalFill
    drawNavigate = navigatedPortal

    if not drawInterval and (drawPortalInfo or drawPortalOutline or drawPortalFill or drawNavigate) then
        updateDebugMLOInfo()

        mloInterval = SetInterval(updateDebugMLOInfo, 1000)

        drawInterval = SetInterval(function()
            local pedCoords = GetEntityCoords(cache.ped)

            -- Give time for any updates and then end interval iteration to try again
            if not mloInteriorId or not mloPosition or not mloRotation or not mloPortalCount
                or not mloPortalCorners or not mloPortalCrossVectors or not mloPortalConnections
            then
                print('waiting...', mloInteriorId, mloPosition, mloRotation, mloPortalCount)
                Wait(500)
                return
            end

            for portalId = 0, mloPortalCount - 1 do
                local corners = mloPortalCorners[portalId]
                local crossVector = mloPortalCrossVectors[portalId]

                if #(pedCoords - crossVector) <= 8.0 then
                    if drawPortalInfo then
                        local roomFrom, roomTo = table.unpack(mloPortalConnections[portalId])

                        -- adjust the z offsets?
                        draw3dText(vec3(crossVector.x, crossVector.y, crossVector.z + 0.15), ('~b~Portal ~w~%s'):format(portalId))
                        draw3dText(vec3(crossVector.x, crossVector.y, crossVector.z), ('~b~From ~w~%s~b~ To ~w~%s'):format(roomFrom, roomTo))
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
                        DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[1].x, corners[1].y, corners[1].z, corners[2].x, corners[2].y, corners[2].z, 0, 0, 180, 150)
                        DrawPoly(corners[0].x, corners[0].y, corners[0].z, corners[2].x, corners[2].y, corners[2].z, corners[3].x, corners[3].y, corners[3].z, 0, 0, 180, 150)
                        DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[2].x, corners[2].y, corners[2].z, corners[1].x, corners[1].y, corners[1].z, 0, 0, 180, 150)
                        DrawPoly(corners[3].x, corners[3].y, corners[3].z, corners[1].x, corners[1].y, corners[1].z, corners[0].x, corners[0].y, corners[0].z, 0, 0, 180, 150)
                    end
                end

                if drawNavigate == portalId then
                    -- local angle = math.atan2(crossVector.x - pedCoords.x, crossVector.y - pedCoords.y) * 180 / math.pi
                    DrawMarker(26, pedCoords.x, pedCoords.y, pedCoords.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0, 0, 255, 175, false, false, 0, false, false, false, false)
                    -- DrawMarker(2, point.coords.x, point.coords.y, point.coords.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.3, 0.2, 0.15, 150, 30, 30, 222, false, false, 0, true, false, false, false)
                end
            end
        end, 0)
    elseif drawInterval and not drawPortalInfo and not drawPortalOutline and not drawPortalFill and not drawNavigate then
        print('clearing intervals')
        ClearInterval(drawInterval)
        drawInterval = nil

        ClearInterval(mloInterval)
        mloInterval = nil
        resetMLODebugData()
    end
end
