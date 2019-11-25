module Main exposing (main)

import Browser
import Browser.Navigation
import Html
import Page
import Page.GameConfiguration
import Page.GameOrConfiguration
import Page.JoinGame
import Page.NewGame
import Page.NewMap
import Route
import Session
import Url



---- MODEL ----


type Model
    = Map Page.NewMap.Model
    | GameOrConfiguration Page.GameOrConfiguration.Model
    | GameConfiguration Page.GameConfiguration.Model
    | JoinGame Page.JoinGame.Model
    | Redirect Session.Session
    | NewGame Page.NewGame.Model


type alias Flags =
    { viewport :
        { width : Int
        , height : Int
        }
    , apiUrl : String
    }


main : Program Flags Model Msg
main =
    Browser.application
        { view = view
        , init = init
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = ChangedUrl
        , onUrlRequest = ClickedLink
        }


init : Flags -> Url.Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init flags url key =
    let
        protocol =
            case url.protocol of
                Url.Http ->
                    "http://"

                Url.Https ->
                    "https://"

        port_ =
            url.port_ |> Maybe.map (\p -> ":" ++ String.fromInt p) |> Maybe.withDefault ""

        origin =
            protocol ++ url.host ++ port_
    in
    changeRouteTo (Route.fromUrl url)
        (Redirect (Session.init key origin flags.viewport flags.apiUrl))



---- UPDATE ----


type
    Msg
    -- = ChangedRoute (Maybe Route.Route)
    = ChangedUrl Url.Url
    | ClickedLink Browser.UrlRequest
    | GotMapMsg Page.NewMap.Msg
    | GotGameOrConfigurationMsg Page.GameOrConfiguration.Msg
    | GotGameConfigurationMsg Page.GameConfiguration.Msg
    | GotJoinGameMsg Page.JoinGame.Msg
    | GotNewGameMsg Page.NewGame.Msg


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case ( msg, model ) of
        ( ClickedLink urlRequest, _ ) ->
            case urlRequest of
                Browser.Internal url ->
                    ( model, Browser.Navigation.pushUrl (Session.navKey (toSession model)) (Url.toString url) )

                Browser.External href ->
                    ( model
                    , Browser.Navigation.load href
                    )

        ( ChangedUrl url, _ ) ->
            changeRouteTo (Route.fromUrl url) model

        -- ( ChangedRoute route, _ ) ->
        --     changeRouteTo route model
        ( GotMapMsg subMsg, Map newMap ) ->
            Page.NewMap.update subMsg newMap
                |> updateWith Map GotMapMsg

        ( GotNewGameMsg subMsg, NewGame newGame ) ->
            Page.NewGame.update subMsg newGame
                |> updateWith NewGame GotNewGameMsg

        ( GotGameOrConfigurationMsg subMsg, GameOrConfiguration game ) ->
            Page.GameOrConfiguration.update subMsg game
                |> updateWith GameOrConfiguration GotGameOrConfigurationMsg

        ( GotGameConfigurationMsg subMsg, GameConfiguration gameConfiguration ) ->
            Page.GameConfiguration.update subMsg gameConfiguration
                |> updateWith GameConfiguration GotGameConfigurationMsg

        ( GotJoinGameMsg subMsg, JoinGame game ) ->
            Page.JoinGame.update subMsg game
                |> updateWith JoinGame GotJoinGameMsg

        ( _, _ ) ->
            -- Disregard messages that arrived for the wrong page.
            ( model, Cmd.none )


updateWith : (subModel -> Model) -> (subMsg -> Msg) -> ( subModel, Cmd subMsg ) -> ( Model, Cmd Msg )
updateWith toModel toMsg ( subModel, subCmd ) =
    ( toModel subModel
    , Cmd.map toMsg subCmd
    )


changeRouteTo : Maybe Route.Route -> Model -> ( Model, Cmd Msg )
changeRouteTo maybeRoute model =
    let
        session =
            toSession model
    in
    case maybeRoute of
        Just Route.ConfiguringGame ->
            Page.NewGame.init session
                |> updateWith NewGame GotNewGameMsg

        Just Route.Map ->
            Page.NewMap.init session
                |> updateWith Map GotMapMsg

        Just (Route.GameOrConfiguration playerToken) ->
            Page.GameOrConfiguration.init session playerToken
                |> updateWith GameOrConfiguration GotGameOrConfigurationMsg

        Just (Route.GameConfiguration playerToken) ->
            Page.GameConfiguration.init session playerToken
                |> updateWith GameConfiguration GotGameConfigurationMsg

        Just (Route.JoinGame joinToken) ->
            Page.JoinGame.init session joinToken
                |> updateWith JoinGame GotJoinGameMsg

        Nothing ->
            ( model, Cmd.none )


toSession : Model -> Session.Session
toSession model =
    case model of
        NewGame newGame ->
            newGame |> Page.NewGame.toSession

        GameOrConfiguration game ->
            game |> Page.GameOrConfiguration.toSession

        GameConfiguration gameConfiguration ->
            gameConfiguration |> Page.GameConfiguration.toSession

        JoinGame game ->
            game |> Page.JoinGame.toSession

        Map newMap ->
            newMap |> Page.NewMap.toSession

        Redirect session ->
            session



---- VIEW ----


view : Model -> Browser.Document Msg
view model =
    let
        viewPage page toMsg config =
            let
                { title, body } =
                    Page.view page config
            in
            { title = title
            , body = List.map (Html.map toMsg) body
            }
    in
    case model of
        NewGame newGame ->
            viewPage Page.NewGame GotNewGameMsg (Page.NewGame.view newGame)

        GameOrConfiguration game ->
            viewPage Page.GameOrConfiguration GotGameOrConfigurationMsg (Page.GameOrConfiguration.view game)

        GameConfiguration gameConfiguration ->
            viewPage Page.GameConfiguration GotGameConfigurationMsg (Page.GameConfiguration.view gameConfiguration)

        JoinGame joinGame ->
            viewPage Page.JoinGame GotJoinGameMsg (Page.JoinGame.view joinGame)

        Map newMap ->
            viewPage Page.NewMap GotMapMsg (Page.NewMap.view newMap)

        Redirect _ ->
            { title = "Redirecting", body = [ Html.div [] [] ] }



---- SUBSCRIPTIONS ----


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        NewGame newGame ->
            Sub.map GotNewGameMsg (Page.NewGame.subscriptions newGame)

        GameOrConfiguration game ->
            Sub.map GotGameOrConfigurationMsg (Page.GameOrConfiguration.subscriptions game)

        GameConfiguration gameConfiguration ->
            Sub.map GotGameConfigurationMsg (Page.GameConfiguration.subscriptions gameConfiguration)

        JoinGame _ ->
            Sub.none

        Map newMap ->
            Sub.map GotMapMsg (Page.NewMap.subscriptions newMap)

        Redirect _ ->
            Sub.none
