StaticEmitter = lib.class('StaticEmitter')

function StaticEmitter:constructor(emitterData)
    self.name = emitterData.name
    self.flags = emitterData.flags
    self.childSound = #emitterData.childSound > 0 and emitterData.childSound or 'null_sound'
    self.radioStation = #emitterData.radioStation > 0 and emitterData.radioStation or nil
    self.position = emitterData.position
    self.minDistance = emitterData.minDistance
    self.maxDistance = emitterData.maxDistance
    self.emittedVolume = emitterData.emittedVolume
    self.lpfCutoff = emitterData.lpfCutoff
    self.hpfCutoff = emitterData.hpfCutoff
    self.rolloffFactor = emitterData.rolloffFactor
    self.interior = #emitterData.interior > 0 and emitterData.interior or nil
    self.room = #emitterData.room > 0 and emitterData.room or nil
    self.radioStationForScore = #emitterData.radioStationForScore > 0 and emitterData.radioStationForScore or nil
    self.maxLeakage = emitterData.maxLeakage
    self.minLeakageDistance = emitterData.minLeakageDistance
    self.maxLeakageDistance = emitterData.maxLeakageDistance
    self.alarm = #emitterData.alarm > 0 and emitterData.alarm or nil
    self.onBreakOneShot = #emitterData.onBreakOneShot > 0 and emitterData.onBreakOneShot or 'null_sound'
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
    self.childSound = #newData.childSound > 0 and newData.childSound or 'null_sound'
    self.radioStation = #newData.radioStation > 0 and newData.radioStation or nil
    self.position = newData.position
    self.minDistance = newData.minDistance
    self.maxDistance = newData.maxDistance
    self.emittedVolume = newData.emittedVolume
    self.lpfCutoff = newData.lpfCutoff
    self.hpfCutoff = newData.hpfCutoff
    self.rolloffFactor = newData.rolloffFactor
    self.interior = #newData.interior > 0 and newData.interior or nil
    self.room = #newData.room > 0 and newData.room or nil
    self.radioStationForScore = #newData.radioStationForScore > 0 and newData.radioStationForScore or nil
    self.maxLeakage = newData.maxLeakage
    self.minLeakageDistance = newData.minLeakageDistance
    self.maxLeakageDistance = newData.maxLeakageDistance
    self.alarm = #newData.alarm > 0 and newData.alarm or nil
    self.onBreakOneShot = #newData.onBreakOneShot > 0 and newData.onBreakOneShot or 'null_sound'
    self.maxPathDepth = newData.maxPathDepth
    self.smallReverbSend = newData.smallReverbSend
    self.mediumReverbSend = newData.mediumReverbSend
    self.largeReverbSend = newData.largeReverbSend
    self.minTimeMinutes = newData.minTimeMinutes
    self.maxTimeMinutes = newData.maxTimeMinutes
    self.brokenHealth = newData.brokenHealth
    self.undamagedHealth = newData.undamagedHealth
end
