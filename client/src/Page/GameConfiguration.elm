module Page.GameConfiguration exposing
    ( Model
    , Msg
    , init
    , subscriptions
    , toSession
    , update
    , view
    )

import Api.Query
import Browser.Events
import Colors
import Dict
import Element
import Element.Background
import Element.Font
import Element.Input
import GameOrConfiguration
import Graphql.Document
import Graphql.Http
import Graphql.Operation
import Graphql.SelectionSet
import Html
import Html.Attributes
import Json.Decode
import NewGame
import Player
import Ports
import RemoteData
import Route
import Session
import UserMap
import ViewHelpers


type Msg
    = GotGameAndMaps (RemoteData.RemoteData (Graphql.Http.Error SelectionSet) SelectionSet)
    | ChangeColorButtonClicked
    | ColorSelected Colors.Color
    | ColorSelectBackgroundClicked
    | GameStarted (RemoteData.RemoteData (Graphql.Http.Error Bool) Bool)
    | UpdatePlayerName String
    | UpdatedColor (RemoteData.RemoteData (Graphql.Http.Error Bool) Bool)
    | UpdatedPlayerName (RemoteData.RemoteData (Graphql.Http.Error Bool) Bool)
      -- | RemovePlayer String
    | StartGameClicked
    | SelectMap String
    | WindowResized Int Int
    | MapUpdated (RemoteData.RemoteData (Graphql.Http.Error Bool) Bool)
    | SubscriptionDataReceived Json.Decode.Value
      -- | SentMessage (Result (Graphql.Http.Error ()) ())
    | NewSubscriptionStatus SubscriptionStatus ()


type Model
    = Loading LoadingModel
    | Configuring ConfiguringModel


type alias LoadingModel =
    { session : Session.Session
    , gameAndMaps : RemoteData.RemoteData (Graphql.Http.Error SelectionSet) SelectionSet
    , playerToken : GameOrConfiguration.PlayerToken
    }


type alias ConfiguringModel =
    { session : Session.Session
    , configuration : GameOrConfiguration.Configuration
    , maps : List UserMap.UserMap
    , subscriptionStatus : SubscriptionStatus
    , configureColor : Bool
    , playerToken : GameOrConfiguration.PlayerToken
    , playerName : String
    , isCurrentUserHost : Bool
    }


type SubscriptionStatus
    = NotConnected
    | Connected
    | Reconnecting


type alias SelectionSet =
    { gameOrConfiguration : GameOrConfiguration.GameOrConfiguration
    , maps : List UserMap.UserMap
    }


selectionSet : GameOrConfiguration.PlayerToken -> Graphql.SelectionSet.SelectionSet SelectionSet Graphql.Operation.RootQuery
selectionSet playerToken =
    Graphql.SelectionSet.map2 SelectionSet
        (Api.Query.gameOrConfiguration { playerToken = playerToken |> GameOrConfiguration.playerTokenToString } GameOrConfiguration.gameOrConfigurationSelectionSet)
        (Api.Query.maps UserMap.selectionSet)


getGameAndMaps : String -> GameOrConfiguration.PlayerToken -> (RemoteData.RemoteData (Graphql.Http.Error SelectionSet) SelectionSet -> msg) -> Cmd msg
getGameAndMaps apiUrl playerToken toMsg =
    selectionSet playerToken
        |> Graphql.Http.queryRequest apiUrl
        |> Graphql.Http.send (RemoteData.fromResult >> toMsg)


init : Session.Session -> GameOrConfiguration.PlayerToken -> ( Model, Cmd Msg )
init session playerToken =
    ( Loading { session = session, gameAndMaps = RemoteData.Loading, playerToken = playerToken }
    , Cmd.batch
        [ getGameAndMaps session.apiUrl playerToken GotGameAndMaps
        ]
    )


