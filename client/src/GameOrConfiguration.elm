module GameOrConfiguration exposing
    ( Configuration
    , GameOrConfiguration(..)
    , GameOrConfigurationTokens
    , JoinToken,gameOrConfigurationSubscriptionDocument
    , MapId(..)
    , PlayerToken
    , create
    , gameOrConfigurationSelectionSet
    , get
    , joinGame
    , joinTokenToString
    , joinTokenUrlParser
    , playerConfigurationSubscriptionDocument
    , playerTokenToString
    , playerTokenUrlParser
    , save
    , selectionSet
    , start
    , subscriptionDocument
    , update
    , updateColor
    , updateMap
    , updatePlayerName
    )

import Api.InputObject
import Api.Mutation
import Api.Object
import Api.Object.Game
import Api.Object.GameConfiguration
import Api.Object.GameWithoutMap
import Api.Object.PlayerConfiguration
import Api.Query
import Api.Subscription
import Api.Union
import Api.Union.GameOrConfiguration
import Colors
import DefaultMap
import Dict
import Game
import Graphql.Http
import Graphql.Operation
import Graphql.SelectionSet
import Player
import PlayerTurn
import RemoteData
import TroopCount
import Url.Parser
import UserMap


type alias PlayerConfiguration =
    { id : Player.Id
    , color : Colors.Color
    , name : String
    }


type MapId
    = UserMapIdCase UserMap.Id
    | DefaultMapCase DefaultMap.Id


type alias Configuration =
    { players : List PlayerConfiguration
    , mapId : UserMap.Id
    , joinToken : JoinToken
    , currentUserPlayerId : Player.Id
    , isCurrentUserHost : Bool
    }


type JoinToken
    = JoinToken String


type PlayerToken
    = PlayerToken String


type alias GameOrConfigurationTokens =
    { joinToken : JoinToken
    , playerToken : PlayerToken
    }


type GameOrConfiguration
    = GameOrConfiguration Game.Game
    | GameConfiguration Configuration


create : String -> (RemoteData.RemoteData (Graphql.Http.Error PlayerToken) PlayerToken -> msg) -> Cmd msg
create apiUrl toMsg =
    (Api.Mutation.createGame
        |> Graphql.SelectionSet.map PlayerToken
    )
        |> Graphql.Http.mutationRequest apiUrl
        |> Graphql.Http.send (RemoteData.fromResult >> toMsg)


get : String -> PlayerToken -> (RemoteData.RemoteData (Graphql.Http.Error Game.Game) Game.Game -> msg) -> Cmd msg
get apiUrl playerToken toMsg =
    Api.Query.game
        { playerToken = playerToken |> playerTokenToString }
        selectionSet
        |> Graphql.Http.queryRequest apiUrl
        |> Graphql.Http.send (RemoteData.fromResult >> toMsg)


joinGame : String -> JoinToken -> (RemoteData.RemoteData (Graphql.Http.Error PlayerToken) PlayerToken -> msg) -> Cmd msg
joinGame apiUrl (JoinToken joinToken) toMsg =
    Api.Mutation.joinGame { joinGameToken = joinToken }
        |> Graphql.SelectionSet.map PlayerToken
        |> Graphql.Http.mutationRequest apiUrl
        |> Graphql.Http.send (RemoteData.fromResult >> toMsg)


joinTokenToString : JoinToken -> String
joinTokenToString (JoinToken joinToken) =
    joinToken


start : String -> PlayerToken -> (RemoteData.RemoteData (Graphql.Http.Error Bool) Bool -> msg) -> Cmd msg
start apiUrl (PlayerToken playerToken) toMsg =
    Api.Mutation.startGame { playerToken = playerToken }
        |> Graphql.Http.mutationRequest apiUrl
        |> Graphql.Http.send (RemoteData.fromResult >> toMsg)


save : String -> PlayerToken -> Game.Game -> (RemoteData.RemoteData (Graphql.Http.Error Bool) Bool -> msg) -> Cmd msg
save apiUrl (PlayerToken playerToken) game toMsg =
    let
        gameInput : Api.InputObject.GameInput
        gameInput =
            Api.InputObject.buildGameInput
                { id = game.id |> Game.idToString
                , players = game.players |> Player.input
                , neutralCountryTroops = game.neutralCountryTroops |> TroopCount.troopCountsInput
                , playerTurn = game.currentPlayerTurn |> PlayerTurn.input
                }
    in
    Api.Mutation.saveGame { playerToken = playerToken, game = gameInput }
        |> Graphql.Http.mutationRequest apiUrl
        |> Graphql.Http.send (RemoteData.fromResult >> toMsg)


