const { Menu, MenuItem, BrowserWindow } = require("electron");
const i18nBackend = require("i18next-electron-fs-backend");
const whitelist = require("../localization/whitelist");
const isMac = process.platform === "darwin";

const MenuBuilder = function (mainWindow, appName) {

  // https://electronjs.org/docs/api/menu#main-process
  const defaultTemplate = function (i18nextMainBackend) {
    return [
      // { role: "appMenu" }
      ...(isMac
        ? [
          {
            label: appName,
            submenu: [
              {
                role: "about",
                label: i18nextMainBackend.t("About")
              },
              {
                type: "separator"
              },
              {
                role: "services",
                label: i18nextMainBackend.t("Services")
              },
              {
                type: "separator"
              },
              {
                role: "hide",
                label: i18nextMainBackend.t("Hide")
              },
              {
                role: "hideothers",
                label: i18nextMainBackend.t("Hide Others")
              },
              {
                role: "unhide",
                label: i18nextMainBackend.t("Unhide")
              },
              {
                type: "separator"
              },
              {
                role: "quit",
                label: i18nextMainBackend.t("Quit")
              }
            ]
          }
        ]
        : []),
      // { role: "fileMenu" }
      {
        label: i18nextMainBackend.t("File"),
        submenu: [
          isMac
            ? {
              role: "close",
              label: i18nextMainBackend.t("Quit")
            }
            : {
              role: "quit",
              label: i18nextMainBackend.t("Exit")
            }
        ]
      },
      {
        label: i18nextMainBackend.t("View"),
        submenu: [
          {
            role: "reload",
            label: i18nextMainBackend.t("Reload")
          },
          {
            role: "forcereload",
            label: i18nextMainBackend.t("Force Reload")
          },
          {
            role: "toggledevtools",
            label: i18nextMainBackend.t("Toggle Developer Tools")
          },
          {
            type: "separator"
          },
          {
            role: "resetzoom",
            label: i18nextMainBackend.t("Reset Zoom")
          },
          {
            role: "zoomin",
            label: i18nextMainBackend.t("Zoom In")
          },
          {
            role: "zoomout",
            label: i18nextMainBackend.t("Zoom Out")
          },
          {
            type: "separator"
          },
          {
            role: "togglefullscreen",
            label: i18nextMainBackend.t("Toggle Fullscreen")
          }
        ]
      },
      // { role: "windowMenu" }
      {
        label: i18nextMainBackend.t("Window"),
        submenu: [
          {
            role: "minimize",
            label: i18nextMainBackend.t("Minimize")
          },
          {
            role: "zoom",
            label: i18nextMainBackend.t("Zoom")
          },
          ...(isMac
            ? [
              {
                type: "separator"
              },
              {
                role: "front",
                label: i18nextMainBackend.t("Front")
              },
              {
                type: "separator"
              },
              {
                role: "window",
                label: i18nextMainBackend.t("Window")
              }
            ]
            : [
              {
                role: "close",
                label: i18nextMainBackend.t("Close")
              }
            ])
        ]
      },
    ];
  };

  return {
    buildMenu: function (i18nextMainBackend) {
      const menu = Menu.buildFromTemplate(defaultTemplate(i18nextMainBackend));
      Menu.setApplicationMenu(menu);

      return menu;
    }
  };
};

module.exports = MenuBuilder;
