module Session exposing
    ( Session
    , WindowSize
    , init
    , navKey
    , updateWindowSize
    )

import Browser.Navigation


type alias WindowSize =
    { width : Int
    , height : Int
    }


type alias Session =
    { windowSize : WindowSize
    , navKey : Browser.Navigation.Key
    , origin : String
    , apiUrl : String
    }


init : Browser.Navigation.Key -> String -> WindowSize -> String -> Session
init key origin windowSize apiUrl =
    { windowSize = windowSize
    , navKey = key
    , origin = origin
    , apiUrl = apiUrl
    }


navKey : Session -> Browser.Navigation.Key
navKey session =
    session.navKey


updateWindowSize : WindowSize -> Session -> Session
updateWindowSize windowSize session =
    { session | windowSize = windowSize }
