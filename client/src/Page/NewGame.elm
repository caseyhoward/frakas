module Page.NewGame exposing
    ( Model
    , Msg
    , init
    , subscriptions
    , toSession
    , update
    , view
    )

import Browser.Dom
import Browser.Events
import Colors
import Element
import Element.Border
import Element.Font
import Element.Input
import Graphql.Http
import Html
import GameOrConfiguration
import RemoteData
import Route
import Session
import ViewHelpers


type alias Model =
    Session.Session


init : Session.Session -> ( Model, Cmd Msg )
init session =
    ( session
    , Cmd.none
    )


toSession : Model -> Session.Session
toSession model =
    model



---- UPDATE ----


type Msg
    = GameOrConfigurationClicked
    | GameOrConfigurationCreated (RemoteData.RemoteData (Graphql.Http.Error GameOrConfiguration.PlayerToken) GameOrConfiguration.PlayerToken)
    | FocusResult (Result Browser.Dom.Error ())
    | WindowResized Int Int


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GameOrConfigurationClicked ->
            ( model, GameOrConfiguration.create model.apiUrl GameOrConfigurationCreated )

        GameOrConfigurationCreated playerTokenRemoteData ->
            case playerTokenRemoteData of
                RemoteData.Success playerToken ->
                    ( model, Route.pushUrl (Session.navKey model) (Route.GameConfiguration playerToken) )

                _ ->
                    ( model, Cmd.none )

        _ ->
            ( model, Cmd.none )



---- VIEW ----


view : Model -> { title : String, content : Html.Html Msg }
view _ =
    let
        gameTypeButton : String -> String -> Msg -> Element.Element Msg
        gameTypeButton titleText description msg =
            Element.el [ Element.width Element.fill ]
                (Element.el
                    [ Element.centerX
                    ]
                    (Element.Input.button
                        (ViewHelpers.defaultButtonAttributes
                            ++ [ Element.width (Element.px 300)
                               , Element.height Element.fill
                               , Element.centerX
                               , Element.Border.color (Colors.black |> Colors.toElementColor)
                               , Element.Border.rounded 10
                               ]
                        )
                        { label =
                            Element.el
                                [ Element.padding 20, Element.width Element.fill, Element.Font.center ]
                                (Element.column
                                    [ Element.width Element.fill, Element.spacing 20 ]
                                    [ Element.el [ Element.Font.size 20, Element.width Element.fill, Element.Font.center ] (Element.text titleText)
                                    , Element.el [ Element.Font.medium ] (Element.paragraph [] [ Element.text description ])
                                    ]
                                )
                        , onPress = Just msg
                        }
                    )
                )
    in
    { title = "Choose Game Type"
    , content =
        layout
            Element.none
            (Element.el [ Element.width Element.fill, Element.centerX ]
                (Element.wrappedRow
                    [ Element.spacing 50, Element.centerX ]
                    [ gameTypeButton "Create game" "Create a new game where you can invite others join" GameOrConfigurationClicked
                    ]
                )
            )
    }


layout : Element.Element Msg -> Element.Element Msg -> Html.Html Msg
layout overlay body =
    Element.layout
        (ViewHelpers.layoutAttributes
            ++ [ Element.inFront overlay
               ]
        )
        (Element.column
            [ Element.width Element.fill
            , Element.spacingXY 0 20
            ]
            [ Element.el [ Element.width Element.fill, Element.centerX ] ViewHelpers.title
            , body
            ]
        )



---- SUBSCRIPTIONS ----


subscriptions : Model -> Sub Msg
subscriptions _ =
    Browser.Events.onResize (\x y -> WindowResized x y)
