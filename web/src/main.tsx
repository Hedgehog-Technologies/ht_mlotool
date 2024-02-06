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
    action: "ht_mlotool:openMLO",
    data: {
      mloData: {
        interiorId: 9001,
        name: "debugtest",
        saveName: "debug_test",
        location: { x: 900.1, y: 90.01, z: 9.001 },
        nameHash: -263775399,
        uintNameHash: 4031191897,
        proxyHash: -263874531,
        uintProxyHash: 4031092765,
        rooms: [
          {
            index: 0,
            name: "limbo",
            displayName: "Limbo",
            nameHash: -1208110635,
            uintNameHash: 3086856661,
            roomKey: -1208110635,
            uintRoomKey: 3086856661,
            portalCount: 1,
            occlRoomName: "DEADBEEF_limbo",
            flags: "0xAAAAAAAA",
            zone: "",
            unk02: 0,
            unk03: "",
            reverb: 0,
            echo: 0,
            sound: "null_sound",
            unk07: 0,
            unk08: 0,
            unk09: 0,
            unk10: 0.7,
            unk11: 0,
            unk12: 50,
            unk13: "",
            soundSet: "hash_D4855127"
          },
          {
            index: 1,
            name: "lobby",
            displayName: "Lobby",
            nameHash: 1519171249,
            uintNameHash: 1519171249,
            roomKey: -1429655892,
            uintRoomKey: 2865311404,
            portalCount: 2,
            occlRoomName: "DEADBEEF_lobby",
            flags: "0xAAAAAAAA",
            zone: "",
            unk02: 0,
            unk03: "",
            reverb: 0,
            echo: 0,
            sound: "null_sound",
            unk07: 0,
            unk08: 0,
            unk09: 0,
            unk10: 0.7,
            unk11: 0,
            unk12: 50,
            unk13: "",
            soundSet: "hash_D4855127"
          },
          {
            index: 2,
            name: "office",
            displayName: "Office",
            nameHash: 12345561234,
            uintNameHash: 34591123123,
            roomKey: -12341234,
            uintRoomKey: 123412341234,
            portalCount: 1,
            occlRoomName: "DEADBEEF_office",
            flags: "0xAAAAAAAA",
            zone: "",
            unk02: 0,
            unk03: "",
            reverb: 0,
            echo: 0,
            sound: "null_sound",
            unk07: 0,
            unk08: 0,
            unk09: 0,
            unk10: 0.7,
            unk11: 0,
            unk12: 50,
            unk13: "",
            soundSet: "hash_D4855127"
          }
        ],
        portals: [
          {
            fromRoomIndex: 1,
            toRoomIndex: 0,
            mloPortalIndex: 0,
            flags: 0,
            isEnabled: [true, true],
            entities: [
              {
                maxOcclusion: 0.0,
                modelHashKey: 130864445,
                modelName: "limbo1",
                isDoor: false,
                isGlass: true,
              }
            ]
          },
          {
            fromRoomIndex: 2,
            toRoomIndex: 1,
            mloPortalIndex: 1,
            flags: 0,
            isEnabled: [false, false],
            entities: [
              {
                maxOcclusion: 1.0,
                modelHashKey: 83737373,
                modelName: "office1",
                isDoor: true,
                isGlass: false,
              }
            ]
          },
          {
            fromRoomIndex: 2,
            toRoomIndex: 1,
            mloPortalIndex: 2,
            flags: 0,
            isEnabled: [false, false],
            entities: [
              {
                maxOcclusion: 1.0,
                modelHashKey: 83737373,
                modelName: "office1",
                isDoor: true,
                isGlass: false,
              }
            ]
          },
          {
            fromRoomIndex: 2,
            toRoomIndex: 1,
            mloPortalIndex: 3,
            flags: 0,
            isEnabled: [false, false],
            entities: []
          },{
            fromRoomIndex: 2,
            toRoomIndex: 1,
            mloPortalIndex: 4,
            flags: 0,
            isEnabled: [false, false],
            entities: [
              {
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
    if (e.button === 2) fetchNui("ht_mlotool:freeMove", true, "1");
  });
  
  root!.addEventListener("mouseup", (e) => {
    if (e.button === 2) fetchNui("ht_mlotool:freeMove", false, "1");
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
