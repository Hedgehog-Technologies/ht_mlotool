# Definitions

### Audio Occlusion

The inability of person at Point A to hear a sound made at Point B.

### Dat151.Rel File

This file type defines various properties for each of the [rooms](#room) defined for the given Interior. Most notably [reverb](#reverb) and [echo](#echo) are defined and can be adjusted in this file.

### Node Path

The concept of a path that audio will take from Room A to Room B (where Room A and Room B are both considered nodes).

### MLO

The commonly accepted acronym for building interiors in GTAV that peds are able to walk directly in and out of.

### Portal

An opening that connects two [rooms](#room). This could be a window, a doorway, etc, the key point is that it connects two rooms together.

### Proxy Hash

A calculated unique identifier for a given MLO.

```lua
-- Get the joaat hash of the room name. For "Limbo" use the hash for "outside" instead.
local nameHash = joaat(roomName)

-- XOR the name hash with the coordinates of the MLO's location each with their decimal place moved to the right twice
local signedProxyHash = nameHash ~ (mloPosition.X * 100) ~ (mloPosition.Y * 100) ~ (mloPosition.Z * 100)

-- Make it unsigned
local unsignedProxyHash = signedProxyHash & 0xffffffff
```

### Room

An area in which a ped / player could occupy space and / or generate sound.

#### Limbo

Limbo is a special ["room"](#room) that simply designates 'outside' of the current Interior. This could represent *another*, separate Interior in some cases, but generally will refer to 'outside'.

### YMT File

This file type defines [portals](#portal) between [rooms](#room), the [occlusion](#audio-occlusion) of entities tied to those portals, and the [node paths](#node-path) to route sound through.