update : String -> PlayerToken -> Colors.Color -> String -> (RemoteData.RemoteData (Graphql.Http.Error Bool) Bool -> msg) -> Cmd msg
update apiUrl playerToken color name toMsg =
    Api.Mutation.updateGamePlayer
        { playerToken = playerToken |> playerTokenToString, color = color, name = name }
        |> Graphql.Http.mutationRequest apiUrl
        |> Graphql.Http.send (RemoteData.fromResult >> toMsg)


updateColor : String -> PlayerToken -> Colors.Color -> (RemoteData.RemoteData (Graphql.Http.Error Bool) Bool -> msg) -> Cmd msg
updateColor apiUrl playerToken color toMsg =
    Api.Mutation.updateGamePlayerColor
        { playerToken = playerToken |> playerTokenToString, color = color }
        |> Graphql.Http.mutationRequest apiUrl
        |> Graphql.Http.send (RemoteData.fromResult >> toMsg)


updatePlayerName : String -> PlayerToken -> String -> (RemoteData.RemoteData (Graphql.Http.Error Bool) Bool -> msg) -> Cmd msg
updatePlayerName apiUrl playerToken name toMsg =
    Api.Mutation.updateGamePlayerName
        { playerToken = playerToken |> playerTokenToString, name = name }
        |> Graphql.Http.mutationRequest apiUrl
        |> Graphql.Http.send (RemoteData.fromResult >> toMsg)


updateMap : String -> PlayerToken -> String -> (RemoteData.RemoteData (Graphql.Http.Error Bool) Bool -> msg) -> Cmd msg
updateMap apiUrl playerToken mapId toMsg =
    Api.Mutation.updateGameMap
        { playerToken = playerToken |> playerTokenToString
        , mapId = mapId
        , mapIdType = "user"
        }
        |> Graphql.Http.mutationRequest apiUrl
        |> Graphql.Http.send (RemoteData.fromResult >> toMsg)


subscriptionDocument : PlayerToken -> Graphql.SelectionSet.SelectionSet Game.GameWithoutMap Graphql.Operation.RootSubscription
subscriptionDocument (PlayerToken playerToken) =
    Api.Subscription.game { playerToken = playerToken } gameWithoutMapSelectionSet


gameOrConfigurationSubscriptionDocument : PlayerToken -> Graphql.SelectionSet.SelectionSet GameOrConfiguration Graphql.Operation.RootSubscription
gameOrConfigurationSubscriptionDocument (PlayerToken playerToken) =
    Api.Subscription.gameOrConfiguration { playerToken = playerToken } gameOrConfigurationSelectionSet


playerConfigurationSubscriptionDocument : PlayerToken -> Graphql.SelectionSet.SelectionSet PlayerConfiguration Graphql.Operation.RootSubscription
playerConfigurationSubscriptionDocument (PlayerToken playerToken) =
    Api.Subscription.gamePlayerUpdate { playerToken = playerToken } playerConfigurationSelectionSet


gameOrConfigurationSelectionSet : Graphql.SelectionSet.SelectionSet GameOrConfiguration Api.Union.GameOrConfiguration
gameOrConfigurationSelectionSet =
    Api.Union.GameOrConfiguration.fragments
        { onGameConfiguration = configurationSelectionSet
        , onGame = gameSelectionSet
        }


gameSelectionSet : Graphql.SelectionSet.SelectionSet GameOrConfiguration Api.Object.Game
gameSelectionSet =
    Graphql.SelectionSet.map GameOrConfiguration selectionSet


