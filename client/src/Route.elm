module Route exposing
    ( Route(..)
    , fromUrl
    , href
    , pushUrl
    , replaceUrl
    )

import Browser.Navigation as Nav
import GameOrConfiguration
import Html exposing (Attribute)
import Html.Attributes as Attr
import Player
import Url exposing (Url)
import Url.Parser as Parser exposing ((</>), Parser, oneOf, s)



-- EXPOSED


type Route
    = Map
    | ConfiguringGame
    | GameOrConfiguration GameOrConfiguration.PlayerToken
    | GameConfiguration GameOrConfiguration.PlayerToken
    | JoinGame GameOrConfiguration.JoinToken


href : Route -> Attribute msg
href targetRoute =
    Attr.href (routeToString targetRoute)


replaceUrl : Nav.Key -> Route -> Cmd msg
replaceUrl key route =
    Nav.replaceUrl key (routeToString route)


pushUrl : Nav.Key -> Route -> Cmd msg
pushUrl key route =
    Nav.pushUrl key (routeToString route)


fromUrl : Url -> Maybe Route
fromUrl url =
    url |> Parser.parse parser



-- INTERNAL


parser : Parser (Route -> a) a
parser =
    oneOf
        [ Parser.map ConfiguringGame Parser.top
        , Parser.map ConfiguringGame (s "games" </> s "new")
        , Parser.map GameConfiguration (s "games" </> GameOrConfiguration.playerTokenUrlParser </> s "configure")
        , Parser.map GameOrConfiguration (s "games" </> GameOrConfiguration.playerTokenUrlParser)
        , Parser.map JoinGame (s "games" </> s "join" </> GameOrConfiguration.joinTokenUrlParser)
        , Parser.map Map (s "maps" </> s "new")
        ]


routeToString : Route -> String
routeToString page =
    let
        pieces =
            case page of
                ConfiguringGame ->
                    [ "games", "new" ]

                JoinGame joinGameKey ->
                    [ "games", "join", joinGameKey |> GameOrConfiguration.joinTokenToString ]

                GameConfiguration playerKey ->
                    [ "games", playerKey |> GameOrConfiguration.playerTokenToString, "configure" ]

                GameOrConfiguration playerKey ->
                    [ "games", playerKey |> GameOrConfiguration.playerTokenToString ]

                Map ->
                    [ "maps", "new" ]
    in
    "/" ++ String.join "/" pieces
