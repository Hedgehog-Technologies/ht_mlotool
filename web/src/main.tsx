import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { customTheme } from "./theme";
import { debugData } from "./utils/debugData";
import { fetchNui } from "./utils/fetchNui";
import { isEnvBrowser } from "./utils/misc";

debugData([
  {
    action: "ht_mlotool:openTool",
    data: {
      interiorData: {
        interiorId: 9001,
        location: { x: 900.1, y: 90.01, z: 9.001 },
        nameHash: -263775399,
        uintNameHash: 4031191897,
        saveName: "debug_test",
        name: "debugtest",
        proxyHash: -263874531,
        uintProxyHash: 4031092765,
        roomCount: 3,
        rooms: [
          {
            interiorId: 9001,
            index: 0,
            name: "limbo",
            displayName: "Limbo",
            nameHash: -1208110635,
            uintNameHash: 3086856661,
            roomKey: -1208110635,
            uintRoomKey: 3086856661,
            portalCount: 1,
            dat151: {
              occlRoomName: "DEADBEEF_limbo",
              flags: "0xAAAAAAAA",
              ambientZone: "",
              interiorType: 0,
              reverbSmall: 0.35,
              reverbMedium: 0.0,
              reverbLarge: 0.0,
              roomToneSound: "null_sound",
              rainType: 0,
              exteriorAudibility: 0,
              roomOcclusionDamping: 0,
              nonMarkedPortalOcclusion: 0.7,
              distanceFromPortalForOcclusion: 0,
              distanceFromPortalFadeDistance: 50,
              weaponMetrics: "",
              interiorWallaSoundSet: "hash_D4855127"
            }
          },
          {
            interiorId: 9001,
            index: 1,
            name: "lobby",
            displayName: "Lobby",
            nameHash: 1519171249,
            uintNameHash: 1519171249,
            roomKey: -1429655892,
            uintRoomKey: 2865311404,
            portalCount: 2,
            dat151: {
              occlRoomName: "DEADBEEF_lobby",
              flags: "0xAAAAAAAA",
              ambientZone: "",
              interiorType: 0,
              reverbSmall: "",
              reverbMedium: 0,
              reverbLarge: 0,
              roomToneSound: "null_sound",
              rainType: 0,
              exteriorAudibility: 0,
              roomOcclusionDamping: 0,
              nonMarkedPortalOcclusion: 0.7,
              distanceFromPortalForOcclusion: 0,
              distanceFromPortalFadeDistance: 50,
              weaponMetrics: "",
              interiorWallaSoundSet: "hash_D4855127"
            }
          },
          {
            interiorId: 9001,
            index: 2,
            name: "office",
            displayName: "Office",
            nameHash: 12345561234,
            uintNameHash: 34591123123,
            roomKey: -12341234,
            uintRoomKey: 123412341234,
            portalCount: 1,
            dat151: {
              occlRoomName: "DEADBEEF_office",
              flags: "0xAAAAAAAA",
              ambientZone: "",
              interiorType: 0,
              reverbSmall: "",
              reverbMedium: 0,
              reverbLarge: 0,
              roomToneSound: "null_sound",
              rainType: 0,
              exteriorAudibility: 0,
              roomOcclusionDamping: 0,
              nonMarkedPortalOcclusion: 0.7,
              distanceFromPortalForOcclusion: 0,
              distanceFromPortalFadeDistance: 50,
              weaponMetrics: "",
              interiorWallaSoundSet: "hash_D4855127"
            }
          }
        ],
        portalCount: 5,
        portals: [
          {
            interiorId: 9001,
            isEnabled: [true, true],
            interiorPortalIndex: 0,
            globalPortalIndices: [-1, -1],
            fromRoomIndex: 1,
            toRoomIndex: 0,
            flags: 0,
            isMirror: false,
            entityCount: 1,
            entities: [
              {
                interiorId: 9001,
                index: 0,
                linkType: 1,
                maxOcclusion: 0.0,
                modelHashKey: 130864445,
                modelName: "limbo1",
                isDoor: false,
                isGlass: true,
              }
            ]
          },
          {
            interiorId: 9001,
            isEnabled: [false, false],
            interiorPortalIndex: 1,
            globalPortalIndices: [-1, -1],
            fromRoomIndex: 2,
            toRoomIndex: 1,
            flags: 0,
            isMirror: false,
            entityCount: 1,
            entities: [
              {
                interiorId: 9001,
                index: 0,
                linkType: 1,
                maxOcclusion: 1.0,
                modelHashKey: 83737373,
                modelName: "office1",
                isDoor: true,
                isGlass: false,
              }
            ]
          },
          {
            interiorId: 9001,
            isEnabled: [false, false],
            interiorPortalIndex: 2,
            globalPortalIndices: [-1, -1],
            fromRoomIndex: 2,
            toRoomIndex: 1,
            flags: 0,
            isMirror: false,
            entityCount: 1,
            entities: [
              {
                interiorId: 9001,
                index: 0,
                linkType: 1,
                maxOcclusion: 1.0,
                modelHashKey: 83737373,
                modelName: "office1",
                isDoor: true,
                isGlass: false,
              }
            ]
          },
          {
            interiorId: 9001,
            isEnabled: [false, false],
            interiorPortalIndex: 3,
            globalPortalIndices: [-1, -1],
            fromRoomIndex: 2,
            toRoomIndex: 1,
            flags: 0,
            isMirror: false,
            entityCount: 0,
            entities: []
          },
          {
            interiorId: 9001,
            isEnabled: [false, false],
            interiorPortalIndex: 4,
            globalPortalIndices: [-1, -1],
            fromRoomIndex: 2,
            toRoomIndex: 1,
            flags: 0,
            isMirror: false,
            entityCount: 1,
            entities: [
              {
                interiorId: 9001,
                index: 0,
                linkType: 1,
                maxOcclusion: 0.7,
                modelHashKey: 87290120,
                modelName: "window1",
                isDoor: false,
                isGlass: true,
              }
            ]
          } 
        ]
      },
      roomIndex: 1
    }
  }
], 2000);

const root = document.getElementById("root");

if (isEnvBrowser()) {
  // https://i.imgur.com/iPTAdYV.png - Night time img
  // https://i.imgur.com/3pzRj9n.png - Day time img
  root!.style.backgroundImage = "url('https://i.imgur.com/3pzRj9n.png')";
  root!.style.backgroundSize = "cover";
  root!.style.backgroundRepeat = "no-repeat";
  root!.style.backgroundPosition = "center";
}

const reactRoot = ReactDOM.createRoot(root!);

// Enable freemove while holding down right mouse button
{
  root!.addEventListener("mousedown", (e) => {
    if (e.button === 2) fetchNui("ht_mlotool:nui:toggleFreeMove", true, "1");
  });
  
  root!.addEventListener("mouseup", (e) => {
    if (e.button === 2) fetchNui("ht_mlotool:nui:toggleFreeMove", false, "1");
  });
}

reactRoot.render(
  <React.StrictMode>
    <MantineProvider withNormalizeCSS theme={customTheme}>
      <HashRouter>
        <App />
      </HashRouter>
    </MantineProvider>
  </React.StrictMode>
);