toSession : Model -> Session.Session
toSession model =
    case model of
        Loading loadingModel ->
            loadingModel.session

        Configuring configuringModel ->
            configuringModel.session


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case model of
        Loading loadingModel ->
            case msg of
                GotGameAndMaps gameRemoteData ->
                    case gameRemoteData of
                        RemoteData.Success gameAndMaps ->
                            case gameAndMaps.gameOrConfiguration of
                                GameOrConfiguration.GameConfiguration configuration ->
                                    ( Configuring
                                        { session = loadingModel.session
                                        , configuration = configuration
                                        , maps = gameAndMaps.maps
                                        , subscriptionStatus = NotConnected
                                        , playerToken = loadingModel.playerToken
                                        , configureColor = False
                                        , isCurrentUserHost = configuration.isCurrentUserHost
                                        , playerName =
                                            case
                                                configuration.players
                                                    |> List.filter (\player -> player.id == configuration.currentUserPlayerId)
                                                    |> List.head
                                            of
                                                Just player ->
                                                    player.name

                                                Nothing ->
                                                    ""
                                        }
                                    , Cmd.batch
                                        [ Ports.createSubscriptions (GameOrConfiguration.playerConfigurationSubscriptionDocument loadingModel.playerToken |> Graphql.Document.serializeSubscription)
                                        , Ports.createSubscriptions (GameOrConfiguration.gameOrConfigurationSubscriptionDocument loadingModel.playerToken |> Graphql.Document.serializeSubscription)
                                        ]
                                    )

                                GameOrConfiguration.GameOrConfiguration _ ->
                                    ( model, Route.pushUrl (Session.navKey loadingModel.session) (Route.GameOrConfiguration loadingModel.playerToken) )

                        _ ->
                            ( Loading { loadingModel | gameAndMaps = gameRemoteData }
                            , Cmd.none
                            )

                SubscriptionDataReceived _ ->
                    -- case Json.Decode.decodeValue (GameOrConfiguration.gameOrConfigurationSubscriptionDocument loadingModel.playerToken |> Graphql.Document.decoder) newData of
                    --     Ok updatedGameOrConfiguration ->
                    --         case updatedGameOrConfiguration of
                    --             GameOrConfiguration.GameOrConfiguration _ ->
                    --                 ( model, Route.pushUrl (Session.navKey loadingModel.session) (Route.GameOrConfiguration loadingModel.playerToken) )

                    --             GameOrConfiguration.GameConfiguration _ ->
                    --                 ( model, Cmd.none )

                    --     Err _ ->
                            ( model, Cmd.none )

                NewSubscriptionStatus newStatus () ->
                    ( model, Cmd.none )

                WindowResized width height ->
                    ( Loading { loadingModel | session = loadingModel.session |> Session.updateWindowSize { width = width, height = height } }
                    , Cmd.none
                    )

                _ ->
                    ( model, Cmd.none )

        Configuring configuringModel ->
            case msg of
                ChangeColorButtonClicked ->
                    ( Configuring { configuringModel | configureColor = True }, Cmd.none )

                ColorSelectBackgroundClicked ->
                    ( Configuring { configuringModel | configureColor = False }, Cmd.none )

                ColorSelected color ->
                    let
                        configuration =
                            configuringModel.configuration

                        updatedPlayers =
                            configuration.players
                                |> List.map
                                    (\player ->
                                        if player.id == configuration.currentUserPlayerId then
                                            { player | color = color }

                                        else
                                            player
                                    )

                        updatedConfiguringModel : GameOrConfiguration.Configuration
                        updatedConfiguringModel =
                            { configuration | players = updatedPlayers }
                    in
                    ( Configuring { configuringModel | configuration = updatedConfiguringModel, configureColor = False }
                    , GameOrConfiguration.update configuringModel.session.apiUrl configuringModel.playerToken color configuringModel.playerName UpdatedColor
                    )

                MapUpdated _ ->
                    ( model, Cmd.none )

                SelectMap mapId ->
                    let
                        configuration =
                            configuringModel.configuration

                        updatedConfiguringModel : GameOrConfiguration.Configuration
                        updatedConfiguringModel =
                            { configuration | mapId = mapId |> UserMap.Id }
                    in
                    ( Configuring { configuringModel | configuration = updatedConfiguringModel }
                    , GameOrConfiguration.updateMap configuringModel.session.apiUrl configuringModel.playerToken mapId MapUpdated
                    )

                StartGameClicked ->
                    ( model, GameOrConfiguration.start configuringModel.session.apiUrl configuringModel.playerToken GameStarted )

                UpdatePlayerName name ->
                    let
                        configuration =
                            configuringModel.configuration

                        updatedPlayers =
                            configuration.players
                                |> List.map
                                    (\player ->
                                        if player.id == configuration.currentUserPlayerId then
                                            { player | name = name }

                                        else
                                            player
                                    )

                        updatedConfiguringModel : GameOrConfiguration.Configuration
                        updatedConfiguringModel =
                            { configuration | players = updatedPlayers }

                        color : Colors.Color
                        color =
                            configuration.players
                                |> List.filter
                                    (\player ->
                                        player.id == configuration.currentUserPlayerId
                                    )
                                |> List.head
                                |> Maybe.map .color
                                |> Maybe.withDefault Colors.black
                    in
                    ( Configuring { configuringModel | configuration = updatedConfiguringModel, playerName = name }
                    , GameOrConfiguration.update configuringModel.session.apiUrl configuringModel.playerToken color name UpdatedPlayerName
                    )

                GotGameAndMaps _ ->
                    ( model, Cmd.none )

                GameStarted _ ->
                    ( model, Route.pushUrl (Session.navKey configuringModel.session) (Route.GameOrConfiguration configuringModel.playerToken) )

                UpdatedColor _ ->
                    -- TODO: Check errors, possibly show as offline somehow, retry with exponential backoff
                    ( model, Cmd.none )

                UpdatedPlayerName _ ->
                    -- TODO: Check errors, possibly show as offline somehow, retry with exponential backoff
                    ( model, Cmd.none )

                -- RemovePlayer _ ->
                --     -- TODO: Check errors, possibly show as offline somehow, retry with exponential backoff
                --     ( model, Cmd.none )
                WindowResized width height ->
                    ( Configuring { configuringModel | session = configuringModel.session |> Session.updateWindowSize { width = width, height = height } }
                    , Cmd.none
                    )

                SubscriptionDataReceived newData ->
                    case Json.Decode.decodeValue (GameOrConfiguration.gameOrConfigurationSubscriptionDocument configuringModel.playerToken |> Graphql.Document.decoder) newData of
                        Ok updatedGameOrConfiguration ->
                            case updatedGameOrConfiguration of
                                GameOrConfiguration.GameOrConfiguration _ ->
                                    ( model, Route.pushUrl (Session.navKey configuringModel.session) (Route.GameOrConfiguration configuringModel.playerToken) )

                                GameOrConfiguration.GameConfiguration updatedConfiguration ->
                                    ( Configuring { configuringModel | configuration = updatedConfiguration }, Cmd.none )

                        Err _ ->
                            case Json.Decode.decodeValue (GameOrConfiguration.playerConfigurationSubscriptionDocument configuringModel.playerToken |> Graphql.Document.decoder) newData of
                                Ok updatedPlayerConfiguration ->
                                    let
                                        players =
                                            configuringModel.configuration.players
                                                |> List.map
                                                    (\player ->
                                                        if player.id == updatedPlayerConfiguration.id then
                                                            updatedPlayerConfiguration

                                                        else
                                                            player
                                                    )

                                        configuration =
                                            configuringModel.configuration

                                        updatedConfiguration =
                                            { configuration | players = players }
                                    in
                                    ( Configuring { configuringModel | configuration = updatedConfiguration }, Cmd.none )

                                Err _ ->
                                    ( model, Cmd.none )

                NewSubscriptionStatus newStatus () ->
                    ( Configuring { configuringModel | subscriptionStatus = newStatus }, Cmd.none )


