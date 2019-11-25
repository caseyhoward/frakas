module Page.JoinGame exposing
    ( Model
    , Msg
    , init
    , toSession
    , update
    , view
    )

import Element
import GameOrConfiguration
import Graphql.Http
import Html
import RemoteData
import Route
import Session


type alias Model =
    { session : Session.Session
    , joinedGameRemoteData : RemoteData.RemoteData (Graphql.Http.Error GameOrConfiguration.PlayerToken) GameOrConfiguration.PlayerToken
    }


type Msg
    = JoinedGame (RemoteData.RemoteData (Graphql.Http.Error GameOrConfiguration.PlayerToken) GameOrConfiguration.PlayerToken)


init : Session.Session -> GameOrConfiguration.JoinToken -> ( Model, Cmd Msg )
init session playerToken =
    ( { session = session, joinedGameRemoteData = RemoteData.Loading }
    , GameOrConfiguration.joinGame session.apiUrl playerToken JoinedGame
    )


view : Model -> { title : String, content : Html.Html Msg }
view _ =
    { title = "Joining game", content = Element.layout [] (Element.text "Joining...") }


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case message of
        JoinedGame playerTokenRemoteData ->
            case playerTokenRemoteData of
                RemoteData.Success playerToken ->
                    ( { model | joinedGameRemoteData = playerTokenRemoteData }, Route.pushUrl model.session.navKey (Route.GameConfiguration playerToken) )

                _ ->
                    ( model, Cmd.none )


toSession : Model -> Session.Session
toSession model =
    model.session