configurationSelectionSet1 : Graphql.SelectionSet.SelectionSet Configuration Api.Object.GameConfiguration
configurationSelectionSet1 =
    Graphql.SelectionSet.map5
        (\players mapId joinToken currentUserPlayerId isCurrentUserHost ->
            { players = players
            , mapId = mapId
            , currentUserPlayerId = Player.Id currentUserPlayerId
            , joinToken = JoinToken joinToken
            , isCurrentUserHost = isCurrentUserHost
            }
        )
        (Api.Object.GameConfiguration.players playerConfigurationSelectionSet)
        (Graphql.SelectionSet.map UserMap.Id Api.Object.GameConfiguration.mapId)
        Api.Object.GameConfiguration.joinToken
        Api.Object.GameConfiguration.currentUserPlayerId
        Api.Object.GameConfiguration.isCurrentUserHost


configurationSelectionSet : Graphql.SelectionSet.SelectionSet GameOrConfiguration Api.Object.GameConfiguration
configurationSelectionSet =
    Graphql.SelectionSet.map GameConfiguration configurationSelectionSet1


userMapOrDefaultMapSelectionSet : Graphql.SelectionSet.SelectionSet Game.UserMapOrDefaultMap Api.Object.Map
userMapOrDefaultMapSelectionSet =
    UserMap.selectionSet
        |> Graphql.SelectionSet.map Game.UserMapCase


selectionSet : Graphql.SelectionSet.SelectionSet Game.Game Api.Object.Game
selectionSet =
    Graphql.SelectionSet.map6
        (\id2 map currentPlayerTurn players neutralCountryTroops currentUserPlayerId ->
            let
                activeGame : Game.Game
                activeGame =
                    { id = Game.Id id2
                    , currentPlayerTurn = currentPlayerTurn
                    , map = map
                    , players = players |> Player.playerSelectionSetsToPlayers
                    , neutralCountryTroops = neutralCountryTroops |> Dict.fromList
                    , currentUserPlayerId = currentUserPlayerId |> Player.Id
                    }
            in
            activeGame
        )
        Api.Object.Game.id
        (Api.Object.Game.map userMapOrDefaultMapSelectionSet)
        (Api.Object.Game.playerTurn PlayerTurn.selectionSet)
        (Api.Object.Game.players Player.playerSelection)
        (Api.Object.Game.neutralCountryTroops TroopCount.troopCountsSelection)
        Api.Object.Game.currentUserPlayerId


gameWithoutMapSelectionSet : Graphql.SelectionSet.SelectionSet Game.GameWithoutMap Api.Object.GameWithoutMap
gameWithoutMapSelectionSet =
    Graphql.SelectionSet.map5
        (\id2 currentPlayerTurn players neutralCountryTroops currentUserPlayerId ->
            let
                game : Game.GameWithoutMap
                game =
                    { id = Game.Id id2
                    , currentPlayerTurn = currentPlayerTurn
                    , players = players |> Player.playerSelectionSetsToPlayers
                    , neutralCountryTroops = neutralCountryTroops |> Dict.fromList
                    , currentUserPlayerId = currentUserPlayerId |> Player.Id
                    }
            in
            game
        )
        Api.Object.GameWithoutMap.id
        (Api.Object.GameWithoutMap.playerTurn PlayerTurn.selectionSet)
        (Api.Object.GameWithoutMap.players Player.playerSelection)
        (Api.Object.GameWithoutMap.neutralCountryTroops TroopCount.troopCountsSelection)
        Api.Object.GameWithoutMap.currentUserPlayerId


playerTokenToString : PlayerToken -> String
playerTokenToString (PlayerToken token) =
    token


playerTokenUrlParser : Url.Parser.Parser (PlayerToken -> a) a
playerTokenUrlParser =
    Url.Parser.custom "PLAYERTOKEN" (\playerId -> playerId |> PlayerToken |> Just)


joinTokenUrlParser : Url.Parser.Parser (JoinToken -> a) a
joinTokenUrlParser =
    Url.Parser.custom "JOINTOKEN" (\joinToken -> joinToken |> JoinToken |> Just)


playerConfigurationSelectionSet : Graphql.SelectionSet.SelectionSet PlayerConfiguration Api.Object.PlayerConfiguration
playerConfigurationSelectionSet =
    Graphql.SelectionSet.map3
        PlayerConfiguration
        (Graphql.SelectionSet.map Player.Id Api.Object.PlayerConfiguration.playerId)
        (Api.Object.PlayerConfiguration.color Colors.selectionSet)
        Api.Object.PlayerConfiguration.name
