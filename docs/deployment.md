# Deploy and configure of **Data ID Card** from a Zip file

## Pre Requisite

To deploy and use Data ID Card you need:

- HOPEX V3 CP4 minimum
- Install **HOPEX Graphql**. You can download it from [HOPEX store](https://community.mega.com/t5/HOPEX-Store/GraphQL-REST-API/td-p/21381).
- **HTTPS** is mandatory since **Data ID Card** is a [PWA](https://developers.google.com/web/ilt/pwa/introduction-to-progressive-web-app-architectures).
- [URL Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite)  Extension for IIS
- Browser minimum version [please check](https://caniuse.com/#feat=serviceworkers)

## Deploy on IIS

> **:exclamation: Caution**
>
> The url of the application should end with **data-idcard**
>

Copy the content of the `Zip file` to `C:\inetpub\wwwroot\data-idcard`

## Configuration file

Create the application configuration file **config.json**. Copy `C:\inetpub\wwwroot\data-idcard\config\config.json.example` to `C:\inetpub\wwwroot\data-idcard\config\config.json`

- Set **ROOT_API** to the root url of HOPEX no leading HOPEX no leading **/**. For instance `https://myHopexRootURL.mycompany.com` will be the **ROOT_API** if  `https://myHopexRootURL.mycompany.com/hopex` is the URL of HOPEX.
- The **environmentId** is the absolute identifier of the production environment you can get it form the megasite.ini and convert it.
- The **repositoryId** is the absolute identifier of the repository you can get it form the megaenv.ini and convert it.
- The **profileId** is the absolute identifier of a profile. the default value **s01dAwPeUbb2** is the absolute identifier of the profile **Data IdCard User**.
- Set the **client_secret** according HOPEX configuration.
- The **connectivity url** can be set to `https://myHopexRootURL.mycompany.com/data-idcard/img/px.gif` to avoid cross-site warning, if `https://myHopexRootURL.mycompany.com` is the ROOT_API.

 ```json
{
  "ROOT_API": "",                     "Comment of ROOT_API":     " root url of HOPEX no leading HOPEX no leading /",
  "environmentId": "",                "Comment of environmentId":" Absolute identifier of the environment see megasite.ini and convert it",
  "repositoryId": "",                 "Comment of repositoryId": " Absolute identifier of the repository  see megaenv.ini and convert it",
  "profileId": "s01dAwPeUbb2",        "Comment of profileId":    " Absolute identifier of the default profile Data IdCard User s01dAwPeUbb2",
  "client_id": "hopexapi",            "Comment of client_id":    " Authentication Client Id",
  "client_secret": "secret",          "Comment of client_secret":" Authentication Client secret Set the secret of hopexapi check HOPEX configuration",
  "title": "Data ID Card",
  "connectivity": {
    "url": "https://www.google.com/images/phd/px.gif", "Comment of url":         "URL to ping in order to determine the network connectivity",
    "timeToCount": "3",        "Comment of timeToCount": "The number of time we repeat the operation",
    "threshold": "3000",       "Comment of threshold":   "The threshold at which we decide to be offline",
    "interval": "20000",       "Comment of interval":    "The time between each repetition"
  },
  "API_timeout": 6000,         "Comment of API_timeout":  " Limit of time in ms, where the application switches to offline mode 0 will ignore",
  "ASYNC_timeout": 6000,       "Comment of ASYNC_timeout":  " Limit of time in ms, where the API waits to give a response or a job ID",
  "synchroInterval" : 6000,    "Comment of synchroInterval":"Time, in ms, between two synchronization with the server HOPEX",
  "toast": {
    "actionTextColor": "black",
    "errorColor": "#EE2665",
    "successColor": "#31B672"
  }
}
 ```

---

## User guide

[Data ID Card quick start guide](README.md)