view : Model -> { title : String, content : Html.Html Msg }
view model =
    case model of
        Loading _ ->
            { title = "Loading", content = ViewHelpers.loadingLayout }

        Configuring configuringModel ->
            viewConfiguring configuringModel


viewConfiguring : ConfiguringModel -> { title : String, content : Html.Html Msg }
viewConfiguring configuringModel =
    let
        p : Dict.Dict String { color : Colors.Color, name : String }
        p =
            configuringModel.configuration.players
                |> List.map
                    (\player ->
                        case player.id of
                            Player.Id id ->
                                ( id
                                , { name = player.name, color = player.color }
                                )
                    )
                |> Dict.fromList
    in
    { title = "Configure Game"
    , content =
        layout
            (playerColorSelect p configuringModel.configuration.currentUserPlayerId configuringModel.configureColor)
            (Element.el [ Element.width (Element.fill |> Element.minimum 360) ]
                (Element.column
                    [ Element.spacing 10
                    , Element.padding 10
                    , Element.centerX
                    , Element.width (Element.fill |> Element.maximum 1200)
                    , Element.height Element.shrink
                    ]
                    ([ joinUrlView configuringModel.session.origin configuringModel.configuration.joinToken
                     , Element.wrappedRow
                        [ Element.centerX
                        , Element.spacing 10
                        , Element.width Element.fill
                        ]
                        [ playerConfiguration (p |> Dict.toList) configuringModel.configuration.currentUserPlayerId configuringModel.playerName
                        , if configuringModel.isCurrentUserHost then
                            NewGame.mapConfigurationFields configuringModel.maps (Just (configuringModel.configuration.mapId |> UserMap.idToString)) SelectMap

                          else
                            NewGame.mapConfiguration configuringModel.maps (Just configuringModel.configuration.mapId)
                        ]
                     ]
                        ++ (if configuringModel.isCurrentUserHost then
                                if List.length configuringModel.configuration.players >= 2 then
                                    [ Element.el [ Element.width Element.fill ] (NewGame.startGameButton StartGameClicked) ]

                                else
                                    [ Element.paragraph (NewGame.configurationSectionAttributes ++ [ Element.spacing 0 ]) [ Element.text "Waiting for at least one other player to join..." ] ]

                            else
                                [ Element.paragraph (NewGame.configurationSectionAttributes ++ [ Element.spacing 0, Element.Font.center ]) [ Element.text "Waiting for host to start the game..." ] ]
                           )
                    )
                )
            )
    }


