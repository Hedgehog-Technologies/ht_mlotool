Room = {}

function Room.new(interiodId, nameHash, proxyHash, roomIndex)
    local room = {}

    room.index = roomIndex
    room.name = GetInteriorRoomName(interiodId, roomIndex)
    room.displayName = room.name:gsub('^%l', string.upper)
    room.nameHash = room.name == 'limbo' and `outside` or joaat(room.name)
    room.uintNameHash = ToUInt32(room.nameHash)
    room.roomKey = room.name == 'limbo' and room.nameHash or proxyHash ~ room.nameHash
    room.uintRoomKey = ToUInt32(room.roomKey)

    room.portalCount = 0

    --#region Dat151 Fields
    room.occlRoomName = ('%s_%s'):format(nameHash, room.name)
    room.flags = '0xAAAAAAAA'

    -- AmbientZone
    room.zone = ''

    -- InteriorType
    room.unk02 = 0

    -- ReverbSmall
    room.unk03 = 0.35

    -- ReverbMedium
    room.reverb = 0

    -- ReverbLarge
    room.echo = 0

    -- RoomToneSound
    room.sound = 'null_sound'

    -- RainType
    room.unk07 = 0

    -- ExteriorAudibility
    room.unk08 = 0

    -- RoomOcclusionDamping
    room.unk09 = 0

    -- NonMarkedPortalOcclusion
    room.unk10 = 0.7

    -- DistanceFromPortalForOcclusion
    room.unk11 = 0

    -- DistanceFromPortalFadeDistance
    room.unk12 = 50

    -- WeaponMetrics
    room.unk13 = ''

    -- InteriorWallaSoundSet
    room.soundSet = 'hash_D4855127'
    --#endregion

    return room
end

function Room.update(room, newData)
    room.flags = newData.flags
    room.zone = newData.zone
    room.unk02 = newData.unk02
    room.unk03 = newData.unk03
    room.reverb = newData.reverb
    room.echo = newData.echo
    room.sound = newData.sound
    room.unk07 = newData.unk07
    room.unk08 = newData.unk08
    room.unk09 = newData.unk09
    room.unk10 = newData.unk10
    room.unk11 = newData.unk11
    room.unk12 = newData.unk12
    room.unk13 = newData.unk13
    room.soundSet = newData.soundSet
end
