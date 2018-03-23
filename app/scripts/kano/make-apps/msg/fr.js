(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    Kano.MakeApps.Msg = Kano.MakeApps.Msg || {};

    Kano.MakeApps.Msg['add-parts-1'] = "We'll start by adding parts to our app.";
    Kano.MakeApps.Msg['add-parts-2'] = "To build the interface of the app, we need parts";

    Kano.MakeApps.Msg['open-parts-drawer-1'] = "Click here to see all the parts.";
    Kano.MakeApps.Msg['open-parts-drawer-2'] = "Open the parts drawer by clicking here.";

    Kano.MakeApps.Msg['start-code-1'] = "Now we can start coding.";
    Kano.MakeApps.Msg['start-code-2'] = "All the parts are here, let's code!";

    Kano.MakeApps.Msg['close-parts-drawer-1'] = "Close the drawer.";
    Kano.MakeApps.Msg['close-parts-drawer-2'] = "Hit that button";

    Kano.MakeApps.Msg['connect-blocks-1'] = "Connect it to this block";

    Kano.MakeApps.Msg['drop-codespace-1'] = "Drop the block anywhere on your code space";


    Kano.MakeApps.Msg['wrong-block-added-1'] = "Oh no! this is not the right block.";

    Kano.MakeApps.Msg['put-block-in-bin-1'] = "That's ok, put it in the bin";

    Kano.MakeApps.Msg['wrong-category-opened-1'] = "Nope, open this one instead";
    Kano.MakeApps.Msg['wrong-block-connection-1'] = "Whoops, not quite right. Put it there instead";


    Kano.MakeApps.Msg.Groups = Kano.MakeApps.Msg.Groups || {};

    Kano.MakeApps.Msg.Groups['add-parts'] = ['add-parts-1', 'add-parts-2'];
    Kano.MakeApps.Msg.Groups['open-parts-drawer'] = ['open-parts-drawer-1', 'open-parts-drawer-2'];
    Kano.MakeApps.Msg.Groups['start-code'] = ['start-code-1', 'start-code-2'];
    Kano.MakeApps.Msg.Groups['close-parts-drawer'] = ['close-parts-drawer-1', 'close-parts-drawer-2'];
    Kano.MakeApps.Msg.Groups['connect-blocks'] = ['connect-blocks-1'];
    Kano.MakeApps.Msg.Groups['drop-codespace'] = ['drop-codespace-1'];
    Kano.MakeApps.Msg.Groups['wrong-block-added'] = ['wrong-block-added-1'];
    Kano.MakeApps.Msg.Groups['put-block-in-bin'] = ['put-block-in-bin-1'];
    Kano.MakeApps.Msg.Groups['wrong-category-opened'] = ['wrong-category-opened-1'];
    Kano.MakeApps.Msg.Groups['wrong-block-connection'] = ['wrong-block-connection-1'];


    Kano.MakeApps.Msg.CLOSE = "Close";

    Kano.MakeApps.Msg.STROKE_SIZE = "Stroke Size";
    Kano.MakeApps.Msg.STROKE_COLOR = "Stroke Color";
    Kano.MakeApps.Msg.WIDTH = "Width";
    Kano.MakeApps.Msg.HEIGHT = "Height";
    Kano.MakeApps.Msg.RADIUS = "Radius";
    Kano.MakeApps.Msg.COLOR = "Color";
    Kano.MakeApps.Msg.LABEL = "Label";
    Kano.MakeApps.Msg.WAVE = "Wave";
    Kano.MakeApps.Msg.SPEED = "Speed";
    Kano.MakeApps.Msg.DELAY = "Delay";
    Kano.MakeApps.Msg.MIN = "Min";
    Kano.MakeApps.Msg.MAX = "Max";
    Kano.MakeApps.Msg.IMAGE = "Image";
    Kano.MakeApps.Msg.ANIMATION = "Animation";
    Kano.MakeApps.Msg.ANIMATIONS = "Animations";
    Kano.MakeApps.Msg.BITMAP = "Bitmap";
    Kano.MakeApps.Msg.BITMAPS = "Bitmaps";
    Kano.MakeApps.Msg.SIZE = "Size";
    Kano.MakeApps.Msg.TEXT = "Text";
    Kano.MakeApps.Msg.PLACEHOLDER = "Placeholder";
    Kano.MakeApps.Msg.SCROLL_DEFAULT = "My scrolling text";
    Kano.MakeApps.Msg.TEXT_DEFAULT = "My text";

    Kano.MakeApps.Msg.IS_CLICKED = "is clicked";
    Kano.MakeApps.Msg.CHANGED = "changed";
    Kano.MakeApps.Msg.CLICK_ME = "Click me";

    Kano.MakeApps.Msg.PART_BOX_NAME = "Box";
    Kano.MakeApps.Msg.PART_BUTTON_NAME = "Button";
    Kano.MakeApps.Msg.PART_CLOCK_NAME = "Clock";
    Kano.MakeApps.Msg.PART_MAP_NAME = "Map";
    Kano.MakeApps.Msg.PART_MIC_NAME = "Mic";
    Kano.MakeApps.Msg.PART_OSC_NAME = "Osc";
    Kano.MakeApps.Msg.PART_PICTURE_LIST_NAME = "Picture List";
    Kano.MakeApps.Msg.PART_SCROLL_NAME = "Scroller";
    Kano.MakeApps.Msg.PART_SLIDER_NAME = "Slider";
    Kano.MakeApps.Msg.PART_SPEAKER_NAME = "Speaker";
    Kano.MakeApps.Msg.PART_STICKER_NAME = "Sticker";
    Kano.MakeApps.Msg.PART_TEXT_NAME = "Text";
    Kano.MakeApps.Msg.PART_TEXT_INPUT_NAME = "Text input";
    Kano.MakeApps.Msg.PART_CANVAS_NAME = "Draw";
    Kano.MakeApps.Msg.PART_DATA_SHARE_NAME = "Shares";
    Kano.MakeApps.Msg.PART_DATA_ISS_NAME = "ISS";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_NAME = "Weather";
    Kano.MakeApps.Msg.PART_DATA_RSS_NAME = "RSS";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_NAME = "Sports";
    Kano.MakeApps.Msg.PART_LIGHT_ANIMATION_NAME = "Animation";
    Kano.MakeApps.Msg.PART_LIGHT_ANIMATION_DISPLAY_NAME = "Player";
    Kano.MakeApps.Msg.PART_LIGHT_CIRCLE_NAME = "Circle";
    Kano.MakeApps.Msg.PART_LIGHT_FRAME_NAME = "Frame";
    Kano.MakeApps.Msg.PART_LIGHT_RECTANGLE_NAME = "Rectangle";
    Kano.MakeApps.Msg.PART_FIREWORKS_NAME = "Fireworks";
    Kano.MakeApps.Msg.PART_TALKING_FACE_NAME = "Talking face";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_NAME = "Gesture Sensor";
    Kano.MakeApps.Msg.PART_GYRO_ACCELEROMETER_NAME = "Tilt";
    Kano.MakeApps.Msg.PART_MOTION_SENSOR_NAME = "Tripwire";
    Kano.MakeApps.Msg.PART_PROXIMITY_SENSOR_NAME = "Proximity Sensor";

    Kano.MakeApps.Msg.BLOCK_TEXT_INPUT_TYPE_IN = "Type in here...";

    Kano.MakeApps.Msg.PART_DATA_SHARE_TITLE_TITLE = "Title";
    Kano.MakeApps.Msg.PART_DATA_SHARE_TITLE_DESC = "Title of the share";
    Kano.MakeApps.Msg.PART_DATA_SHARE_LIKES_TITLE = "Likes";
    Kano.MakeApps.Msg.PART_DATA_SHARE_LIKES_DESC = "How many likes the share got";
    Kano.MakeApps.Msg.PART_DATA_SHARE_USER_TITLE = "User";
    Kano.MakeApps.Msg.PART_DATA_SHARE_USER_DESC = "Name of the author of the share";
    Kano.MakeApps.Msg.PART_DATA_SHARE_IMAGE_TITLE = "Image";
    Kano.MakeApps.Msg.PART_DATA_SHARE_IMAGE_DESC = "Image of the share";

    Kano.MakeApps.Msg.PART_DATA_ISS_LATITUDE_TITLE = "Latitude";
    Kano.MakeApps.Msg.PART_DATA_ISS_LATITUDE_DESC = "Latitude of the ISS";
    Kano.MakeApps.Msg.PART_DATA_ISS_LONGITUDE_TITLE = "Longitude";
    Kano.MakeApps.Msg.PART_DATA_ISS_LONGITUDE_DESC = "Longitude of the ISS";

    Kano.MakeApps.Msg.PART_DATA_WEATHER_LOCATION_TITLE = "Location";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_LOCATION_DEFAULT = "London, U.K.";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_UNITS_TITLE = "Units";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_UNITS_DESC = "The metric system will display the temperature in ºC while the imperial one will display it in ºF";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_UNITS_METRIC = "Metric system";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_UNITS_IMPERIAL = "Imperial system";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_TEMPERATURE_TITLE = "Temperature";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_TEMPERATURE_DESC = "The current temperature at the location";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_SPEED_TITLE = "Wind speed";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_SPEED_DESC = "The speed of the wind";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_ANGLE_TITLE = "Wind angle";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_ANGLE_DESC = "The general direction of the wind";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_CLOUDS_TITLE = "Clouds";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_CLOUDS_DESC = "The percentage of the sky covered by clouds";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_EMOJI_TITLE = "Emoji";
    Kano.MakeApps.Msg.PART_DATA_WEATHER_EMOJI_DESC = "The emoji matching the weather";

    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_TITLE = "Source";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_HEADLINES = "Headlines";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_WORLD = "World";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_UK = "UK";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_EDUCATION = "Education";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_SCI_ENV = "Science & Environment";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_TECH = "Technology";
    Kano.MakeApps.Msg.PART_DATA_RSS_SOURCE_ENT_ARTS = "Entertainment & Art";

    Kano.MakeApps.Msg.PART_DATA_RSS_TITLE_TITLE = "Title";
    Kano.MakeApps.Msg.PART_DATA_RSS_TITLE_DESC = "The title of the article";

    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_TITLE = "Sport";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_HEADLINES = "Headlines";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_FOOTBALL = "Football";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_CRICKET = "Cricket";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_RUGBY_UNION = "Rugby Union";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_RUGBY_LEAGUE = "Rugby League";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_TENNIS = "Tennis";
    Kano.MakeApps.Msg.PART_DATA_SPORTS_SPORT_GOLF = "Golf";

    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_UP = "gesture up";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_DOWN = "gesture down";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_LEFT = "gesture left";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_RIGHT = "gesture right";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_NEAR = "gesture near";
    Kano.MakeApps.Msg.PART_GESTURE_SENSOR_FAR = "gesture far";

    Kano.MakeApps.Msg.PART_GYRO_ACCELEROMETER_READ_DATA = "reads data";

    Kano.MakeApps.Msg.PART_MOTION_SENSOR_START = "movement starts";
    Kano.MakeApps.Msg.PART_MOTION_SENSOR_END = "movement ends";

    Kano.MakeApps.Msg.KANO_WORKSPACE_HEAD_SAVE = "Save";

    Kano.MakeApps.Msg.KANO_WORKSPACE_TOOLBAR_CLOSE = "close";
    Kano.MakeApps.Msg.KANO_WORKSPACE_TOOLBAR_ADD_PARTS = "add parts";
    Kano.MakeApps.Msg.KANO_WORKSPACE_TOOLBAR_DONE = "Done";
    Kano.MakeApps.Msg.KANO_WORKSPACE_TOOLBAR_EDIT_LAYOUT = "Edit Layout";

    Kano.MakeApps.Msg.KANO_SIDE_MENU_LOGIN = "Connexion";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_LEVEL = "Niveau";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_RESET_WORKSPACE = "Effacer";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_EXPORT = "Exporter";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_IMPORT = "Importer";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_BACK_TO_PROJECTS = "Retourner aux Projets";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_GIVE_FEEDBACK = "Donne ton Avis";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_EXIT = "Quitter";
    Kano.MakeApps.Msg.KANO_SIDE_MENU_LOG_OUT = "Déconnexion";

    Kano.MakeApps.Msg.KANO_SHARE_MODAL_RECORDING = "Recording your gif";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_BEGIN_RECORDING = "Click to begin recording your gif";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_START_RECORDING = "Start recording your animated gif";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_CLOSE = Kano.MakeApps.Msg.CLOSE;
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_MAKE_GIF = "Make a gif instead";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_SHARE_ON_WORLD = "Share on Kano World";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_COPY = "copy";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_GET_SHARE_LINK = "Get share link";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_BRING_TO_LIFE = "Bring your own creation to life";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_BUILD_YOUR_OWN = "build your own";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_PUBLISHING = "Publishing";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_APP_IS_LIVE = "Your app is live! Share it with your friends.";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_OPEN_APP = "Open app";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_PUBLISHING_FAILED = "Publishing failed";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_TRY_LATER = "Please try again later.";
    Kano.MakeApps.Msg.KANO_SHARE_MODAL_UNFORTUNATE = "This is unfortunate";

    Kano.MakeApps.Msg.KANO_CHALLENGE_COMPLETED_MODAL_CHALLENGE_COMPLETED = "Challenge Completed";
    Kano.MakeApps.Msg.KANO_CHALLENGE_COMPLETED_MODAL_XP_EARNED = "You've just earned";
    Kano.MakeApps.Msg.KANO_CHALLENGE_COMPLETED_MODAL_XP = "XP";
    Kano.MakeApps.Msg.KANO_CHALLENGE_COMPLETED_MODAL_GOT_IT = "GOT IT";
    Kano.MakeApps.Msg.KANO_CHALLENGE_COMPLETED_MODAL_COMPLIMENT = "Nice work!";


})(window.Kano = window.Kano || {});