joinUrlView : String -> GameOrConfiguration.JoinToken -> Element.Element Msg
joinUrlView origin joinToken =
    Element.column
        NewGame.configurationSectionAttributes
        [ Element.paragraph [ Element.Font.size 14 ] [ Element.text "Give this URL to the people so they can join the game" ]
        , Element.paragraph [ Element.htmlAttribute (Html.Attributes.style "word-break" "break-all") ]
            [ origin ++ "/games/join/" ++ (joinToken |> GameOrConfiguration.joinTokenToString) |> Element.text ]
        ]


playerConfiguration : List ( String, Player.NewPlayer ) -> Player.Id -> String -> Element.Element Msg
playerConfiguration players currentUserPlayerId playerName =
    let
        newPlayersToRender : List ( Player.Id, Player.NewPlayer )
        newPlayersToRender =
            players
                |> List.map (Tuple.mapFirst Player.Id)
    in
    Element.column
        NewGame.configurationSectionAttributes
        [ Element.el
            [ Element.Font.bold
            ]
            (Element.text "Players")
        , playersFields newPlayersToRender currentUserPlayerId playerName
        ]


playersFields : List ( Player.Id, Player.NewPlayer ) -> Player.Id -> String -> Element.Element Msg
playersFields newPlayersToRender currentUserPlayerId playerName =
    newPlayersToRender
        |> toPlayerFields currentUserPlayerId
        |> playerFieldsView playerName


toPlayerFields : Player.Id -> List ( Player.Id, Player.NewPlayer ) -> PlayerFields
toPlayerFields currentUserPlayerId players =
    let
        addPlayerField : ( Player.Id, Player.NewPlayer ) -> PlayerFields -> PlayerFields
        addPlayerField ( playerId, player ) fields =
            case fields of
                PlayerFieldsWithCurrentUserCase playerFields ->
                    PlayerFieldsWithCurrentUserCase { playerFields | playersBefore = ( playerId, player ) :: playerFields.playersBefore }

                PlayerFieldsWithoutCurrentUserCase playerFields ->
                    if currentUserPlayerId == playerId then
                        PlayerFieldsWithCurrentUserCase { playersBefore = [], currentUserPlayer = ( playerId, player ), playersAfter = playerFields }

                    else
                        PlayerFieldsWithoutCurrentUserCase (( playerId, player ) :: playerFields)
    in
    players
        |> List.foldr
            addPlayerField
            (PlayerFieldsWithoutCurrentUserCase [])


type alias PlayerFieldsWithCurrentUser =
    { playersBefore : List ( Player.Id, Player.NewPlayer )
    , currentUserPlayer : ( Player.Id, Player.NewPlayer )
    , playersAfter : List ( Player.Id, Player.NewPlayer )
    }


