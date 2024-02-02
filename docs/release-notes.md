# Release Notes

## 1.1.0

Released 2024-02-01
- Reworked Audio Occlusion path generation to prevent deadzones where audio would cut out completely instead of occluding
- Mirror portals will no longer be added to the `PortalInfoList`
- Fixed error where Limbo signed room key was incorrectly showing the unsigned room key
- Fixed issue with `ToInt32` function that was causing an off-by-one error in some cases

## 1.0.1

Released 2024-01-29
- Fixed an issue where tool would fail to initialize due to outdated interior id
- Various docs updates

## 1.0.0

Released 2024-01-27
- Initial release
