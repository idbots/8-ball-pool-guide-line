const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.join(__dirname, 'src', 'img', 'icon'),  // Don't include extension - Forge handles platform-specific icons
    appBundleId: 'com.felipegm.8ballpoolguideline',
    appCategoryType: 'public.app-category.games',
    osxSign: {
      identity: 'Developer ID Application: Your Name (TEAMID)', // You'll need to update this
      hardenedRuntime: true,
      entitlements: 'entitlements.plist',
      'entitlements-inherit': 'entitlements.plist',
    },
    protocols: [
      {
        name: '8 Ball Pool Guide Line',
        schemes: ['8ballpool-guideline']
      }
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',
      config: {
        language: 1033,
        manufacturer: 'GM 111',
        name: '8-ball-pool-guide-line',
        exe: '8-ball-pool-guide-line',
        appUserModelId: 'com.idbots.8ballpoolguideline',
        shortName: '8BallPool',
        description: 'Advanced 8 Ball Pool Assistant with Dynamic Aiming Guidelines and Real-time Shot Prediction',
        version: '5.0.1',
        upgradeCode: '324b0d3c-0a5d-40e5-accd-a366acf6ecdf',
        shortcutFolderName: '8 Ball Pool Guide Line',
        programFilesFolderName: '8BallPoolGuideLine',
        ui: {
          chooseDirectory: true,
          enable: true
        },
        features: {
          autoUpdate: true,
          autoLaunch: true
        }
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO',
        icon: path.join(__dirname, 'src', 'img', 'icon.icns'),
        background: path.join(__dirname, 'assets', 'dmg-background.png'),
        contents: [
          {
            x: 448,
            y: 344,
            type: 'link',
            path: '/Applications'
          },
          {
            x: 192,
            y: 344,
            type: 'file',
            path: path.join(__dirname, 'out', '8 Ball Pool Guide Line.app')
          }
        ],
        window: {
          size: {
            width: 640,
            height: 480
          }
        }
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']  // Creates a backup distribution method for macOS
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};