type PlayerFields
    = PlayerFieldsWithCurrentUserCase PlayerFieldsWithCurrentUser
    | PlayerFieldsWithoutCurrentUserCase (List ( Player.Id, Player.NewPlayer ))


playerNameFieldWidth =
    Element.px 300


playerFieldsView : String -> PlayerFields -> Element.Element Msg
playerFieldsView playerName fields =
    let
        currentPlayerField : ( Player.Id, Player.NewPlayer ) -> Element.Element Msg
        currentPlayerField ( playerId, player ) =
            Element.row [ Element.width Element.fill ]
                [ Element.Input.text
                    [ Element.width playerNameFieldWidth
                    , Html.Attributes.id ("player-name-" ++ (playerId |> Player.idToString)) |> Element.htmlAttribute
                    ]
                    { onChange = UpdatePlayerName
                    , text = playerName
                    , placeholder = Nothing
                    , label = Element.Input.labelHidden "Name"
                    }
                , NewGame.colorButton player.color ChangeColorButtonClicked
                ]

        otherPlayerField : ( Player.Id, Player.NewPlayer ) -> Element.Element Msg
        otherPlayerField ( _, player ) =
            Element.row [ Element.width Element.fill ]
                [ Element.el
                    [ Element.width playerNameFieldWidth
                    , Element.paddingXY 5 0
                    , Element.height (Element.px 50)
                    , Element.Background.color (Colors.lightGray |> Colors.toElementColor)
                    , Element.Font.color (Colors.lightCharcoal |> Colors.toElementColor)
                    ]
                    (Element.el [ Element.centerY ] (Element.text player.name))
                , Element.el
                    [ Element.Background.color (player.color |> Colors.toElementColor)
                    , Element.width (Element.px 50)
                    , Element.height (Element.px 50)
                    ]
                    Element.none
                ]
    in
    case fields of
        PlayerFieldsWithCurrentUserCase playerFields ->
            [ playerFields.playersBefore |> List.map otherPlayerField
            , playerFields.currentUserPlayer |> currentPlayerField |> List.singleton
            , playerFields.playersAfter |> List.map otherPlayerField
            ]
                |> List.concat
                |> Element.column [ Element.spacing 10 ]

        PlayerFieldsWithoutCurrentUserCase _ ->
            Element.text "Error: Couldn't find fields for current user"


playerColorSelect : Dict.Dict String Player.NewPlayer -> Player.Id -> Bool -> Element.Element Msg
playerColorSelect players (Player.Id playerId) isConfiguringColor =
    if isConfiguringColor then
        case Dict.get playerId players of
            Just player ->
                ViewHelpers.dialog
                    ColorSelectBackgroundClicked
                    [ Element.width Element.shrink, Element.height (Element.px 300) ]
                    (Element.column
                        [ Element.padding 20
                        , Element.Background.color (Colors.white |> Colors.toElementColor)
                        , Element.spacing 20
                        , Element.width (Element.px 300)
                        ]
                        [ Element.text ("Select color for " ++ player.name)
                        , Element.wrappedRow [ Element.width Element.fill ]
                            (players
                                |> Player.availablePlayerColors
                                |> List.map (\color -> Element.el [ Element.height (Element.px 50) ] (NewGame.colorButton color (ColorSelected color)))
                            )
                        ]
                    )

            Nothing ->
                Element.text "Error getting player"

    else
        Element.none


layout : Element.Element Msg -> Element.Element Msg -> Html.Html Msg
layout overlay body =
    Element.layout
        (Element.inFront overlay :: ViewHelpers.layoutAttributes)
        (Element.column
            [ Element.width Element.fill
            , Element.spacingXY 0 20
            , Element.centerX
            ]
            [ Element.el
                [ Element.width (Element.fill |> Element.minimum ViewHelpers.minimumSupportedViewportWidth)
                , Element.centerX
                ]
                ViewHelpers.title
            , body
            ]
        )


subscriptions : Model -> Sub Msg
subscriptions _ =
    [ Browser.Events.onResize WindowResized
    , Ports.gotSubscriptionData SubscriptionDataReceived
    , Ports.socketStatusConnected (NewSubscriptionStatus Connected)
    , Ports.socketStatusReconnecting (NewSubscriptionStatus Reconnecting)
    ]
        |> Sub.batch
