# Definitions

### Audio Occlusion

The inability for sound to travel from Point A to Point B.

### Dat151.Rel File

This file type defines various properties for each of the [rooms](#room) defined for the given Interior. Most notably [reverb](#reverb) and [echo](#echo) are defined and can be adjusted in this file.

### Node Path

The concept of a path that audio will take from Room A to Room B (where Room A and Room B are both considered nodes).

### Portal

An opening that connects two [rooms](#room). This could be a window, a doorway, etc, the key point is that it connects two rooms together.

### Room

An area in which a ped / player could occupy space and / or generate sound.

#### Limbo

Limbo is a special room that simply designates 'outside' of the current Interior. This could represent *another*, separate Interior in some case, but generally will refer to 'outside'.

### YMT File

This file type defines [portals](#portal) between [rooms](#room), the [occlusion](#audio-occlusion) of entities tied to those portals, and the [node paths](#node-path) to route sound through.
