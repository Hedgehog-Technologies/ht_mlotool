import './index.css';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { customTheme } from './theme';
import { isEnvBrowser } from './utils/misc';
import { debugData } from './utils/debugData';

debugData([
  {
    action: 'setVisible',
    data: undefined
  }
]);

debugData([
  {
    action: 'setMLO',
    data: {
      interiorId: 9001,
      name: 'debugtest',
      location: { x: 900.1, y: 90.01, z: 9.001 },
      nameHash: -263775399,
      uintNameHash: 4031191897,
      proxyHash: -263874531,
      uintProxyHash: 4031092765,
      rooms: [
        {
          index: 0,
          name: 'limbo',
          nameHash: -1208110635,
          uintNameHash: 3086856661,
          roomKey: -1208110635,
          uintRoomKey: 3086856661,
          portals: [
            {
              fromRoom: 0,
              toRoom: 1,
              roomPortalIndex: 0,
              mloPortalIndex: 0,
              globalPortalIndex: 0,
              flags: 0,
              entities: [
                {
                  maxOcclusion: 0.0,
                  modelHashKey: 130864445,
                  modelName: 'limbo1',
                  isDoor: false,
                  isGlass: true,
                }
              ]
            }
          ]
        },
        {
          index: 1,
          name: 'lobby',
          nameHash: 1519171249,
          uintNameHash: 1519171249,
          roomKey: -1429655892,
          uintRoomKey: 2865311404,
          portals: [
            {
              fromRoom: 1,
              toRoom: 0,
              roomPortalIndex: 0,
              mloPortalIndex: 0,
              globalPortalIndex: 1,
              flags: 0,
              entities: [
                {
                  maxOcclusion: 0.5,
                  modelHashKey: 130864445,
                  modelName: 'lobby1',
                  isDoor: true,
                  isGlass: true,
                }
              ]
            }
          ]
        },
        {
          index: 2,
          name: 'office',
          nameHash: 12345561234,
          uintNameHash: 34591123123,
          roomKey: -12341234,
          uintRoomKey: 123412341234,
          portals: [
            {
              fromRoom: 2,
              toRoom: 1,
              roomPortalIndex: 0,
              mloPortalIndex: 1,
              globalPortalIndex: 2,
              flags: 0,
              entities: [
                {
                  maxOcclusion: 1.0,
                  modelHashKey: 83737373,
                  modelName: 'office1',
                  isDoor: true,
                  isGlass: false,
                }
              ]
            }
          ]
        }
      ],
      portals: [
        {
          fromRoom: 1,
          toRoom: 0,
          roomPortalIndex: 0,
          mloPortalIndex: 0,
          globalPortalIndex: 0,
          flags: 0,
          isEnabled: [true, true],
          entities: [
            {
              maxOcclusion: 0.0,
              modelHashKey: 130864445,
              modelName: 'limbo1',
              isDoor: false,
              isGlass: true,
            }
          ]
        },
        {
          fromRoom: 2,
          toRoom: 1,
          roomPortalIndex: 0,
          mloPortalIndex: 1,
          globalPortalIndex: 1,
          flags: 0,
          isEnabled: [false, false],
          entities: [
            {
              maxOcclusion: 1.0,
              modelHashKey: 83737373,
              modelName: 'office1',
              isDoor: true,
              isGlass: false,
            }
          ]
        }
      ],
      globalPortals: [
        {
          fromRoom: 0,
          toRoom: 1,
          roomPortalIndex: 0,
          mloPortalIndex: 0,
          globalPortalIndex: 0,
          flags: 0,
          entities: [
            {
              entityModelHashKey: 130864445
            }
          ]
        },
        {
          fromRoom: 1,
          toRoom: 0,
          roomPortalIndex: 0,
          mloPortalIndex: 0,
          globalPortalIndex: 1,
          flags: 0,
          entities: [
            {
              entityModelHashKey: 130864445
            }
          ]
        }
      ]
    }
  }
], 2000);

if (isEnvBrowser()) {
  const root = document.getElementById('root');

  // https://i.imgur.com/iPTAdYV.png - Night time img
  // https://i.imgur.com/3pzRj9n.png - Day time img
  root!.style.backgroundImage = 'url("https://i.imgur.com/iPTAdYV.png")';
  root!.style.backgroundSize = 'cover';
  root!.style.backgroundRepeat = 'no-repeat';
  root!.style.backgroundPosition = 'center';
}

ReactDOM.render(
  <React.StrictMode>
    <MantineProvider withNormalizeCSS withGlobalStyles theme={customTheme}>
      <ModalsProvider modalProps={{ transition: 'slide-up' }}>
        <HashRouter>
          <App />
        </HashRouter>
      </ModalsProvider>
    </MantineProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
