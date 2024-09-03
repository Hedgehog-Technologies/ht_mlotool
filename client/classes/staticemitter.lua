StaticEmitter = lib.class('StaticEmitter')

function StaticEmitter:constructor(emitterData)
    self.name = emitterData.name
    self.flags = emitterData.flags
    self.childSound = emitterData.childSound
    self.radioStation = emitterData.radioStation
    self.position = emitterData.position
    self.minDistance = emitterData.minDistance
    self.maxDistance = emitterData.maxDistance
    self.emittedVolume = emitterData.emittedVolume
    self.lpfCutOff = emitterData.lpfCutOff
    self.hpfCutOff = emitterData.hpfCutOff
    self.rolloffFactor = emitterData.rolloffFactor
    self.interior = emitterData.interior
    self.room = emitterData.room
    self.radioStationForScore = emitterData.radioStationForScore
    self.maxLeakage = emitterData.maxLeakage
    self.minLeakageDistance = emitterData.minLeakageDistance
    self.maxLeakageDistance = emitterData.maxLeakageDistance
    self.alarm = emitterData.alarm
    self.onBreakOnShot = emitterData.onBreakOnShot
    self.maxPathDepth = emitterData.maxPathDepth
    self.smallReverbSend = emitterData.smallReverbSend
    self.mediumReverbSend = emitterData.mediumReverbSend
    self.largeReverbSend = emitterData.largeReverbSend
    self.minTimeMinutes = emitterData.minTimeMinutes
    self.maxTimeMinutes = emitterData.maxTimeMinutes
    self.brokenHealth = emitterData.brokenHealth
    self.undamagedHealth = emitterData.undamagedHealth
end

function StaticEmitter:update(newData)
    self.name = newData.name
    self.flags = newData.flags
    self.childSound = newData.childSound
    self.radioStation = newData.radioStation
    self.position = newData.position
    self.minDistance = newData.minDistance
    self.maxDistance = newData.maxDistance
    self.emittedVolume = newData.emittedVolume
    self.lpfCutOff = newData.lpfCutOff
    self.hpfCutOff = newData.hpfCutOff
    self.rolloffFactor = newData.rolloffFactor
    self.interior = newData.interior
    self.room = newData.room
    self.radioStationForScore = newData.radioStationForScore
    self.maxLeakage = newData.maxLeakage
    self.minLeakageDistance = newData.minLeakageDistance
    self.maxLeakageDistance = newData.maxLeakageDistance
    self.alarm = newData.alarm
    self.onBreakOnShot = newData.onBreakOnShot
    self.maxPathDepth = newData.maxPathDepth
    self.smallReverbSend = newData.smallReverbSend
    self.mediumReverbSend = newData.mediumReverbSend
    self.largeReverbSend = newData.largeReverbSend
    self.minTimeMinutes = newData.minTimeMinutes
    self.maxTimeMinutes = newData.maxTimeMinutes
    self.brokenHealth = newData.brokenHealth
    self.undamagedHealth = newData.undamagedHealth
end
